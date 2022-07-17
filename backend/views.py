import io
import logging
import json
import profile
from os import environ, getenv
import uuid
import xlsxwriter
from captcha.fields import CaptchaField
from django.contrib.auth import logout, authenticate, login
from django.contrib.auth.forms import PasswordResetForm
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.views import PasswordContextMixin
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import HttpResponse, FileResponse, JsonResponse
from django.shortcuts import render, redirect
from django.contrib import messages
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from django.views.generic import FormView
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from decimal import *
from tgbot import message_for_bot
from tgbot.message_for_bot import a
from tgbot.models import Chat_id, Event, Memcache, User_Bot
from . import tokemon
from .forms import CreateUserForm
from .models import Profile, Matrix, User_in_Matrix, Wallet, Transaction, Category_Bronze, Admin, All, First_Line, \
    Second_Line, Third_Line, Category_Silver, Category_Gold, Category_Emerald, Buy_Card, Card, DeepLink, \
    History_Transactions
from .serializers import ProfileSerializer, UserSerializer, AllSerializer
from tronpy import Contract, Tron
import base58
from tronpy.keys import PrivateKey
from tronpy.providers import HTTPProvider
import requests
from rest_framework.authtoken.models import Token
from rest_framework.request import Request
from django.urls import reverse_lazy
from django.utils.translation import gettext_lazy as _

# Лог выводим на экран и в файл
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("debug.log"),
        logging.StreamHandler()
    ]
)


def send_message_tgbot(message, id):
    token = getenv('TELEGRAM_TOKEN')
    if User_Bot.objects.filter(profile__id=id).exists():
        chat_id = User_Bot.objects.get(profile__id=id).chat_id
        url_req = "https://api.telegram.org/bot" + token + "/sendMessage" + "?chat_id=" + str(chat_id) + "&text=" + \
                  message
        results = requests.get(url_req)
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
        }
        ,
        {
            'Endpoint': '/bronze/id_/',
            'method': 'GET',
            'body': None,
            'description': 'Returns a single note object'
        }
        ,
        {
            'Endpoint': '/silver/id_/',
            'method': 'GET',
            'body': None,
            'description': 'Returns a single note object'
        }
        ,
        {
            'Endpoint': '/gold/id_/',
            'method': 'GET',
            'body': None,
            'description': 'Returns a single note object'
        }
        ,
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

    ]
    return Response(routes)


@api_view(['GET'])
def trans_get_output(request):
    if Profile.objects.filter(user_id=request.user.id).exists():
        profile = Profile.objects.get(user_id=request.user.id)
        if History_Transactions.objects.filter(user_id=profile.id).exists():
            ht = History_Transactions.objects.filter(user_id=profile.id)
            data = []
            for el in ht:
                if el.success and el.name_operation == 'Output':
                    time = el.data.time()
                    main = {
                        'quantity': el.quantity,
                        'data': el.data.date(),
                        'time': time,
                        'txid': el.txid,
                    }
                    data.append(main)
            return Response(data=data)
    return Response(data=[])

@api_view(['GET'])
def trans_get_input(request):
    if Profile.objects.filter(user_id=request.user.id).exists():
        profile = Profile.objects.get(user_id=request.user.id)
        if History_Transactions.objects.filter(user_id=profile.id).exists():
            ht = History_Transactions.objects.filter(user_id=profile.id)
            data = []
            for el in ht:
                if el.success and el.name_operation == 'Input':
                    time = el.data.time()
                    main = {
                        'quantity': el.quantity,
                        'data': el.data.date(),
                        'time': time,
                        'txid': el.txid,
                    }
                    data.append(main)
            return Response(data=data)
    return Response(data=[])

def create_all_and_admin():
    if not Profile.objects.filter(admin_or=True).exists():
        user = User()
        user.username = 'admin'
        user.password = 'admin'
        user.save()
        profile2 = Profile()
        profile2.user = user
        profile2.save()

    if not All.objects.all().exists():
        a = All()
        a.save()


all_ = All.objects.all().first()
create_all_and_admin()
admin_ = Profile.objects.filter(admin_or=True).first()


@api_view(['GET'])
def get_user_in_matrix(request):
    if User_in_Matrix.objects.filter(user__id=request.user.id).exists():
        profile = User_in_Matrix.objects.filter(user__id=request.user.id)
        data = {}
        for el in profile:
            card_ = el.card
            name = card_.name
            if card_.category == 'bronze':
                category = 0
            elif card_.category == 'silver':
                category = 1
            elif card_.category == 'gold':
                category = 2
            else:
                category = 3
            name_ = category + name
            data[name_] = el.d
        return Response(data=data, status=200)
    else:
        return Response(status=400)


@api_view(['GET'])
def get_all(request):
    all_ = All.objects.all().first()
    data = AllSerializer(all_)
    return Response(data.data)


@api_view(['GET'])
def get_max(request):
    if Profile.objects.filter(user_id=request.user.id).exists():
        profile = Profile.objects.get(user_id=request.user.id)
        data = {
            'max_cards': profile.max_card,

        }
        return Response(data)
    return Response(status=200)


@api_view(['GET'])
def get_link_tg(request):
    if Profile.objects.filter(user__id=request.user.id).exists():
        profile = Profile.objects.get(user__id=request.user.id)
        if User_Bot.objects.filter(profile_id=profile.id).exists():
            user_bot = User_Bot.objects.get(profile_id=profile.id)
            data = {
                'link_tg': user_bot.deep_link
            }
            return Response(data=data)
    return Response(status=401)


@api_view(['GET'])
def get_referrals(request):
    if Profile.objects.filter(user__id=request.user.id).exists():
        profile = Profile.objects.get(user__id=request.user.id)
        if First_Line.objects.filter(main_user__user_id=request.user.id).exists():
            main_1 = First_Line.objects.get(main_user__user_id=request.user.id)
            line_1 = Profile.objects.filter(line_1=main_1.id)
        else:
            line_1 = 0
        if Second_Line.objects.filter(main_user__user_id=request.user.id).exists():
            main_2 = Second_Line.objects.get(main_user__user_id=request.user.id)
            line_2 = Profile.objects.filter(line_2=main_2.id)
        else:
            line_2 = 0
        if Third_Line.objects.filter(main_user__user_id=request.user.id).exists():
            main_3 = Third_Line.objects.get(main_user__user_id=request.user.id)
            line_3 = Profile.objects.filter(line_3=main_3.id)
        else:
            line_3 = 0
        total_line = 0
        if line_1 != 0:
            total_line += line_1.count()
        if line_2 != 0:
            total_line += line_2.count()
        if line_3 != 0:
            total_line += line_3.count()
        data = {
            'total_line': total_line,
            'profit': profile.referral_amount,
            'lost': profile.missed_amount,
            'link': profile.referral_link
        }
        return Response(data, status=200)
    else:
        return Response(status=400)


def lan(request):
    render(request, 'backend/len.html')


def index(request):
    return render(request, 'backend/index.html')


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
        'username': request.data['username'],
        'password1': request.data['password1'],
        'email': request.data['email'],
        'password2': request.data['password2'],
    }
    form = CreateUserForm(data)
    utm = request.COOKIES.get('utm')
    if Profile.objects.filter(referral_link=utm).exists():
        main_user = Profile.objects.get(referral_link=utm)
        if First_Line.objects.filter(main_user=main_user).exists():
            line_one = First_Line.objects.get(main_user=main_user)
        else:
            line_one = First_Line.objects.create(main_user=main_user)
    else:
        line_one = None
    if form.is_valid():
        form.save()
        username = form.cleaned_data.get('username')
        user = User.objects.get(username=username)
        profile = Profile.objects.create(user=user)
        if line_one is not None:
            profile.line_1 = line_one.id
        profile.save()
        messages.success(request, 'Аккаунт создан,' + username)
        text = 'You have successfully registered\nYour password: {}\nYour username: {}'.format(
            request.data['password1'],
            request.data['username'])
        message = a['bot'].format(request.data['password1'], request.data['username'])
        Event.objects.create(message=message, user_id=profile.id)
        memcache = uuid.uuid4().hex[:6].upper()
        Memcache.objects.create(user=profile.id, memcache=memcache)
        deep_link = 'https://t.me/Tokemon_game_Bot?start=' + str(memcache)
        DeepLink.objects.create(profile=profile.id, deep_link=deep_link)
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
def case_3_4_ref(main_user, money_to_card, all_, profile, id_, name):
    second_line = False
    third_line = False
    if Second_Line.objects.filter(main_user__id=main_user.id).exists():
        second_line = True
    if Third_Line.objects.filter(main_user__id=main_user.id).exists():
        third_line = True
    if not second_line and not third_line:
        admin_.money += money_to_card * Decimal('0.05')
        main_user.money += money_to_card * Decimal('0.1')
        mes = message_for_bot.a['bonus'].format((money_to_card * Decimal('0.1')))
        send_message_tgbot(mes, main_user.id)
        all_.money += money_to_card
        profile.money -= money_to_card
        mes = message_for_bot.a['buy'].format(tokemon[name][id_ - 1])
        send_message_tgbot(mes, profile.id)
    # четвертый случай
    elif not third_line:
        admin_.money += money_to_card * Decimal('0.01')
        profile.money -= money_to_card
        mes = message_for_bot.a['buy'].format(tokemon[name][id_ - 1])
        send_message_tgbot(mes, profile.id)

        main_user.money += money_to_card * Decimal('0.1')
        mes = message_for_bot.a['bonus'].format((money_to_card * Decimal('0.1')))
        send_message_tgbot(mes, main_user.id)
        all_.money += money_to_card
    else:
        profile.money -= money_to_card
        mes = message_for_bot.a['buy'].format(tokemon[name][id_ - 1])
        send_message_tgbot(mes, profile.id)
        main_user.money += money_to_card * Decimal('0.1')
        mes = message_for_bot.a['bonus'].format((money_to_card * Decimal('0.1')))
        send_message_tgbot(mes, main_user.id)
        all_.money += money_to_card
    save(main_user, all_, profile, admin_)


@api_view(['GET'])
def get_category(request):
    if Category_Bronze.objects.filter(user_id=request.user.id).exists():
        bronze = Category_Bronze.objects.get(user_id=request.user.id).card_6_disable
    else:
        bronze = False
    if Category_Bronze.objects.filter(user_id=request.user.id).exists():
        bronze = Category_Bronze.objects.get(user_id=request.user.id).card_6_disable
    else:
        bronze = False
    if Category_Bronze.objects.filter(user_id=request.user.id).exists():
        bronze = Category_Bronze.objects.get(user_id=request.user.id).card_6_disable
    else:
        bronze = False


# Логика реферальной системы
@api_view(['GET'])
def referral_system_bronze(request, id_):
    # Сбор данных
    profile = Profile.objects.get(user=request.user)
    card = 'card_' + str(id_)
    all_ = All.objects.all().first()
    cookies = request.COOKIES.get('utm')
    if cookies is None:
        cookies = None
    if Category_Bronze.objects.filter(user__id=profile.id).exists():
        category_bronze = Category_Bronze.objects.get(user__id=profile.id)
    else:
        category_bronze = Category_Bronze()
        category_bronze.user = profile
    # Проверка блокировки карты для пользователя
    if id_ == 6 and category_bronze.card_6_disable is False:
        return Response(status=400)
    else:
        money_to_card = what_card(card, category_bronze)
    money_to_card = Decimal(money_to_card)  # Стоимость карты
    if profile.money < money_to_card:
        return Response(status=400)
    # Второй случай (Если человек заходит без реф. ссылки, то 15% админу.)
    if cookies is None or cookies == '':
        admin_.money += money_to_card * Decimal('0.15')
        profile.money -= money_to_card
        message = message_for_bot.a['buy'].format(tokemon.bronze[id_ - 1])
        send_message_tgbot(message, profile.id)
        all_.money += money_to_card
        save(all_, profile, admin_, category_bronze)
        # main_user = Profile.objects.get(referral_link=cookies)
        max_card_ = '0' + str(id_)
    else:
        main_user = Profile.objects.get(referral_link=cookies)
        max_card_ = '0' + str(id_)
        print(max_card_)
        save(main_user)
        # Если у пригласившего не открыта карта номиналом,
        # которую купил рефер, то рефералка уходит админу
        if main_user.max_card < int(max_card_):
            if First_Line.objects.filter(main_user__id=admin_.id).exists():
                line_admin = First_Line.objects.get(main_user__id=admin_.id)
                profile.line_1 = line_admin.id
                line_admin.save()
                admin_.money += money_to_card * Decimal('0.1')
                all_.money += money_to_card
                profile.money -= money_to_card
                message = message_for_bot.a['buy'].format(tokemon.bronze[id_ - 1])
                send_message_tgbot(message, profile.id)
            else:
                line_admin = First_Line()
                line_admin.main_user = admin_
                profile.line_1 = line_admin.id
                line_admin.save()
                admin_.money += money_to_card * Decimal('0.1')
                all_.money += money_to_card
                profile.money -= money_to_card
                message = message_for_bot.a['buy'].format(tokemon.bronze[id_ - 1])
                send_message_tgbot(message, profile.id)
            save(main_user, all_, profile, admin_, category_bronze)
        # третий случай (Если у пригласившего нет 2 и 3 линии, то 5% уходит админу)
        else:
            case_3_4_ref(main_user, money_to_card, all_, profile, id_, 'bronze')
            save(category_bronze)
    buy_card = Buy_Card()
    buy_card.user = profile
    card_ = Card()
    card_.price = money_to_card
    card_.category = 'bronze'
    card_.name = id_
    card_.save()
    buy_card.card = card_
    buy_card.save()
    new_money = money_to_card * Decimal('0.8')
    admin_.money += money_to_card * Decimal('0.05')
    logics_matrix(profile, new_money)
    return Response(status=200)


# silver
@api_view(['GET'])
def referral_system_silver(request, id_):
    # Сбор данных
    profile = Profile.objects.get(user=request.user)
    card = 'card_' + str(id_)
    all_ = All.objects.all().first()
    cookies = request.COOKIES.get('utm')

    if cookies is None:
        cookies = None
    if Category_Silver.objects.filter(user__id=profile.id).exists():
        category_silver = Category_Silver.objects.get(user__id=profile.id)
    else:
        category_silver = Category_Silver()
        category_silver.user = profile
    # Проверка блокировки карты для пользователя
    if id_ == 6 and category_silver.card_6_disable is False:
        return Response(status=400)
    else:
        money_to_card = what_card(card, category_silver)
    money_to_card = Decimal(money_to_card)  # Стоимость карты
    if profile.money < money_to_card:
        return Response(status=400)
    # Второй случай (Если человек заходит без реф. ссылки, то 15% админу.)
    if cookies is None or cookies == '':
        admin_.money += money_to_card * Decimal('0.15')
        profile.money -= money_to_card
        message = message_for_bot.a['buy'].format(tokemon.bronze[id_ - 1])
        send_message_tgbot(message, profile.id)
        all_.money += money_to_card
        save(all_, profile, admin_, category_silver)
        # main_user = Profile.objects.get(referral_link=cookies)
        max_card_ = '0' + str(id_)
    else:
        main_user = Profile.objects.get(referral_link=cookies)
        max_card_ = '0' + str(id_)
        save(main_user)
        # Если у пригласившего не открыта карта номиналом,
        # которую купил рефер, то рефералка уходит админу
        if main_user.max_card < int(max_card_):
            if First_Line.objects.filter(main_user__id=admin_.id).exists():
                line_admin = First_Line.objects.get(main_user__id=admin_.id)
                profile.line_1 = line_admin.id
                line_admin.save()
                admin_.money += money_to_card * Decimal('0.1')
                all_.money += money_to_card
                profile.money -= money_to_card
                message = message_for_bot.a['buy'].format(tokemon.bronze[id_ - 1])
                send_message_tgbot(message, profile.id)
            else:
                line_admin = First_Line()
                line_admin.main_user = admin_
                profile.line_1 = line_admin.id
                line_admin.save()
                admin_.money += money_to_card * Decimal('0.1')
                all_.money += money_to_card
                profile.money -= money_to_card
                message = message_for_bot.a['buy'].format(tokemon.bronze[id_ - 1])
                send_message_tgbot(message, profile.id)
            save(main_user, all_, profile, admin_, category_silver)
        # третий случай (Если у пригласившего нет 2 и 3 линии, то 5% уходит админу)
        else:
            case_3_4_ref(main_user, money_to_card, all_, profile, id_, 'silver')
            save(category_silver)
    buy_card = Buy_Card()
    buy_card.user = profile
    card_ = Card()
    card_.price = money_to_card
    card_.category = 'silver'
    card_.name = id_
    card_.save()
    buy_card.card = card_
    buy_card.save()
    new_money = money_to_card * Decimal('0.8')
    admin_.money += money_to_card * Decimal('0.05')
    logics_matrix(profile, new_money)
    return Response(status=200)


# gold
@api_view(['GET'])
def referral_system_gold(request, id_):
    # Сбор данных
    profile = Profile.objects.get(user=request.user)
    card = 'card_' + str(id_)
    all_ = All.objects.all().first()
    cookies = request.COOKIES.get('utm')
    if cookies is None:
        cookies = None
    if Category_Gold.objects.filter(user__id=profile.id).exists():
        category_gold = Category_Gold.objects.get(user__id=profile.id)
    else:
        category_gold = Category_Gold()
        category_gold.user = profile
    # Проверка блокировки карты для пользователя
    if id_ == 6 and category_gold.card_6_disable is False:
        return Response(status=400)
    else:
        money_to_card = what_card(card, category_gold)
    money_to_card = Decimal(money_to_card)  # Стоимость карты
    if profile.money < money_to_card:
        return Response(status=400)
    # Второй случай (Если человек заходит без реф. ссылки, то 15% админу.)
    if cookies is None or cookies == '':
        admin_.money += money_to_card * Decimal('0.15')
        profile.money -= money_to_card
        message = message_for_bot.a['buy'].format(tokemon.bronze[id_ - 1])
        send_message_tgbot(message, profile.id)
        all_.money += money_to_card
        save(all_, profile, admin_, category_gold)
        # main_user = Profile.objects.get(referral_link=cookies)
        max_card_ = '0' + str(id_)
    else:
        main_user = Profile.objects.get(referral_link=cookies)
        max_card_ = '0' + str(id_)
        save(main_user)
        # Если у пригласившего не открыта карта номиналом,
        # которую купил рефер, то рефералка уходит админу
        if main_user.max_card < int(max_card_):
            if First_Line.objects.filter(main_user__id=admin_.id).exists():
                line_admin = First_Line.objects.get(main_user__id=admin_.id)
                profile.line_1 = line_admin.id
                line_admin.save()
                admin_.money += money_to_card * Decimal('0.1')
                all_.money += money_to_card
                profile.money -= money_to_card
                message = message_for_bot.a['buy'].format(tokemon.bronze[id_ - 1])
                send_message_tgbot(message, profile.id)
            else:
                line_admin = First_Line()
                line_admin.main_user = admin_
                profile.line_1 = line_admin.id
                line_admin.save()
                admin_.money += money_to_card * Decimal('0.1')
                all_.money += money_to_card
                profile.money -= money_to_card
                message = message_for_bot.a['buy'].format(tokemon.bronze[id_ - 1])
                send_message_tgbot(message, profile.id)
            save(main_user, all_, profile, admin_, category_gold)
        # третий случай (Если у пригласившего нет 2 и 3 линии, то 5% уходит админу)
        else:
            case_3_4_ref(main_user, money_to_card, all_, profile, 'gold')
            save(category_gold)
    buy_card = Buy_Card()
    buy_card.user = profile
    card_ = Card()
    card_.price = money_to_card
    card_.category = 'gold'
    card_.name = id_
    card_.save()
    buy_card.card = card_
    buy_card.save()
    new_money = money_to_card * Decimal('0.8')
    admin_.money += money_to_card * Decimal('0.05')
    logics_matrix(profile, new_money)
    return Response(status=200)

    # проверка на рефку
    # else:
    # a = Admin.objects.all().first()
    # b =
    # if Category_Bronze.objects.filter(user.id=).exists()


# emerald
@api_view(['GET'])
def referral_system_emerald(request, id_):
    # Сбор данных
    profile = Profile.objects.get(user=request.user)
    card = 'card_' + str(id_)
    all_ = All.objects.all().first()
    cookies = request.COOKIES.get('utm')
    if cookies is None:
        cookies = None
    if Category_Emerald.objects.filter(user__id=profile.id).exists():
        category_emerald = Category_Emerald.objects.get(user__id=profile.id)
    else:
        category_emerald = Category_Emerald()
        category_emerald.user = profile
    # Проверка блокировки карты для пользователя
    if id_ == 6 and category_emerald.card_6_disable is False:
        return Response(status=400)
    else:
        money_to_card = what_card(card, category_emerald)
    money_to_card = Decimal(money_to_card)  # Стоимость карты
    if profile.money < money_to_card:
        return Response(status=400)
    # Второй случай (Если человек заходит без реф. ссылки, то 15% админу.)
    if cookies is None or cookies == '':
        admin_.money += money_to_card * Decimal('0.15')
        profile.money -= money_to_card
        message = message_for_bot.a['buy'].format(tokemon.bronze[id_ - 1])
        send_message_tgbot(message, profile.id)
        all_.money += money_to_card
        save(all_, profile, admin_, category_emerald)
        # main_user = Profile.objects.get(referral_link=cookies)
        max_card_ = '0' + str(id_)
    else:
        main_user = Profile.objects.get(referral_link=cookies)
        max_card_ = '0' + str(id_)
        save(main_user)
        # Если у пригласившего не открыта карта номиналом,
        # которую купил рефер, то рефералка уходит админу
        if main_user.max_card < int(max_card_):
            if First_Line.objects.filter(main_user__id=admin_.id).exists():
                line_admin = First_Line.objects.get(main_user__id=admin_.id)
                profile.line_1 = line_admin.id
                line_admin.save()
                admin_.money += money_to_card * Decimal('0.1')
                all_.money += money_to_card
                profile.money -= money_to_card
                message = message_for_bot.a['buy'].format(tokemon.bronze[id_ - 1])
                send_message_tgbot(message, profile.id)
            else:
                line_admin = First_Line()
                line_admin.main_user = admin_
                profile.line_1 = line_admin.id
                line_admin.save()
                admin_.money += money_to_card * Decimal('0.1')
                all_.money += money_to_card
                profile.money -= money_to_card
                message = message_for_bot.a['buy'].format(tokemon.bronze[id_ - 1])
                send_message_tgbot(message, profile.id)
            save(main_user, all_, profile, admin_, category_emerald)
        # третий случай (Если у пригласившего нет 2 и 3 линии, то 5% уходит админу)
        else:
            case_3_4_ref(main_user, money_to_card, all_, profile, id_, 'emerald')
            save(category_emerald)
    buy_card = Buy_Card()
    buy_card.user = profile
    card_ = Card()
    card_.price = money_to_card
    card_.category = 'emerald'
    card_.name = id_
    card_.save()
    buy_card.card = card_
    buy_card.save()
    new_money = money_to_card * Decimal('0.8')
    admin_.money += money_to_card * Decimal('0.05')
    logics_matrix(profile, new_money)
    return Response(status=200)

    # проверка на рефку
    # else:
    # a = Admin.objects.all().first()
    # b =
    # if Category_Bronze.objects.filter(user.id=).exists()


def matrix_pay(main_matrix, money):
    user_1 = User_in_Matrix.objects.get(participant_number=main_matrix.go_money)
    user_2 = User_in_Matrix.objects.get(participant_number=(main_matrix.go_money + 1))
    if user_1.user.id == user_2.user.id:
        user_1.user.money += Decimal(money / 2) * 2
        mes = message_for_bot.a['win'].format(Decimal(money / 2) * 2)
        send_message_tgbot(mes, user_1.id)
        user_1.d += 1
        user_2.d += 1
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
        user_1.d += 1
        user_2.d += 1
        user_1.user.save()
        user_2.user.save()
        user_1.save()
        user_2.save()


# Логика матрицы
def logics_matrix(user_, money):
    profile = user_
    user_in_matrix = User_in_Matrix()
    user_in_matrix.user = Profile.objects.get(user=profile.user)
    card = Buy_Card.objects.get(user_id=profile.id)
    user_in_matrix.card = card
    if User_in_Matrix.objects.all().count() != 0:
        user_in_matrix.participant_number = User_in_Matrix.objects.order_by(
            '-participant_number').first().participant_number + 1
    else:
        user_in_matrix.participant_number = 0
    # Проверка существ главной матрицы
    if Matrix.objects.filter(up=True).exists():
        main_matrix = Matrix.objects.get(up=True)
        # Проверка на максимальность матрицы
        if main_matrix.col == main_matrix.max_users:
            # Проверка на вторую матрицу(принимающую)
            if Matrix.objects.filter(up=False).exists():
                down_matrix = Matrix.objects.get(up=False)
                # Проверка на максимальность матрицы
                if down_matrix.col == down_matrix.max_users:
                    print('Матрица полна')
                    down_matrix.up = True

                    temp = User_in_Matrix.objects.filter(matrix=main_matrix).order_by('-participant_number')
                    temp = temp.first().participant_number + 1
                    down_matrix.go_money = temp
                    main_matrix.delete()
                    new_matrix = Matrix()
                    new_matrix.max_users = down_matrix.max_users * 2
                    new_matrix.col += 1
                    user_in_matrix.matrix = new_matrix
                    matrix_pay(down_matrix, money)
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
                    matrix_pay(main_matrix, money)
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
                down_matrix.col += 1
                user_in_matrix.matrix = down_matrix
                matrix_pay(main_matrix, money)
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
            user_in_matrix.matrix = main_matrix
            main_matrix.col += 1
            user_in_matrix.save()
            main_matrix.save()
    else:
        main_matrix = Matrix()
        main_matrix.col += 1
        user_in_matrix.matrix = main_matrix
        main_matrix.up = True
        main_matrix.save()
        user_in_matrix.save()


# Модуль оплаты

# Класс оплаты
# Service function for working wit USDT contract
def address_to_parameter(addr):
    return "0" * 24 + base58.b58decode_check(addr)[1:].hex()


def amount_to_parameter(amount):
    return '%064x' % amount


# USDT contract interface
usdt_abi = [{"inputs": [{"name": "name_", "type": "string"}, {"name": "symbol_", "type": "string"}],
             "stateMutability": "Nonpayable", "type": "Constructor"}, {
                "inputs": [{"indexed": True, "name": "owner", "type": "address"},
                           {"indexed": True, "name": "spender", "type": "address"},
                           {"name": "value", "type": "uint256"}], "name": "Approval", "type": "Event"}, {
                "inputs": [{"name": "userAddress", "type": "address"},
                           {"name": "relayerAddress", "type": "address"},
                           {"name": "functionSignature", "type": "bytes"}], "name": "MetaTransactionExecuted",
                "type": "Event"}, {"inputs": [{"indexed": True, "name": "previousOwner", "type": "address"},
                                              {"indexed": True, "name": "newOwner", "type": "address"}],
                                   "name": "OwnershipTransferred", "type": "Event"}, {
                "inputs": [{"indexed": True, "name": "from", "type": "address"},
                           {"indexed": True, "name": "to", "type": "address"},
                           {"name": "value", "type": "uint256"}],
                "name": "Transfer", "type": "Event"},
            {"outputs": [{"type": "string"}], "name": "ERC712_VERSION", "stateMutability": "View",
             "type": "Function"},
            {"outputs": [{"type": "uint256"}],
             "inputs": [{"name": "owner", "type": "address"}, {"name": "spender", "type": "address"}],
             "name": "allowance", "stateMutability": "View", "type": "Function"}, {"outputs": [{"type": "bool"}],
                                                                                   "inputs": [{"name": "spender",
                                                                                               "type": "address"},
                                                                                              {"name": "amount",
                                                                                               "type": "uint256"}],
                                                                                   "name": "approve",
                                                                                   "stateMutability": "Nonpayable",
                                                                                   "type": "Function"},
            {"outputs": [{"type": "uint256"}], "inputs": [{"name": "account", "type": "address"}],
             "name": "balanceOf",
             "stateMutability": "View", "type": "Function"},
            {"outputs": [{"type": "uint8"}], "name": "decimals", "stateMutability": "View", "type": "Function"},
            {"outputs": [{"type": "bool"}],
             "inputs": [{"name": "spender", "type": "address"}, {"name": "subtractedValue", "type": "uint256"}],
             "name": "decreaseAllowance", "stateMutability": "Nonpayable", "type": "Function"},
            {"outputs": [{"type": "bytes"}],
             "inputs": [{"name": "userAddress", "type": "address"}, {"name": "functionSignature", "type": "bytes"},
                        {"name": "sigR", "type": "bytes32"}, {"name": "sigS", "type": "bytes32"},
                        {"name": "sigV", "type": "uint8"}], "name": "executeMetaTransaction",
             "stateMutability": "Payable", "type": "Function"},
            {"outputs": [{"type": "uint256"}], "name": "getChainId", "stateMutability": "Pure", "type": "Function"},
            {"outputs": [{"type": "bytes32"}], "name": "getDomainSeperator", "stateMutability": "View",
             "type": "Function"},
            {"outputs": [{"name": "nonce", "type": "uint256"}], "inputs": [{"name": "user", "type": "address"}],
             "name": "getNonce", "stateMutability": "View", "type": "Function"}, {"outputs": [{"type": "bool"}],
                                                                                  "inputs": [{"name": "spender",
                                                                                              "type": "address"},
                                                                                             {"name": "addedValue",
                                                                                              "type": "uint256"}],
                                                                                  "name": "increaseAllowance",
                                                                                  "stateMutability": "Nonpayable",
                                                                                  "type": "Function"},
            {"inputs": [{"name": "amount", "type": "uint256"}], "name": "mint", "stateMutability": "Nonpayable",
             "type": "Function"},
            {"outputs": [{"type": "string"}], "name": "name", "stateMutability": "View", "type": "Function"},
            {"outputs": [{"type": "address"}], "name": "owner", "stateMutability": "View", "type": "Function"},
            {"name": "renounceOwnership", "stateMutability": "Nonpayable", "type": "Function"},
            {"outputs": [{"type": "string"}], "name": "symbol", "stateMutability": "View", "type": "Function"},
            {"outputs": [{"type": "uint256"}], "name": "totalSupply", "stateMutability": "View",
             "type": "Function"},
            {"outputs": [{"type": "bool"}],
             "inputs": [{"name": "recipient", "type": "address"}, {"name": "amount", "type": "uint256"}],
             "name": "transfer", "stateMutability": "Nonpayable", "type": "Function"},
            {"outputs": [{"type": "bool"}],
             "inputs": [{"name": "sender",
                         "type": "address"},
                        {"name": "recipient",
                         "type": "address"},
                        {"name": "amount",
                         "type": "uint256"}],
             "name": "transferFrom",
             "stateMutability": "Nonpayable",
             "type": "Function"},
            {"inputs": [{"name": "newOwner", "type": "address"}], "name": "transferOwnership",
             "stateMutability": "Nonpayable", "type": "Function"}]


# Main Class
class TronClient:
    """TRON API Client
    """

    def __init__(self, config=False):
        """class initialization

        Args:
            config (optional): app config object, defaults to nile testnet
        """
        if not config or config == {}:
            self.tron_url = "https://api.nileex.io"
            self.trongrid_url = 'https://nile.trongrid.io'
            self.usdt_address = "TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj"
            self.fee_limit = 20000000
            self.api_key = 'f1870c5e-191b-406e-8531-070d9c8ec425'

        else:
            self.tron_url = config['TRON_URL']
            self.usdt_address = config['USDT_CONTRACT_ADDRESS']
            self.fee_limit = config['DEFAULT_FEE_LIMIT']
            self.api_key = config['API_KEY']
        try:
            self.client = Tron(HTTPProvider(self.tron_url, api_key=self.api_key))
            # self.client = Tron(network='nile', api_key=self.api_key)
            self.usdt_contract = self.client.get_contract(str(self.usdt_address))
        except Exception as e:
            print('Error Tron initialization', str(e))
        else:
            pass

    def is_address(self, address: str) -> bool:
        """Check if string if valid TRON address

        Args:
            address (str): address

        Returns:
            bool : valid address or not
        """
        return address and self.client.is_address(address)

    def create_wallet(self) -> dict:
        """Generate new wallet

        Returns:
            dict : wallet private and public keys
        """

        wallet = self.client.generate_address()
        return wallet

    def trx_balance(self, address: str) -> float:
        """TRX Balance of address, 0 if not activated

        Args:
            address (str): wallet address

        Returns:
            float: TRX balance
        """
        try:
            balance = self.client.get_account_balance(str(address))
        except Exception as e:
            return 0.0
        return float(balance)

    def usdt_balance(self, address: str) -> int:
        url = self.tron_url + '/wallet/triggerconstantcontract'
        METHOD_BALANCE_OF = 'balanceOf(address)'
        payload = {
            'owner_address': base58.b58decode_check(address).hex(),
            'contract_address': base58.b58decode_check(self.usdt_address).hex(),
            'function_selector': METHOD_BALANCE_OF,
            'parameter': address_to_parameter(address),
        }
        resp = requests.post(url, json=payload)
        data = resp.json()

        if data['result'].get('result', None):
            print(data['constant_result'])
            val = data['constant_result'][0]
            print(address, 'balance =', int(val, 16))
            return int(val, 16)
        else:
            print('error:', bytes.fromhex(data['result']['message']).decode())
            return 0

    def usdt_txns(self, address: str) -> dict:
        """USDT Transactions of the wallet
         taken from the  trongrid  API 200 last
        Args:
            address (str): wallet adress

        Returns:
            dict: {success, result:[transaction list]}
        """
        url = f"{self.trongrid_url}/v1/accounts/{address}/transactions/trc20?limit=200&contract_address=" \
              f"{self.usdt_address}"
        try:
            r = requests.get(url)
        except Exception as e:
            error_string = f"Error getting usdt txns from {address} - {str(e)}"
            return {'success': False, 'result': error_string}
        else:
            print(url)
            return {'success': True, 'result': r.json()}

    def transaction_detail(self, transaction_hash: str) -> dict:
        """Transaction details of a given tx hash

        Args:
            transaction_hash (str): tx hash

        Returns:
            dict: transaction details
        """
        info = self.client.get_transaction_info(str(transaction_hash))
        return info

    def send_usdt(self, source: str, destination: str, amount: int, private_key: str) -> dict:
        """Send USDT

        Args:
            source (str): sender address
            destination (str): receiver address
            amount (int): amount to send in wei
            private_key (str): sender private key

        Returns:
            dict: status, result check
        """
        try:
            priv_key = PrivateKey(bytes.fromhex(private_key))
            txn = (
                self.usdt_contract.functions.transfer(destination, amount)
                .with_owner(source)  # address of the private key
                .fee_limit(self.fee_limit)
                .build()
                .sign(priv_key)
                .broadcast()
                .wait()
            )

        except Exception as ex:
            return {"result": "Error",
                    "description": f"Error transferring of {amount} USDT from {source} to {destination} - {str(ex)} "}
        else:
            print(txn)
            return {"result": "Success", "tx": txn}

    def send_trx(self, source: str, destination: str, amount: int, private_key: str) -> dict:
        """Send TRX

        Args:
            source (str): sender address
            destination (str): receiver address
            amount (int): amount to send in wei
            private_key (str): sender key

        Returns:
            dict: status, result
        """
        try:
            priv_key = PrivateKey(bytes.fromhex(private_key))
            txn = (
                self.client.trx.transfer(str(source), str(destination), int(amount))
                .build()
                .inspect()
                .sign(priv_key)
                .broadcast()
                .wait()
            )

        except Exception as ex:
            return {"result": "Error",
                    "description": f"Error transferring of {amount} TRX from {source} to {destination} - {str(ex)}"}
        else:
            return {"result": "Success", "tx": txn}


# Оплата
tc = TronClient()
# Центральный кошелек для этого демо - первый кошелек в базе. Если его нет, создаем его

if not Wallet.objects.all().count() == 0:
    wallet = tc.create_wallet()
    w = Wallet(address=wallet['base58check_address'], pkey=wallet['private_key'])
    w.save()
central = Wallet.objects.all().first()

# Газ, необходимый для транзакции пересылки (TRX wei)
gas_needed = 8 * 10 ** 6


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
def collect_usdt(request):
    w = Wallet.objects.get(address=request.form.get('address'))
    pkey = w.pkey
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

    a = tc.send_usdt(w.address, central.address, 1 * 10 ** 6, w.pkey)
    if a.get('result') == 'Success':
        tx = a.get('tx', {})
        tx_id = tx.get('id', '')
        tx_fee = tx.get('fee', 0)
        tx_timestamp = int(tx.get('blockTimeStamp', 0) / 1000)
        new_tx = Transaction(tx_id=tx_id,
                             sender=w.address,
                             receiver=central.address,
                             currency='USDT',
                             amount=1,
                             fee=tx_fee,
                             timestamp=tx_timestamp,
                             )
        new_tx.save()
        return new_tx
    else:
        return False


# Отправка TRX на кошелек
# @app.route('/send_trx', methods=['POST'])
def send_trx(request):
    # print(request.form)
    w = Wallet.objects.get(address=request.form.get('address'))
    pkey = w.pkey

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
def send_usdt(request):
    if request.method == "POST":
        w = Wallet.objects.get(address=request.form.get('address'))
        pkey = w.pkey
        a = tc.send_usdt(central.address, w.address, 1 * 10 ** 6, central.pkey)
        if a.get('result') == 'Success':
            tx = a.get('tx', {})
            tx_id = tx.get('id', '')
            tx_fee = tx.get('fee', 0)
            tx_timestamp = int(tx.get('blockTimeStamp', 0) / 1000)
            new_tx = Transaction(tx_id=tx_id,
                                 sender=central.address,
                                 receiver=w.address,
                                 currency='USDT',
                                 amount=1,
                                 fee=tx_fee,
                                 timestamp=tx_timestamp,
                                 )
            new_tx.save()
            return new_tx
        else:
            return False
    else:
        return render(request, 'backend/send_usdt.html')


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


# Главная
# @app.route('/', methods=['GET'])
def main(request):
    # wallets = select(w for w in Wallet)[:]
    wallets = Wallet.objects.all()
    # transactions = select(t for t in Transaction)[:]
    transactions = Transaction.objects.all()
    # usdt_balances = {a: await get_usdt_balance(a) for a in  select(t.address for t in Wallet)[:]}
    # trx_balances = {a: await get_trx_balance(a) for a in  select(t.address for t in Wallet)[:]}
    a = dict()
    for el in wallets:
        a[el] = get_usdt_balance(w.address)
    b = dict()
    for el in wallets:
        b[el] = get_trx_balance(w.address)
    return render(request, 'backend/paymant.html', {'wallets': wallets, 'transactions': transactions,
                                                    'a': a, 'b': b})
