import io
import json
import logging
from os import getenv
import uuid
import xlsxwriter
from django.contrib.auth import logout, authenticate, login, get_user_model, password_validation
from django.contrib.auth.forms import _unicode_ci_compare
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.views import INTERNAL_RESET_SESSION_TOKEN
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMultiAlternatives
from django.db import ProgrammingError, OperationalError
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect
from django.contrib import messages
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from decimal import *
from tgbot import message_for_bot
from tgbot.message_for_bot import a
from tgbot.models import Event, Memcache, User_Bot
from . import tokemon
from .Tron import TronClient
from .forms import CreateUserForm
from .models import Profile, Matrix, User_in_Matrix, Wallet, Transaction, Category_Bronze, All, First_Line, \
    Second_Line, Third_Line, Category_Silver, Category_Gold, Category_Emerald, Buy_Card, Card, DeepLink, \
    History_Transactions, History_card
from .serializers import ProfileSerializer, AllSerializer
import requests
from django.template import loader
from django.utils.encoding import force_bytes
from django.core.exceptions import ValidationError

# Лог выводим на экран и в файл
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("debug.log"),
        logging.StreamHandler()
    ]
)

tc = TronClient()


def send_message_tgbot(message, id):
    token = getenv('TELEGRAM_TOKEN')
    if User_Bot.objects.filter(profile__id=id).exists():
        chat_id = User_Bot.objects.get(profile__id=id).chat_id
        url_req = "https://api.telegram.org/bot" + token + "/sendMessage" + "?chat_id=" + str(chat_id) + "&text=" + \
                  message
        requests.get(url_req)
        return 1
    return 0


@api_view(['GET'])
def getRoutes(request):
    routes = [
        {
            'Endpoint': '/login/',
            'method': 'POST',
            'body': None,
            'description': 'LoginForm'
        },
        {
            'Endpoint': '/login/',
            'method': 'GET',
            'body': None,
            'description': 'Returns a single note object'
        },
        {
            'Endpoint': '/user/',
            'method': 'GET',
            'body': None,
            'description': 'Returns a single note object'
        },
        {
            'Endpoint': '/logout/',
            'method': 'GET',
            'body': None,
            'description': 'Returns a single note object'
        },
        {
            'Endpoint': '/register/',
            'method': 'POST',
            'body': None,
            'description': 'Returns a single note object'
        },
        {
            'Endpoint': '/password-reset/',
            'method': 'POST',
            'body': None,
            'description': 'Returns a single note object'
        },
        {
            'Endpoint': '/bronze/id_/',
            'method': 'GET',
            'body': None,
            'description': 'Returns a single note object'
        },
        {
            'Endpoint': '/silver/id_/',
            'method': 'GET',
            'body': None,
            'description': 'Returns a single note object'
        },
        {
            'Endpoint': '/gold/id_/',
            'method': 'GET',
            'body': None,
            'description': 'Returns a single note object'
        },
        {
            'Endpoint': '/emerald/id_/',
            'method': 'GET',
            'body': None,
            'description': 'Returns a single note object'
        },
        {
            'Endpoint': '/get_all/',
            'method': 'GET',
            'body': None,
            'description': 'Returns a single note object'
        },
        {
            'Endpoint': '/send_message_tgbot/',
            'method': 'GET',
            'body': None,
            'description': 'Returns a single note object'
        },
        {
            'Endpoint': '/?utm/utm/',
            'method': 'GET',
            'body': None,
            'description': 'Returns a single note object'
        },
        {
            'Endpoint': '/referral/',
            'method': 'GET',
            'body': None,
            'description': 'Returns a single note object'
        },
        {
            'Endpoint': '/dis/',
            'method': 'POST',
            'body': None,
            'description': 'Returns a single note object'
        },

    ]
    return Response(routes)


@api_view(['GET'])
def trans_get_output(request):
    if Profile.objects.filter(user_id=request.user.id).exists():
        profile = Profile.objects.get(user_id=request.user.id)
        if History_Transactions.objects.filter(user_id=profile.id).filter(success=True).exists():
            ht = History_Transactions.objects.filter(user_id=profile.id).filter(success=True)
            data = []
            for el in ht:
                if el.success and el.name_operation == 'Output':
                    time = el.data.time()
                    t = str(time.hour) + ':' + str(time.minute) + ':' + str(time.second)
                    d = str(el.data.date().year) + '.' + str(el.data.date().month) + ':' + str(el.data.date().day)
                    main = {
                        'quantity': int(el.quantity),
                        'data': d,
                        'time': t,
                        'txid': el.txid,
                    }
                    data.append(main)
            return Response(data=data)
    main = {
        'quantity': [],
        'data': [],
        'time': [],
        'txid': [],
    }
    return Response(data=main)


@api_view(['GET'])
def trans_get_input(request):
    if Profile.objects.filter(user_id=request.user.id).exists():
        profile = Profile.objects.get(user_id=request.user.id)
        if History_Transactions.objects.filter(user_id=profile.id).filter(success=True).exists():
            ht = History_Transactions.objects.filter(user_id=profile.id).filter(success=True)
            data = []
            for el in ht:
                if el.success and el.name_operation == 'Input':
                    time = el.data.time()
                    t = str(time.hour) + ':' + str(time.minute) + ':' + str(time.second)
                    d = str(el.data.date().year) + '.' + str(el.data.date().month) + ':' + str(el.data.date().day)
                    main = {
                        'quantity': int(el.quantity),
                        'data': d,
                        'time': t,
                        'txid': el.txid,
                    }
                    data.append(main)
            return Response(data=data)
    main = {
        'quantity': [],
        'data': [],
        'time': [],
        'txid': [],
    }
    return Response(data=main)


def create_all_and_admin():
    if not Profile.objects.filter(admin_or=True).exists():
        if User.objects.filter(username='admin').exists():
            user = User.objects.get(username='admin')
            profile2 = Profile()
            profile2.user = user
            profile2.admin_or = True
            wallet = tc.create_wallet()
            w = Wallet(address=wallet['base58check_address'], pkey=wallet['private_key'])
            w.save()
            profile2.wallet = w.id
            print("central_wallet_create. id={}".format(w.address))
            profile2.save()
        else:
            user = User.objects.create_superuser('admin', '', 'admin')
            user.save()
            # user.username = 'admin'
            # user.set_password('admin123QwER')
            # user.is_superuser = True
            # user.save()
            profile2 = Profile()
            profile2.admin_or = True
            profile2.user = user
            wallet = tc.create_wallet()
            w = Wallet(address=wallet['base58check_address'], pkey=wallet['private_key'])
            w.save()
            profile2.wallet = w.id
            print("central_wallet_create. id={}".format(w.address))
            profile2.save()

    if not All.objects.all().exists():
        a = All()
        a.save()


@api_view(['GET'])
def get_user_in_card(request):
    if Profile.objects.filter(user_id=request.user.id).exists():
        profile_2 = Profile.objects.get(user_id=request.user.id)
        if User_in_Matrix.objects.filter(user_id=profile_2.id).exists():
            profile = User_in_Matrix.objects.filter(user_id=profile_2.id)
            bronze = [[], [], [], [], [], []]
            silver = [[], [], [], [], [], []]
            gold = [[], [], [], [], [], []]
            emerald = [[], [], [], [], [], []]
            for el in profile:
                card_ = el.card
                if card_.card.category == 'bronze':
                    if len(bronze[int(card_.card.name) - 1]) == 0:
                        bronze[int(card_.card.name) - 1].append(el.d * 25)
                        bronze[int(card_.card.name) - 1].append(el.total_wins)
                        bronze[int(card_.card.name) - 1].append(el.all_wins)
                    else:
                        bronze[int(card_.card.name) - 1][0] = el.d * 25
                        bronze[int(card_.card.name) - 1][1] += el.total_wins
                        bronze[int(card_.card.name) - 1][2] += el.all_wins
                elif card_.card.category == 'silver':
                    if len(silver[int(card_.card.name) - 1]) == 0:
                        silver[int(card_.card.name) - 1].append(el.d * 25)
                        silver[int(card_.card.name) - 1].append(el.total_wins)
                        silver[int(card_.card.name) - 1].append(el.all_wins)
                    else:
                        silver[int(card_.card.name) - 1][0] = el.d * 25
                        silver[int(card_.card.name) - 1][1] += el.total_wins
                        silver[int(card_.card.name) - 1][2] += el.all_wins
                elif card_.card.category == 'gold':
                    if len(gold[int(card_.card.name) - 1]) == 0:
                        gold[int(card_.card.name) - 1].append(el.d * 25)
                        gold[int(card_.card.name) - 1].append(el.total_wins)
                        gold[int(card_.card.name) - 1].append(el.all_wins)
                    else:
                        gold[int(card_.card.name) - 1][0] = el.d * 25
                        gold[int(card_.card.name) - 1][1] += el.total_wins
                        gold[int(card_.card.name) - 1][2] += el.all_wins
                else:
                    if len(emerald[int(card_.card.name) - 1]) == 0:
                        emerald[int(card_.card.name) - 1].append(el.d * 25)
                        emerald[int(card_.card.name) - 1].append(el.total_wins)
                        emerald[int(card_.card.name) - 1].append(el.all_wins)
                    else:
                        emerald[int(card_.card.name) - 1][0] = el.d * 25
                        emerald[int(card_.card.name) - 1][1] += el.total_wins
                        emerald[int(card_.card.name) - 1][2] += el.all_wins
            for el in bronze:
                if len(el) == 0:
                    el.append(0)
                    el.append(0)
                    el.append(0)
            for el in emerald:
                if len(el) == 0:
                    el.append(0)
                    el.append(0)
                    el.append(0)
            for el in silver:
                if len(el) == 0:
                    el.append(0)
                    el.append(0)
                    el.append(0)
            for el in gold:
                if len(el) == 0:
                    el.append(0)
                    el.append(0)
                    el.append(0)
            data = {'bronze': bronze, 'silver': silver, 'gold': gold, 'emerald': emerald}
            return Response(data=data)
    return Response(status=400)


@api_view(['GET'])
def get_user_in_matrix(request):
    if Profile.objects.filter(user_id=request.user.id).exists():
        profile = Profile.objects.get(user_id=request.user.id)
        if User_in_Matrix.objects.filter(user_id=profile.id).exists():
            profile = User_in_Matrix.objects.filter(user_id=profile.id)
            data = {
                'bronze': [],
                'silver': [],
                'gold': [],
                'emerald': []
            }
            for elg in profile:
                card_ = elg.card
                if card_.card.category == 'bronze':
                    i = 0
                    for el in data['bronze']:
                        if el == card_.card.name:
                            i += 1
                    if i == 0:
                        data['bronze'].append(card_.card.name)
                elif card_.card.category == 'silver':
                    i = 0
                    for el in data['silver']:
                        if el == card_.card.name:
                            i += 1
                    if i == 0:
                        data['silver'].append(card_.card.name)
                elif card_.card.category == 'gold':
                    i = 0
                    for el in data['gold']:
                        if el == card_.card.name:
                            i += 1
                    if i == 0:
                        data['gold'].append(card_.card.name)
                else:
                    i = 0
                    for el in data['emerald']:
                        if el == card_.card.name:
                            i += 1
                    if i == 0:
                        data['emerald'].append(card_.card.name)
            return Response(data=data)
        else:
            data = {
                'bronze': [],
                'silver': [],
                'gold': [],
                'emerald': []
            }
            return Response(data=data)
    else:
        return Response(status=400)


@api_view(['GET'])
def get_all(request):
    all_ = All.objects.all().first()
    data = AllSerializer(all_)
    return Response(data.data)


@api_view(['GET'])
def get_link_tg(request):
    if Profile.objects.filter(user_id=request.user.id).exists():
        profile = Profile.objects.get(user_id=request.user.id)
        if DeepLink.objects.filter(profile=profile.id).exists():
            user_bot = DeepLink.objects.get(profile=profile.id)
            data = {
                'link_tg': user_bot.deep_link
            }
            return Response(data=data, status=200)
    return Response(status=401)


@api_view(['GET'])
def get_prohibitions(request):
    data = {
        'bronze': [],
        'silver': [],
        'gold': [],
        'emerald': []
    }
    if Profile.objects.filter(user=request.user).exists():
        profile = Profile.objects.get(user=request.user)
    else:
        return Response(status=400)
    name = 'bronze'
    for id_ in range(1, 7):
        data[name].append(check_prohibition(name, id_, profile))
    name = 'silver'
    for id_ in range(1, 7):
        data[name].append(check_prohibition(name, id_, profile))
    name = 'gold'
    for id_ in range(1, 7):
        data[name].append(check_prohibition(name, id_, profile))
    name = 'emerald'
    for id_ in range(1, 7):
        data[name].append(check_prohibition(name, id_, profile))
    return Response(data=data)


@api_view(['POST'])
def PasswordResetView(request):
    save_2(email=request.data['email'], domain_override='tokemon.games')
    return Response(status=200)


@api_view(['POST'])
def Password_set(request):
    uidb64 = request.data['uid']
    token = request.data['token']
    validlink = False
    reset_url_token = "set-password"
    user = get_user_set_password(uidb64)
    token_generator = default_token_generator
    if user is not None:
        token = token
        if token == reset_url_token:
            session_token = request.session.get(INTERNAL_RESET_SESSION_TOKEN)
            if token_generator.check_token(user, session_token):
                # If the token is valid, display the password reset form.
                validlink = True
        else:
            if token_generator.check_token(user, token):
                # Store the token in the session and redirect to the
                # password reset form at a URL without the token. That
                # avoids the possibility of leaking the token in the
                # HTTP Referer header.
                request.session[INTERNAL_RESET_SESSION_TOKEN] = token
                redirect_url = request.path.replace(
                    token, reset_url_token
                )
            else:
                return Response(status=400)
    password1 = request.data['password1']
    password2 = request.data['password2']
    if password1 and password2:
        if password1 == password2:
            password_validation.validate_password(password2, user)
        else:
            return Response(status=400)
    else:
        return Response(status=400)
    password = password2
    user.set_password(password)
    user.save()
    return Response(status=200)


def get_user_set_password(uidb64):
    UserModel = get_user_model()
    try:
        # urlsafe_base64_decode() decodes to bytestring
        uid = urlsafe_base64_decode(uidb64).decode()
        user = UserModel._default_manager.get(pk=uid)
    except (
            TypeError,
            ValueError,
            OverflowError,
            UserModel.DoesNotExist,
            ValidationError,
    ):
        user = None
    return user


def send_mail(
        subject_template_name,
        email_template_name,
        context,
        from_email,
        to_email,
        html_email_template_name=None,
):
    """
    Send a django.core.mail.EmailMultiAlternatives to `to_email`.
    """
    subject = loader.render_to_string(subject_template_name, context)
    # Email subject *must not* contain newlines
    subject = "".join(subject.splitlines())
    body = loader.render_to_string(email_template_name, context)

    email_message = EmailMultiAlternatives(subject, body, from_email, [to_email])
    if html_email_template_name is not None:
        html_email = loader.render_to_string(html_email_template_name, context)
        email_message.attach_alternative(html_email, "text/html")

    email_message.send()


def get_users(email):
    """Given an email, return matching user(s) who should receive a reset.

    This allows subclasses to more easily customize the default policies
    that prevent inactive users and users with unusable passwords from
    resetting their password.
    """
    UserModel = get_user_model()
    email_field_name = UserModel.get_email_field_name()
    active_users = UserModel._default_manager.filter(
        **{
            "%s__iexact" % email_field_name: email,
            "is_active": True,
        }
    )
    return (
        u
        for u in active_users
        if u.has_usable_password()
           and _unicode_ci_compare(email, getattr(u, email_field_name))
    )


def save_2(
        domain_override=None,
        subject_template_name="registration/password_reset_subject.txt",
        email_template_name="registration/password_reset_email.html",
        use_https=False,
        token_generator=default_token_generator,
        from_email=None,
        request=None,
        html_email_template_name=None,
        extra_email_context=None,
        email=None
):
    """
    Generate a one-use only link for resetting password and send it to the
    user.
    """
    email = email
    if not domain_override:
        current_site = get_current_site(request)
        site_name = current_site.name
        domain = current_site.domain
    else:
        site_name = domain = domain_override
    UserModel = get_user_model()
    email_field_name = UserModel.get_email_field_name()
    for user in get_users(email):
        user_email = getattr(user, email_field_name)
        context = {
            "email": user_email,
            "domain": domain,
            "site_name": site_name,
            "uid": urlsafe_base64_encode(force_bytes(user.pk)),
            "user": user,
            "token": token_generator.make_token(user),
            "protocol": "https" if use_https else "http",
            **(extra_email_context or {}),
        }
        send_mail(
            subject_template_name,
            email_template_name,
            context,
            from_email,
            user_email,
            html_email_template_name=html_email_template_name,
        )


def check_prohibition(name, id_, profile):
    if User_in_Matrix.objects.filter(user=profile).filter(matrix__up=True).filter(
            card__card__category=name).filter(card__card__name=id_).exists():
        us_pr = User_in_Matrix.objects.filter(user=profile).filter(card__card__category=name).filter(
            card__card__name=id_).get(matrix__up=True).d
        if us_pr < 4:
            return False
        else:
            if User_in_Matrix.objects.filter(user=profile).filter(matrix__up=False).filter(
                    card__card__category=name).filter(card__card__name=id_).count() == 1:
                return False
            return True
    else:
        if User_in_Matrix.objects.filter(user=profile).filter(matrix__up=False).filter(
                card__card__category=name).filter(card__card__name=id_).count() == 1:
            return False
        return True


@api_view(['GET'])
def get_referrals(request):
    total_line = 0
    missed_amount = 0
    if Profile.objects.filter(user__id=request.user.id).exists():
        profile = Profile.objects.get(user__id=request.user.id)
        if First_Line.objects.filter(main_user=profile).exists():
            total_line += First_Line.objects.get(main_user=profile).total_person
            missed_amount += First_Line.objects.get(main_user=profile).lost_profit
        if Second_Line.objects.filter(main_user__user_id=profile.id).exists():
            total_line += Second_Line.objects.get(main_user=profile).total_person
            missed_amount += Second_Line.objects.get(main_user=profile).lost_profit
        if Third_Line.objects.filter(main_user__user_id=profile.id).exists():
            total_line += Third_Line.objects.get(main_user=profile).total_person
            missed_amount += Third_Line.objects.get(main_user=profile).lost_profit
        data = {
            'total_line': total_line,
            'profit': profile.referral_amount,
            'lost': missed_amount,
            'link': profile.referral_link
        }
        return Response(data, status=200)
    else:
        return Response(status=400)


try:
    if All.objects.all() is not None:
        if not All.objects.all().exists():
            cr_win_m = All.objects.create()
            cr_win_m.save()
        create_all_and_admin()
    elif not All.objects.all().exists():
        All.objects.create().save()
except ProgrammingError:
    print("error")
except OperationalError:
    print("error")


def import_users(request):
    output = io.BytesIO()
    workbook = xlsxwriter.Workbook(output)
    worksheet = workbook.add_worksheet()
    all_user = Profile.objects.all()
    worksheet.write(0, 0, 'Имя')
    worksheet.write(0, 1, 'Email')
    worksheet.write(0, 2, 'UTM личная')
    worksheet.write(0, 3, 'Полученная прибыль с рефералов')
    worksheet.write(0, 4, 'Упущено')
    worksheet.write(0, 5, 'Кошелек')
    worksheet.write(0, 6, 'Максимальная купленная карта')
    worksheet.write(0, 7, 'Деньги')
    i = 1
    for el in all_user:
        j = 0
        worksheet.write(i, j, el.user.username)
        j += 1
        if el.user.email == '':
            worksheet.write(i, j, 'не указано')
        else:
            worksheet.write(i, j, el.user.email)
        j += 1
        worksheet.write(i, j, el.referral_link)
        j += 1

        worksheet.write(i, j, el.referral_amount)
        j += 1
        worksheet.write(i, j, el.missed_amount)
        j += 1
        if el.wallet is None:
            worksheet.write(i, j, 'Не указано')
        else:
            worksheet.write(i, j, el.wallet)
        j += 1
        if el.max_card is None:
            worksheet.write(i, j, 'Не было куплено ни одной карты')
        else:
            worksheet.write(i, j, el.max_card)
        j += 1
        worksheet.write(i, j, el.money)
        i += 1
    # output.seek(0)
    workbook.close()
    xlsx_data = output.getvalue()
    response = HttpResponse(content_type='application/vnd.ms-excel')
    response['Content-Disposition'] = 'attachment; filename=Users.xlsx'
    response.write(xlsx_data)
    return response


@api_view(['GET'])
def user_get(request):
    # profile = Profile.objects.get(user=request.user)
    if Profile.objects.filter(user_id=request.user.id).exists():
        profile = Profile.objects.get(user_id=request.user.id)
        data = ProfileSerializer(profile)
        return Response(data.data)
    else:
        return Response(status=400)


@api_view(['GET', 'POST'])
def login_page(request):
    if request.user.is_authenticated:
        return Response(status=501)
    elif request.method == 'GET':
        return Response(status=200)
    else:
        email = request.data.get('email')
        if email is None or email == '':
            return Response(status=400)
        if User.objects.filter(email=email).exists():
            username = User.objects.get(email=email).username
        else:
            return Response(status=400)
        # username = request.POST.get('email')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            request.session.modified = True
            return Response(200)
        else:
            return Response(status=400)


@api_view(['GET'])
def logout_user(request):
    request.session.modified = True
    logout(request)
    return Response(status=200)


@api_view(['GET'])
def utm(request, utm):
    if utm is None or utm == '' or utm == 'null':
        return Response("No")
    cookies = request.COOKIES.get('utm')
    if cookies is None or cookies == '':
        response = Response()
        response.set_cookie("utm", utm, samesite='Lax')
        return response
    else:
        return Response('Yes')


@api_view(['POST'])
def register_page(request):
    # form = CreateUserForm(request.data)
    data = {
        'username': request.data['email'],
        'password1': request.data['password1'],
        'email': request.data['email'],
        'password2': request.data['password2'],
    }
    form = CreateUserForm(data)
    utm = request.data.get('utm')
    if utm is None:
        if request.data.get('utm') is not None:
            utm = request.data.get('utm')
    if User.objects.filter(email=request.data['email']).exists():
        return Response(status=400)
    main_user = None
    line_th = None
    line_two = None
    if Profile.objects.filter(referral_link=utm).exists():
        main_user = Profile.objects.get(referral_link=utm)
        if First_Line.objects.filter(main_user=main_user).exists():
            line_one = First_Line.objects.get(main_user=main_user)
            line_one.total_person += 1
            line_one.save()
        else:
            line_one = First_Line.objects.create(main_user=main_user)
            line_one.total_person += 1
            line_one.save()
        if main_user.line_1 is not None:
            main_user_2 = First_Line.objects.get(id=main_user.line_1).main_user
            if Second_Line.objects.filter(main_user=main_user_2).exists():
                line_two = Second_Line.objects.get(main_user=main_user_2)
                line_two.total_person += 1
                line_two.save()
            else:
                line_two = Second_Line.objects.create(main_user=main_user_2)
                line_two.total_person += 1
                line_two.save()
            if main_user_2.line_1 is not None:
                main_user_3 = First_Line.objects.get(id=main_user_2.line_1).main_user
                if Third_Line.objects.filter(main_user=main_user_3).exists():
                    line_th = Third_Line.objects.get(main_user=main_user_3)
                    line_th.total_person += 1
                    line_th.save()
                else:
                    line_th = Third_Line.objects.create(main_user=main_user_3)
                    line_th.total_person += 1
                    line_th.save()
    else:
        line_one = None
    if form.is_valid():
        form.save()
        username = form.cleaned_data.get('username')
        user = User.objects.get(username=username)
        profile = Profile.objects.create(user=user)
        profile.referral_link = profile.id
        profile.save()
        wallet = tc.create_wallet()
        w = Wallet.objects.create(address=wallet['base58check_address'], pkey=wallet['private_key'])
        profile.wallet = w.address
        profile.wallet_output = w.pkey
        w.save()
        if line_one is not None:
            profile.line_1 = line_one.id
        if line_two is not None:
            line_two.save()
            profile.line_2 = line_two.id
        if line_th is not None:
            line_th.save()
            profile.line_3 = line_th.id
        profile.save()
        if main_user is not None:
            mes = message_for_bot.a['register'].format(profile.id)
            send_message_tgbot(mes, main_user.id)
        # messages.success(request, 'Аккаунт создан,' + username)
        message = a['bot'].format(request.data['password1'], request.data['email'])
        Event.objects.create(message=message, user_id=profile.id)
        memcache = uuid.uuid4().hex[:6].upper()
        Memcache.objects.create(user=profile.id, memcache=memcache)
        deep_link = 'https://t.me/Tokemon_game_Bot?start=' + str(memcache)
        DeepLink.objects.create(profile=profile.id, deep_link=deep_link)
        alo = All.objects.all().first()
        alo.coll_user += 1
        alo.save()
        return Response(status=200)
    else:
        messages.error(request, 'Неверный ввод')
    return Response(status=400)


def what_card(card, category_bronze):
    if card == 'card_1':
        money_to_card = category_bronze.card_1
    elif card == 'card_2':
        money_to_card = category_bronze.card_2
    elif card == 'card_3':
        money_to_card = category_bronze.card_3
    elif card == 'card_4':
        money_to_card = category_bronze.card_4
    elif card == 'card_5':
        money_to_card = category_bronze.card_5
    else:
        money_to_card = category_bronze.card_6
    return money_to_card


def save(*args):
    for el in args:
        el.save()


# получение уведомления
def case_3_4_ref(main_user, money_to_card, profile, price, admin_):
    all_ = All.objects.all().first()
    second_line = False
    third_line = False
    if Second_Line.objects.filter(id=profile.line_2).exists():
        second_line = True
    if Third_Line.objects.filter(id=profile.line_3).exists():
        third_line = True
    # Переписываю
    if second_line:
        second = Second_Line.objects.get(id=profile.line_2).main_user
        if not Buy_Card.objects.filter(user=second).filter(card__price=price).exists():
            admin_.money += money_to_card * Decimal('0.04')
            admin_.save()
        else:
            mes = message_for_bot.a['bonus'].format(money_to_card * Decimal('0.04'), profile.id)
            send_message_tgbot(mes, second.id)
            second.money += money_to_card * Decimal('0.04')
            if User_in_Matrix.objects.filter(user=second).filter(matrix__price=price).exists():
                for el in User_in_Matrix.objects.filter(matrix__price=price).filter(user=second):
                    el.all_wins += money_to_card * Decimal('0.04')
                    el.save()
            second.save()
            second = Second_Line.objects.get(id=profile.line_2).main_user
            sq = Second_Line.objects.get(main_user=second)
            sq.profit += money_to_card * Decimal('0.04')
            sq.save()
            second.referral_amount += money_to_card * Decimal('0.04')
            ref_card_dob(second, money_to_card * Decimal('0.04'))
            second.save()
    else:
        admin_.money += money_to_card * Decimal('0.04')
        admin_.save()
    if third_line:
        th = Third_Line.objects.get(id=profile.line_3).main_user
        if not Buy_Card.objects.filter(user=th).filter(card__price=price).exists():
            admin_.money += money_to_card * Decimal('0.04')
            admin_.save()
        else:
            th.money += money_to_card * Decimal('0.01')
            mes = message_for_bot.a['bonus'].format(money_to_card * Decimal('0.01'), profile.id)
            send_message_tgbot(mes, th.id)
            if User_in_Matrix.objects.filter(matrix__price=price).filter(user=th).exists():
                for el in User_in_Matrix.objects.filter(matrix__price=price).filter(user=th):
                    el.all_wins += money_to_card * Decimal('0.01')
                    el.save()
            th.save()
            th = Third_Line.objects.get(id=profile.line_3).main_user
            sq = Third_Line.objects.get(main_user=th)
            sq.profit += money_to_card * Decimal('0.01')
            sq.save()
            ref_card_dob(th, money_to_card * Decimal('0.01'))
            th.referral_amount += money_to_card * Decimal('0.01')
            th.save()
    else:
        admin_.money += money_to_card * Decimal('0.01')
        admin_.save()
    main_user.money += money_to_card * Decimal('0.1')
    mes = message_for_bot.a['bonus'].format((money_to_card * Decimal('0.1')), profile.id)
    send_message_tgbot(mes, main_user.id)
    all_.money += money_to_card
    profile.money -= money_to_card
    #
    ref_card_dob(main_user, money_to_card * Decimal('0.1'))
    main_user.referral_amount += money_to_card * Decimal('0.1')
    fo = First_Line.objects.get(main_user=main_user)
    fo.profit += money_to_card * Decimal('0.1')
    fo.save()
    if User_in_Matrix.objects.filter(user=main_user).filter(matrix__price=price).exists():
        for el in User_in_Matrix.objects.filter(matrix__price=price).filter(user=main_user):
            el.all_wins += money_to_card * Decimal('0.1')
            el.save()
    # Конец новой записи
    #
    # if not second_line and not third_line:
    #     admin_.money += money_to_card * Decimal('0.05')
    #     main_user.money += money_to_card * Decimal('0.1')
    #     mes = message_for_bot.a['bonus'].format((money_to_card * Decimal('0.1')), profile.id)
    #     send_message_tgbot(mes, main_user.id)
    #     all_.money += money_to_card
    #     profile.money -= money_to_card
    # # четвертый случай
    # elif not third_line:
    #     admin_.money += money_to_card * Decimal('0.01')
    #     admin_.save()
    #     profile.money -= money_to_card
    #     mes = message_for_bot.a['bonus'].format(money_to_card * Decimal('0.1'), profile.id)
    #     send_message_tgbot(mes, main_user.id)
    #     main_user.money += money_to_card * Decimal('0.1')
    #     second = Second_Line.objects.get(id=profile.line_2).main_user
    #     mes = message_for_bot.a['bonus'].format(money_to_card * Decimal('0.04'), profile.id)
    #     send_message_tgbot(mes, second.id)
    #     second.money += money_to_card * Decimal('0.04')
    #     if User_in_Matrix.objects.filter(user=second).filter(matrix__price=price).exists():
    #         for el in User_in_Matrix.objects.filter(matrix__price=price).filter(user=second):
    #             el.all_wins += money_to_card * Decimal('0.04')
    #             el.save()
    #     second.save()
    #     all_.money += money_to_card
    # else:
    #     profile.money -= money_to_card
    #     main_user.money += money_to_card * Decimal('0.1')
    #     mes = message_for_bot.a['bonus'].format(money_to_card * Decimal('0.1'), profile.id)
    #     send_message_tgbot(mes, main_user.id)
    #     second = Second_Line.objects.get(id=profile.line_2).main_user
    #     second.money += money_to_card * Decimal('0.04')
    #     mes = message_for_bot.a['bonus'].format(money_to_card * Decimal('0.04'), profile.id)
    #     send_message_tgbot(mes, second.id)
    #     second.save()
    #     if User_in_Matrix.objects.filter(matrix__price=price).filter(user=second).exists():
    #         for el in User_in_Matrix.objects.filter(matrix__price=price).filter(user=second):
    #             el.all_wins += money_to_card * Decimal('0.04')
    #             el.save()
    #     th = Third_Line.objects.get(id=profile.line_3).main_user
    #     th.money += money_to_card * Decimal('0.01')
    #     mes = message_for_bot.a['bonus'].format(money_to_card * Decimal('0.01'), profile.id)
    #     send_message_tgbot(mes, th.id)
    #     if User_in_Matrix.objects.filter(matrix__price=price).filter(user=th).exists():
    #         for el in User_in_Matrix.objects.filter(matrix__price=price).filter(user=th):
    #             el.all_wins += money_to_card * Decimal('0.01')
    #             el.save()
    #     th.save()
    #     all_.money += money_to_card
    # ref_card_dob(main_user, money_to_card * Decimal('0.1'))
    # main_user.referral_amount += money_to_card * Decimal('0.1')
    # fo = First_Line.objects.get(main_user=main_user)
    # fo.profit += money_to_card * Decimal('0.1')
    # fo.save()
    # if User_in_Matrix.objects.filter(user=main_user).filter(matrix__price=price).exists():
    #     for el in User_in_Matrix.objects.filter(matrix__price=price).filter(user=main_user):
    #         el.all_wins += money_to_card * Decimal('0.1')
    #         el.save()
    # if second_line:
    #     second = Second_Line.objects.get(id=profile.line_2).main_user
    #     sq = Second_Line.objects.get(main_user=second)
    #     sq.profit += money_to_card * Decimal('0.04')
    #     sq.save()
    #     second.referral_amount += money_to_card * Decimal('0.04')
    #     ref_card_dob(second, money_to_card * Decimal('0.04'))
    #     second.save()
    # if third_line:
    #     th = Third_Line.objects.get(id=profile.line_3).main_user
    #     sq = Third_Line.objects.get(main_user=th)
    #     sq.profit += money_to_card * Decimal('0.01')
    #     sq.save()
    #     ref_card_dob(th, money_to_card * Decimal('0.01'))
    #     th.referral_amount += money_to_card * Decimal('0.01')
    #     th.save()
    save(main_user, all_, profile, admin_)


def ref_card_dob(user, money):
    if Buy_Card.objects.filter(user=user).filter(card__price=money).exists():
        tq = Buy_Card.objects.filter(user=user).filter(card__price=money).order_by(
            '-time').first()
        tq.ref_profit += money
        tq.save()


def ref_card_tot(user, money):
    if Buy_Card.objects.filter(user=user).filter(card__price=money).exists():
        tq = Buy_Card.objects.filter(user=user).filter(card__price=money).order_by(
            '-time').first()
        tq.total_wins += money
        tq.save()


# Логика реферальной системы
@api_view(['GET'])
def referral_system_bronze(request, id_):
    # Сбор данных
    # profile = Profile.objects.get(user=request.user)
    # if User_in_Matrix.objects.filter(user=profile).filter(matrix__up=True).filter(
    # card__card__category='bronze').filter(
    #         card__card__name=id_).exists():
    #     us_pr = User_in_Matrix.objects.filter(user=profile).filter(card__card__category='bronze').filter(
    #         card__card__name=id_).get(matrix__up=True).d
    #     if us_pr < 4:
    #         return Response(status=400)
    # card = 'card_' + str(id_)
    # all_ = All.objects.all().first()
    # if profile.line_1 is not None:
    #     main_user = First_Line.objects.get(id=profile.line_1).main_user
    # else:
    #     main_user = None
    # if Category_Bronze.objects.filter(user__id=profile.id).exists():
    #     category_bronze = Category_Bronze.objects.get(user__id=profile.id)
    # else:
    #     category_bronze = Category_Bronze()
    #     category_bronze.user = profile
    # # Проверка блокировки карты для пользователя
    # if id_ == 6 and category_bronze.card_6_disable is False:
    #     print('error')
    #     return Response(status=400)
    # else:
    #     money_to_card = what_card(card, category_bronze)
    # money_to_card = Decimal(money_to_card)  # Стоимость карты
    # if profile.money < money_to_card:
    #     print('error, money')
    #     return Response(status=400)
    # # Второй случай (Если человек заходит без реф. ссылки, то 15% админу.)
    # if main_user is None:
    #     admin_.money += money_to_card * Decimal('0.15')
    #     profile.money -= money_to_card
    #     all_.money += money_to_card
    #     save(all_, profile, admin_, category_bronze)
    #     # main_user = Profile.objects.get(referral_link=cookies)
    # else:
    #     main_user = main_user
    #     max_card_ = '0' + str(id_)
    #     save(main_user)
    #     # Если у пригласившего не открыта карта номиналом,
    #     # которую купил рефер, то рефералка уходит админу
    #     if not Buy_Card.objects.filter(user=main_user).filter(
    #     card__category='bronze').filter(card__name=id_).exists():
    #         if First_Line.objects.filter(main_user=main_user):
    #             fq = First_Line.objects.get(main_user=main_user)
    #             fq.lost_profit += money_to_card * Decimal('0.1')
    #             fq.save()
    #         if Second_Line.objects.filter(main_user=main_user):
    #             fq = Second_Line.objects.get(main_user=main_user)
    #             fq.lost_profit += money_to_card * Decimal('0.04')
    #             fq.save()
    #         if Third_Line.objects.filter(main_user=main_user):
    #             fq = Third_Line.objects.get(main_user=main_user)
    #             fq.lost_profit += money_to_card * Decimal('0.01')
    #             fq.save()
    #         admin_.money += money_to_card * Decimal('0.1')
    #         all_.money += money_to_card
    #         profile.money -= money_to_card
    #         if main_user.line_1 is not None:
    #             sec_main_prof = First_Line.objects.get(id=main_user.line_1).main_user
    #             if Buy_Card.objects.filter(user=sec_main_prof).filter(card__category='bronze').filter(
    #                     card__name=id_).exists():
    #                 sec_main_prof.money += money_to_card * Decimal('0.04')
    #                 sec_main_prof.referral_amount += money_to_card * Decimal('0.04')
    #                 ref_card_dob(sec_main_prof, money_to_card * Decimal('0.04'))
    #                 sec_main_prof.save()
    #                 if User_in_Matrix.objects.filter(user=sec_main_prof).exists():
    #                     tyu = User_in_Matrix.objects.filter(matrix__price=money_to_card).get(user=sec_main_prof)
    #                     tyu.all_wins += money_to_card * Decimal('0.04')
    #                     tyu.save()
    #                 sq = Second_Line.objects.get(main_user=sec_main_prof)
    #                 sq.profit += money_to_card * Decimal('0.04')
    #                 sq.save()
    #             else:
    #                 admin_.money += money_to_card * Decimal('0.04')
    #             if sec_main_prof.line_1 is not None:
    #                 th_main_prof = First_Line.objects.get(id=sec_main_prof.line_1).main_user
    #                 if Buy_Card.objects.filter(user=th_main_prof).filter(card__category='bronze').filter(
    #                         card__name=id_).exists():
    #                     th_main_prof.money += money_to_card * Decimal('0.01')
    #                     th_main_prof.referral_amount += money_to_card * Decimal('0.01')
    #                     ref_card_dob(th_main_prof, money_to_card * Decimal('0.01'))
    #                     th_main_prof.save()
    #                     if User_in_Matrix.objects.filter(user=th_main_prof).exists():
    #                         tyu = User_in_Matrix.objects.filter(matrix__price=money_to_card).get(user=th_main_prof)
    #                         tyu.all_wins += money_to_card * Decimal('0.01')
    #                         tyu.save()
    #                     sq1 = Third_Line.objects.get(main_user=th_main_prof)
    #                     sq1.profit += money_to_card * Decimal('0.01')
    #                     sq1.save()
    #                 else:
    #                     admin_.money += money_to_card * Decimal('0.01')
    #         save(main_user, all_, profile, admin_, category_bronze)
    #     # третий случай (Если у пригласившего нет 2 и 3 линии, то 5% уходит админу)
    #     else:
    #         case_3_4_ref(main_user, money_to_card, profile, money_to_card)
    #         save(category_bronze)
    # buy_card = Buy_Card()
    # buy_card.user = profile
    # card_ = Card()
    # card_.price = money_to_card
    # card_.category = 'bronze'
    # card_.name = id_
    # card_.save()
    # buy_card.card = card_
    # buy_card.save()
    # profile.max_card = id_
    # hist = History_card()
    # hist.buy = True
    # hist.price = money_to_card
    # hist.user = profile
    # hist.save()
    # profile.save()
    # new_money = money_to_card * Decimal('0.8')
    # admin_.money += money_to_card * Decimal('0.05')
    # mes = message_for_bot.a['buy'].format(tokemon.tokemon['bronze'][id_ - 1])
    # send_message_tgbot(mes, profile.id)
    # logics_matrix(profile, new_money, buy_card)
    # return Response(status=200)

    # silver
    profile = Profile.objects.get(user=request.user)
    if all_ref_logic('bronze', id_, profile) == 400:
        return Response(status=400)
    return Response(status=200)


@api_view(['GET'])
def referral_system_silver(request, id_):
    # Сбор данных
    profile = Profile.objects.get(user=request.user)
    if all_ref_logic('silver', id_, profile) == 400:
        return Response(status=400)
    return Response(status=200)


# Получение линий
@api_view(['GET'])
def get_lines(request):
    data = {
        'first': {
            'total': 0,
            'profit': 0,
            'lost': 0
        },
        'second': {
            'total': 0,
            'profit': 0,
            'lost': 0
        },
        'third': {
            'total': 0,
            'profit': 0,
            'lost': 0
        }
    }
    if Profile.objects.filter(user=request.user).exists():
        profile = Profile.objects.get(user=request.user)
        if First_Line.objects.filter(main_user=profile).exists():
            first = First_Line.objects.get(main_user=profile)
            data['first'] = {
                'total': first.total_person,
                'profit': first.profit,
                'lost': first.lost_profit
            }
        if Second_Line.objects.filter(main_user=profile).exists():
            second = Second_Line.objects.get(main_user=profile)
            data['second'] = {
                'total': second.total_person,
                'profit': second.profit,
                'lost': second.lost_profit
            }
        if Third_Line.objects.filter(main_user=profile).exists():
            third = Third_Line.objects.get(main_user=profile)
            data['third'] = {
                'total': third.total_person,
                'profit': third.profit,
                'lost': third.lost_profit
            }
    return Response(data=data)


def go__category(name, profile):
    if name == 'bronze':
        if Category_Bronze.objects.filter(user__id=profile.id).exists():
            category = Category_Bronze.objects.get(user__id=profile.id)
        else:
            category = Category_Bronze()
            category.user = profile
            category.save()
    elif name == 'silver':
        if Category_Silver.objects.filter(user__id=profile.id).exists():
            category = Category_Silver.objects.get(user__id=profile.id)
        else:
            category = Category_Silver()
            category.user = profile
            category.save()
    elif name == 'gold':
        if Category_Gold.objects.filter(user__id=profile.id).exists():
            category = Category_Gold.objects.get(user__id=profile.id)
        else:
            category = Category_Gold()
            category.user = profile
            category.save()
    else:
        if Category_Emerald.objects.filter(user__id=profile.id).exists():
            category = Category_Emerald.objects.get(user__id=profile.id)
        else:
            category = Category_Emerald()
            category.user = profile
            category.save()
    return category


def go_disable_of_card(name):
    if name == 'bronze':
        if Category_Bronze.objects.filter(card_6_disable=True).exists():
            return True
        else:
            return False
    elif name == 'silver':
        if Category_Silver.objects.filter(card_6_disable=True).exists():
            return True
        else:
            return False
    elif name == 'gold':
        if Category_Gold.objects.filter(card_6_disable=True).exists():
            return True
        else:
            return False
    else:
        if Category_Emerald.objects.filter(card_6_disable=True).exists():
            return True
        else:
            return False


def all_ref_logic(name, id_, profile):
    admin_ = Profile.objects.filter(admin_or=True).first()
    category = go__category(name, profile)
    t_or_f = go_disable_of_card(name)
    if User_in_Matrix.objects.filter(user=profile).filter(matrix__up=True).filter(
            card__card__category=str(name)).filter(card__card__name=int(id_)).exists():
        us_pr = User_in_Matrix.objects.filter(user=profile).filter(card__card__category=str(name)).filter(
            card__card__name=int(id_)).get(matrix__up=True).d
        if us_pr < 4:
            return 400
    if User_in_Matrix.objects.filter(user=profile).filter(matrix__up=False).filter(
            card__card__category=str(name)).filter(card__card__name=int(id_)).count() == 1:
        return 400
    card = 'card_' + str(id_)
    if not All.objects.all().exists():
        All().objects.create().save()
    all_ = All.objects.all().first()
    if profile.line_1 is not None:
        main_user = First_Line.objects.get(id=profile.line_1).main_user
    else:
        main_user = None
    # Проверка блокировки карты для пользователя
    if id_ == 6 and not t_or_f:
        return 400
    else:
        money_to_card = what_card(card, category)
    money_to_card = Decimal(money_to_card)  # Стоимость карты
    if profile.money < money_to_card:
        return 400
    # Второй случай (Если человек заходит без реф. ссылки, то 15% админу.)
    if main_user is None:
        admin_.money += money_to_card * Decimal('0.15')
        profile.money -= money_to_card
        all_.money += money_to_card
        save(all_, profile, admin_, category)
        # main_user = Profile.objects.get(referral_link=cookies)
    else:
        main_user.save()
        # Если у пригласившего не открыта карта номиналом, которую купил рефер, то рефералка уходит админу
        if not Buy_Card.objects.filter(user=main_user).filter(card__category=name).filter(card__name=id_).exists():
            if First_Line.objects.filter(main_user=main_user).exists():
                fq = First_Line.objects.get(main_user=main_user)
                fq.lost_profit += money_to_card * Decimal('0.1')
                fq.save()
                main_user.missed_amount += money_to_card * Decimal('0.1')
                main_user.save()
            admin_.money += money_to_card * Decimal('0.1')
            admin_.save()
            all_.money += money_to_card
            profile.money -= money_to_card
            if main_user.line_1 is not None:
                sec_main_prof = First_Line.objects.get(id=main_user.line_1).main_user
                if Buy_Card.objects.filter(user=sec_main_prof).filter(card__category=name).filter(
                        card__name=id_).exists():
                    sec_main_prof.money += money_to_card * Decimal('0.04')
                    sec_main_prof.referral_amount += money_to_card * Decimal('0.04')
                    ref_card_dob(sec_main_prof, money_to_card * Decimal('0.04'))
                    sec_main_prof.save()
                    if User_in_Matrix.objects.filter(user=sec_main_prof).exists():
                        for el in User_in_Matrix.objects.filter(matrix__price=money_to_card).filter(user=sec_main_prof):
                            el.all_wins += money_to_card * Decimal('0.04')
                            el.save()
                    sq = Second_Line.objects.get(main_user=sec_main_prof)
                    sq.profit += money_to_card * Decimal('0.04')
                    sq.save()
                else:
                    sqe = Second_Line.objects.get(main_user=sec_main_prof)
                    sqe.lost_profit += money_to_card * Decimal('0.04')
                    sqe.save()
                    sec_main_prof.missed_amount += money_to_card * Decimal('0.04')
                    sec_main_prof.save()
                    admin_.money += money_to_card * Decimal('0.04')
                    admin_.save()
                if sec_main_prof.line_1 is not None:
                    th_main_prof = First_Line.objects.get(id=sec_main_prof.line_1).main_user
                    if Buy_Card.objects.filter(user=th_main_prof).filter(card__category=name).filter(
                            card__name=id_).exists():
                        th_main_prof.money += money_to_card * Decimal('0.01')
                        th_main_prof.referral_amount += money_to_card * Decimal('0.01')
                        ref_card_dob(th_main_prof, money_to_card * Decimal('0.01'))
                        th_main_prof.save()
                        if User_in_Matrix.objects.filter(user=th_main_prof).exists():
                            for el in User_in_Matrix.objects.filter(matrix__price=money_to_card).filter(
                                    user=th_main_prof):
                                el.all_wins += money_to_card * Decimal('0.01')
                                el.save()
                        sq1 = Third_Line.objects.get(main_user=th_main_prof)
                        sq1.profit += money_to_card * Decimal('0.01')
                        sq1.save()
                    else:
                        tp = Third_Line.objects.get(main_user=th_main_prof)
                        tp.lost_profit += money_to_card * Decimal('0.01')
                        tp.save()
                        th_main_prof.missed_amount += money_to_card * Decimal('0.01')
                        th_main_prof.save()
                        admin_.money += money_to_card * Decimal('0.01')
                        admin_.save()
                else:
                    admin_.money += money_to_card * Decimal('0.01')
                    admin_.save()
            else:
                admin_.money += money_to_card * Decimal('0.05')
            save(main_user, all_, profile, admin_, category)
        # третий случай (Если у пригласившего нет 2 и 3 линии, то 5% уходит админу)
        else:
            case_3_4_ref(main_user, money_to_card, profile, money_to_card, admin_)
            save(category)
    buy_card = Buy_Card()
    buy_card.user = profile
    card_ = Card()
    card_.price = money_to_card
    card_.category = name
    card_.name = id_
    card_.save()
    buy_card.card = card_
    buy_card.save()
    profile.max_card = id_
    hist = History_card()
    hist.buy = True
    hist.price = money_to_card
    hist.user = profile
    hist.from_person_id = profile.id
    hist.save()
    profile.save()
    new_money = money_to_card * Decimal('0.8')
    admin_.money += money_to_card * Decimal('0.05')
    admin_.save()
    mes = message_for_bot.a['buy'].format(tokemon.tokemon[name][id_ - 1])
    send_message_tgbot(mes, profile.id)
    logics_matrix(profile, new_money, buy_card)
    return 200


# gold
@api_view(['GET'])
def referral_system_gold(request, id_):
    # Сбор данных
    profile = Profile.objects.get(user=request.user)
    if all_ref_logic('gold', id_, profile) == 400:
        return Response(status=400)
    return Response(status=200)


@api_view(['GET'])
def get_hist_card(request):
    data = {
        'oneq': [0, '0-0-B 0.0.2022', 0, False],
        'two': [0, '0-0-B 0.0.2022', 0, False],
        'the': [0, '0-0-B 0.0.2022', 0, False],
        'oneq1': [0, '0-0-B 0.0.2022', 0, False],
        'two1': [0, '0-0-B 0.0.2022', 0, False],
        'the1': [0, '0-0-B 0.0.2022', 0, False],
        'oneq2': [0, '0-0-B 0.0.2022', 0, False],
        'two2': [0, '0-0-B 0.0.2022', 0, False],
        'the2': [0, '0-0-B 0.0.2022', 0, False]
    }
    if not Profile.objects.filter(user=request.user).exists():
        return Response(data=data)
    if History_card.objects.filter(user=Profile.objects.get(user=request.user)).exists():
        buy = History_card.objects.filter(user=Profile.objects.get(user=request.user)).order_by('-date')
        main_list = []
        for el in buy:
            temp_list = []
            time = el.date
            str_time_1 = str(time.hour) + '-' + str(time.minute) + '-B ' + str(time.day) + '.' + str(
                time.month) + '.' + str(time.year)
            temp_list.append(el.from_person_id)
            temp_list.append(str_time_1)
            temp_list.append(el.price)
            if el.buy:
                temp_list[2] = - el.price
            main_list.append(temp_list)
        i = 0
        for key, value in data.items():
            if len(main_list) - 1 < i:
                return Response(data=data)
            data[key] = main_list[i]
            i += 1
        return Response(data=data)
    else:
        return Response(data=data)


# emerald
@api_view(['GET'])
def referral_system_emerald(request, id_):
    # Сбор данных
    profile = Profile.objects.get(user=request.user)
    if all_ref_logic('emerald', id_, profile) == 400:
        return Response(status=400)
    return Response(status=200)


@api_view(['GET'])
def six(request):
    if Profile.objects.filter(user_id=request.user.id).exists():
        bronze = False
        silver = False
        gold = False
        emerald = False
        if Category_Bronze.objects.filter(card_6_disable=True).exists():
            bronze = True
        if Category_Silver.objects.filter(card_6_disable=True).exists():
            silver = True
        if Category_Gold.objects.filter(card_6_disable=True).exists():
            gold = True
        if Category_Emerald.objects.filter(card_6_disable=True).exists():
            emerald = True
        data = {
            'bronze': bronze,
            'silver': silver,
            'gold': gold,
            'emerald': emerald,
        }
        return Response(data=data)
    return Response(200)


def matrix_pay(main_matrix, money, id_):
    hist = History_card()
    hist.buy = False
    hist.from_person_id = id_
    hist2 = History_card()
    hist2.from_person_id = id_
    hist2.buy = False
    user_1 = User_in_Matrix.objects.filter(matrix__price=main_matrix.price).get(participant_number=main_matrix.go_money)
    user_2 = User_in_Matrix.objects.filter(matrix__price=main_matrix.price).get(
        participant_number=(main_matrix.go_money + 1))
    if user_1.user.id == user_2.user.id:
        user_1.user.money += Decimal(money / 2) * 2
        mes = message_for_bot.a['win'].format(Decimal(money / 2) * 2)
        send_message_tgbot(mes, user_1.id)
        hist.price = Decimal(money / 2)
        hist2.price = Decimal(money / 2)
        hist.user = user_1.user
        hist2.user = user_1.user
        # user_2.user.missed_amount += (money / 2) * 2
        user_1.d += 1
        user_2.d += 1
        user_2.total_wins += (money / 2) * 2
        ref_card_tot(user_2.user, (money / 2) * 2)
        user_2.save()
        user_2.user.save()
        user_1.user.save()
        user_1.save()
    else:
        user_1.user.money += Decimal(money / 2)
        mes = message_for_bot.a['win'].format(Decimal(money / 2))
        send_message_tgbot(mes, user_1.id)
        user_2.user.money += Decimal(money / 2)
        mes = message_for_bot.a['win'].format(Decimal(money / 2))
        send_message_tgbot(mes, user_2.id)
        hist.price = Decimal(money / 2)
        hist2.price = Decimal(money / 2)
        hist.user = user_1.user
        hist2.user = user_2.user
        user_1.d += 1
        user_2.d += 1
        # user_2.user.missed_amount += money / 2
        # user_1.user.missed_amount += money / 2
        user_2.total_wins += money / 2
        ref_card_tot(user_2.user, money / 2)
        user_1.total_wins += money / 2
        ref_card_tot(user_1.user, money / 2)
        user_1.user.save()
        user_2.user.save()
        user_1.save()
        user_2.save()
    hist.save()
    hist2.save()


# Логика матрицы
def logics_matrix(user_, money, card_):
    admin_ = Profile.objects.filter(admin_or=True).first()
    profile = user_
    user_in_matrix = User_in_Matrix()
    user_in_matrix.user = Profile.objects.get(id=profile.id)
    card = card_
    price = card.card.price
    user_in_matrix.card = card
    if User_in_Matrix.objects.filter(matrix__price=price).count() != 0:
        user_in_matrix.participant_number = User_in_Matrix.objects.filter(matrix__price=price).order_by(
            '-participant_number').first().participant_number + 1
    else:
        user_in_matrix.participant_number = 0
    # Проверка существ главной матрицы
    if Matrix.objects.filter(up=True).filter(price=price).exists():
        main_matrix = Matrix.objects.filter(up=True).get(price=price)
        # Проверка на максимальность матрицы
        if main_matrix.col == main_matrix.max_users:
            # Проверка на вторую матрицу(принимающую)
            if Matrix.objects.filter(up=False).filter(price=price).exists():
                down_matrix = Matrix.objects.filter(up=False).get(price=price)
                # Проверка на максимальность матрицы
                if down_matrix.col == down_matrix.max_users:
                    down_matrix.up = True
                    temp = User_in_Matrix.objects.filter(matrix=main_matrix).order_by('-participant_number')
                    temp = temp.first().participant_number + 1
                    down_matrix.go_money = temp
                    main_matrix.delete()
                    new_matrix = Matrix()
                    new_matrix.max_users = down_matrix.max_users * 2
                    new_matrix.col += 1
                    new_matrix.price = price
                    user_in_matrix.matrix = new_matrix
                    matrix_pay(down_matrix, money, profile.id)
                    all_users = User_in_Matrix.objects.filter(matrix=down_matrix).order_by('-participant_number')
                    if all_users[1].participant_number == down_matrix.go_money:
                        down_matrix.go_money = all_users[all_users.count() - 1].participant_number
                    elif all_users[0].participant_number == down_matrix.go_money:
                        down_matrix.go_money = all_users[all_users.count() - 2].participant_number
                    else:
                        down_matrix.go_money += 2
                    # save
                    down_matrix.save()
                    new_matrix.save()
                    user_in_matrix.save()
                else:
                    matrix_pay(main_matrix, money, profile.id)
                    all_users = User_in_Matrix.objects.filter(matrix=main_matrix).order_by('-participant_number')
                    if all_users[1].participant_number == main_matrix.go_money:
                        main_matrix.go_money = all_users[all_users.count() - 1].participant_number
                    elif all_users[0].participant_number == main_matrix.go_money:
                        main_matrix.go_money = all_users[all_users.count() - 2].participant_number
                    else:
                        main_matrix.go_money += 2
                    down_matrix.col += 1
                    user_in_matrix.matrix = down_matrix
                    # save
                    user_in_matrix.save()
                    down_matrix.save()
                    main_matrix.save()
            else:
                down_matrix = Matrix()
                down_matrix.max_users = main_matrix.max_users * 2
                down_matrix.price = price
                down_matrix.col += 1
                user_in_matrix.matrix = down_matrix
                matrix_pay(main_matrix, money, profile.id)
                all_users = User_in_Matrix.objects.filter(matrix=main_matrix).order_by('-participant_number')
                if all_users[1].participant_number == main_matrix.go_money:
                    main_matrix.go_money = all_users[all_users.count() - 1].participant_number
                elif all_users[0].participant_number == main_matrix.go_money:
                    main_matrix.go_money = all_users[all_users.count() - 2].participant_number
                else:
                    main_matrix.go_money += 2
                    # save
                main_matrix.save()
                down_matrix.save()
                user_in_matrix.save()
        else:
            admin_.money += money
            admin_.save()
            user_in_matrix.matrix = main_matrix
            main_matrix.col += 1
            user_in_matrix.save()
            main_matrix.save()
    else:
        admin_.money += money
        admin_.save()
        main_matrix = Matrix()
        main_matrix.col += 1
        user_in_matrix.matrix = main_matrix
        main_matrix.up = True
        main_matrix.price = price
        main_matrix.save()
        user_in_matrix.save()


# Модуль оплаты

# Оплата

# Центральный кошелек для этого демо - первый кошелек в базе. Если его нет, создаем его
try:
    pass
except ProgrammingError:
    print("Error. БД не существует")
except OperationalError:
    print("error")
# Газ, необходимый для транзакции пересылки (TRX wei)
gas_needed = 8 * 10 ** 6


# Вывод

@csrf_exempt
def dis(request):
    all_ = All.objects.all().first()
    if Profile.objects.filter(user_id=request.user.id).exists():
        profile = Profile.objects.get(user_id=request.user.id)
        col = request.body
        col = col.decode('utf8').replace("'", '"')
        data = json.loads(col)
        # s = json.dumps(data, indent=4, sort_keys=True)
        wall = data['wallet_input']
        col = data['col']
        col = int(col)
        if col is not None:
            if profile.wallet_input is not None:
                wall = Wallet.objects.get(address=profile.wallet_input)
            else:
                wallet = tc.create_wallet()
                if Wallet.objects.filter(address=data['wallet_input']).exists():
                    return JsonResponse({'error': 'Some error'}, status=400)
                w = Wallet.objects.create(address=data['wallet_input'], pkey=wallet['private_key'])
                profile.wallet_input = w.address
                w.save()
                wall = w
            profile.save()
            if col * 0.01 < 1:
                col += 1
            else:
                col += col * 0.01
            if profile.money < col:
                return Response(status=400)
            data = send_usdt(wall, col, profile)
            if data:
                profile.money -= col
                profile.save()
                all_.all_transactions += 1
                all_.money += col
                all_.save()
                mes = message_for_bot.a['withdrawal'].format(col)
                send_message_tgbot(mes, profile.id)
                return JsonResponse(data=data, status=200, safe=False)
            else:
                return JsonResponse({'error': 'Some error'}, status=400)
    return JsonResponse({'error': 'Some error'}, status=400)


# Ввод
@api_view(['GET'])
def dis_input(request):
    all_ = All.objects.all().first()
    if Profile.objects.filter(user_id=request.user.id).exists():
        profile = Profile.objects.get(user_id=request.user.id)
        if profile.wallet is not None:
            wall = Wallet.objects.get(pkey=profile.wallet_output)
        else:
            wallet = tc.create_wallet()
            w = Wallet.objects.create(address=wallet['base58check_address'], pkey=wallet['private_key'])
            profile.wallet = w.address
            w.save()
            wall = w
        col = get_usdt_balance(wall.address)
        new_tx = Transaction(tx_id=profile.id,
                             sender=123,
                             receiver='123',
                             currency='TRX',
                             amount=col,
                             fee=1,
                             timestamp=1,
                             )
        new_tx.save()
        if col <= 0:
            return Response(status=400)
        if col is not None:
            data = collect_usdt(wall, col, profile)
            if data:
                profile.money += col
                profile.save()
                all_.all_transactions += 1
                all_.save()
                mes = message_for_bot.a['up ty'].format(col)
                send_message_tgbot(mes, profile.id)
                return Response(data=data, status=200)
            else:
                return Response(status=400)
    return Response(status=400)


# Создание нового кошелька
def generate_wallet(request):
    if request.method == 'GET':
        wallet = tc.create_wallet()
        w = Wallet()
        w.address = wallet['base58check_address']
        w.pkey = wallet['private_key']
        w.save()
    return redirect(request.META.get('HTTP_REFERER', 'redirect_if_referer_not_found'))


# Сбор USDT с кошелька
# @app.route('/collect_usdt', methods=['POST'])
def collect_usdt(wallet, col, profile):
    admin_ = Profile.objects.filter(admin_or=True).first()
    w = wallet
    pkey = w.pkey
    Sus = False
    error_info = ''
    if Wallet.objects.filter(id=admin_.wallet).exists():
        central = Wallet.objects.get(id=admin_.wallet)
    else:
        return False
    trx_bal = tc.trx_balance(w.address)
    if trx_bal < gas_needed:
        a = tc.send_trx(central.address, w.address, gas_needed - trx_bal, central.pkey)
        if a.get('result') == 'Success':
            tx = a.get('tx', {})
            tx_id = tx.get('id', '')
            tx_fee = tx.get('fee', 0)
            tx_timestamp = int(tx.get('blockTimeStamp', 0) / 1000)
            new_tx = Transaction(tx_id=tx_id,
                                 sender=central.address,
                                 receiver=w.address,
                                 currency='TRX',
                                 amount=trx_bal,
                                 fee=tx_fee,
                                 timestamp=tx_timestamp,
                                 )
            new_tx.save()
            Sus = True
            error_info = tx_id
        else:
            error_info = a.get('description')
        hist_tran = History_Transactions(
            user=profile,
            quantity=trx_bal,
            card=w.address,
            success=Sus,
            name_operation='Input',
            txid=error_info
        )
        hist_tran.save()
    else:
        new_tx = Transaction(tx_id=profile.id,
                             sender=central.address,
                             receiver=w.address,
                             currency='Газ меньше баланса',
                             amount=trx_bal,
                             fee=trx_bal,
                             timestamp=0,
                             )
        new_tx.save()
    a = tc.send_usdt(w.address, central.address, col * 10 ** 6, w.pkey)

    if a.get('result') == 'Success':
        tx = a.get('tx', {})
        tx_id = tx.get('id', '')
        tx_fee = tx.get('fee', 0)
        tx_timestamp = int(tx.get('blockTimeStamp', 0) / 1000)
        new_tx = Transaction(tx_id=tx_id,
                             sender=w.address,
                             receiver=central.address,
                             currency='USDT',
                             amount=col,
                             fee=tx_fee,
                             timestamp=tx_timestamp,
                             )
        new_tx.save()
        Sus = True
        hist_tran = History_Transactions(
            user=profile,
            quantity=col,
            card=w.address,
            success=Sus,
            name_operation='Input',
            txid=tx_id
        )
        hist_tran.save()
        return new_tx
    else:
        Sus = False
        hist_tran = History_Transactions(
            user=profile,
            quantity=trx_bal,
            card=w.address,
            success=Sus,
            name_operation='Input',
            txid=a.get('description')
        )
        hist_tran.save()
        return False


# Отправка TRX на кошелек
# @app.route('/send_trx', methods=['POST'])
def send_trx(request):
    admin_ = Profile.objects.filter(admin_or=True).first()
    w = Wallet.objects.get(address=request.form.get('address'))
    pkey = w.pkey
    if Wallet.objects.filter(id=admin_.wallet).exists():
        central = Wallet.objects.get(id=admin_.wallet)
    else:
        return False
    a = tc.send_trx(central.address, w.address, 10, central.pkey)
    if a.get('result') == 'Success':
        tx = a.get('tx', {})
        tx_id = tx.get('id', '')
        tx_fee = tx.get('fee', 0)
        tx_timestamp = int(tx.get('blockTimeStamp', 0) / 1000)
        new_tx = Transaction(tx_id=tx_id,
                             sender=central.address,
                             receiver=w.address,
                             currency='TRX',
                             amount=1,
                             fee=tx_fee,
                             timestamp=tx_timestamp,
                             )
        new_tx.save()
        return new_tx
    else:
        return False


# Отправка USDT на кошелек
# @app.route('/send_usdt', methods=['POST'])
def send_usdt(wallet, col, profile):
    admin_ = Profile.objects.filter(admin_or=True).first()
    if Wallet.objects.filter(id=admin_.wallet).exists():
        central = Wallet.objects.get(id=admin_.wallet)
    else:
        return False
    w = wallet
    pkey = w.pkey
    a = tc.send_usdt(central.address, w.address, col * 10 ** 6, central.pkey)
    if a.get('result') == 'Success':
        tx = a.get('tx', {})
        tx_id = tx.get('id', '')
        tx_fee = tx.get('fee', 0)
        tx_timestamp = int(tx.get('blockTimeStamp', 0) / 1000)
        new_tx = Transaction(tx_id=tx_id,
                             sender=central.address,
                             receiver=w.address,
                             currency='USDT',
                             amount=col,
                             fee=tx_fee,
                             timestamp=tx_timestamp,
                             )
        new_tx.save()
        Sus = True
        hist_tran = History_Transactions(
            user=profile,
            quantity=col,
            card=w.address,
            success=Sus,
            name_operation='Output',
            txid=a.get('description')
        )
        hist_tran.save()
        return new_tx
    else:
        Sus = False
        hist_tran = History_Transactions(
            user=profile,
            quantity=col,
            card=w.address,
            success=Sus,
            name_operation='Output',
            txid=a.get('description')
        )
        hist_tran.save()
        return False


# Удаление из базы всех кошельков кроме центрального
# @app.route('/delete', methods=['GET'])
def delete(request):
    # wallets = select(w for w in Wallet if w.id > 1)[:]
    wallets = Wallet.objects.first(id__gte=1)
    for w in wallets:
        w.delete()
    wallets.save()
    return '<p>Wallets Deleted</p>'


"""
# Функция просмотра баланса USDT (декоратор для Jinja )
@app.context_processor
def utility_processor():
    def get_usdt_balance(address):
        bal = tc.usdt_balance(address)
        return bal / 10 ** 6

    return dict(get_usdt_balance=get_usdt_balance)


# Функция просмотра баланса TRX (декоратор для Jinja )
@app.context_processor
def utility_processor_2():
    def get_trx_balance(address):
        bal = tc.trx_balance(address)
        return bal

    return dict(get_trx_balance=get_trx_balance)

"""


def get_usdt_balance(address):
    bal = tc.usdt_balance(address)
    return bal / 10 ** 6


def get_trx_balance(address):
    bal = tc.trx_balance(address)
    return bal
