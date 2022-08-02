from django.test import TestCase
from django.contrib.auth.models import User
from backend.models import User_in_Matrix, Matrix, Profile, All, First_Line, Second_Line, Third_Line, \
    Category_Bronze, Buy_Card, Card, Category_Silver, Category_Gold, Category_Emerald, History_card
from decimal import *
from backend.views import what_card, admin_, save, case_3_4_ref, logics_matrix, register_page


def referral_system_bronze(request, id_):
    # Сбор данных
    profile = Profile.objects.get(user_id=request.user.id)
    if User_in_Matrix.objects.filter(user=profile).filter(matrix__up=True).filter(card__card__category='bronze').filter(
            card__card__name=id_).exists():
        us_pr = User_in_Matrix.objects.filter(user=profile).filter(card__card__category='bronze').filter(
            card__card__name=id_).get(matrix__up=True).d
        if us_pr < 4:
            return 0
    card = 'card_' + str(id_)
    all_ = All.objects.all().first()
    if profile.line_1 is not None:
        main_user = First_Line.objects.get(id=profile.line_1).main_user
    else:
        main_user = None
    if Category_Bronze.objects.filter(user__id=profile.id).exists():
        category_bronze = Category_Bronze.objects.get(user__id=profile.id)
    else:
        category_bronze = Category_Bronze()
        category_bronze.user = profile
    # Проверка блокировки карты для пользователя
    if id_ == 6 and category_bronze.card_6_disable is False:
        print('error')
        return 0
    else:
        money_to_card = what_card(card, category_bronze)
    money_to_card = Decimal(money_to_card)  # Стоимость карты
    if profile.money < money_to_card:
        print('error, money')
        return 0
    # Второй случай (Если человек заходит без реф. ссылки, то 15% админу.)
    if main_user is None:
        admin_.money += money_to_card * Decimal('0.15')
        profile.money -= money_to_card
        all_.money += money_to_card
        save(all_, profile, admin_, category_bronze)
        # main_user = Profile.objects.get(referral_link=cookies)
    else:
        main_user = main_user
        max_card_ = '0' + str(id_)
        save(main_user)
        # Если у пригласившего не открыта карта номиналом,
        # которую купил рефер, то рефералка уходит админу
        if not Buy_Card.objects.filter(user=main_user).filter(card__category='bronze').filter(card__name=id_).exists():
            admin_.money += money_to_card * Decimal('0.1')
            all_.money += money_to_card
            profile.money -= money_to_card
            if main_user.line_1 is not None:
                sec_main_prof = First_Line.objects.get(id=main_user.line_1).main_user
                if Buy_Card.objects.filter(user=sec_main_prof).filter(card__category='bronze').filter(
                        card__name=id_).exists():
                    sec_main_prof += money_to_card * Decimal('0.04')
                    sec_main_prof.save()
                else:
                    admin_.money += money_to_card * Decimal('0.04')
                if sec_main_prof.line_1 is not None:
                    th_main_prof = First_Line.objects.get(id=sec_main_prof.line_1).main_user
                    if Buy_Card.objects.filter(user=th_main_prof).filter(card__category='bronze').filter(
                            card__name=id_).exists():
                        th_main_prof += money_to_card * Decimal('0.01')
                        th_main_prof.save()
                    else:
                        admin_.money += money_to_card * Decimal('0.01')
            save(main_user, all_, profile, admin_, category_bronze)
        # третий случай (Если у пригласившего нет 2 и 3 линии, то 5% уходит админу)
        else:
            case_3_4_ref(main_user, money_to_card, profile, money_to_card)
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
    profile.max_card = id_
    hist = History_card()
    hist.buy = True
    hist.price = money_to_card
    hist.user = profile
    hist.save()
    profile.save()
    new_money = money_to_card * Decimal('0.8')
    admin_.money += money_to_card * Decimal('0.05')
    logics_matrix(profile, new_money, buy_card)
    return 1


class Request1:
    data = {

    }
    user = None

class BronzeTest(TestCase):
    @classmethod
    def setUp(cls):
        if not All.objects.all().exists():
            a = All()
            a.save()
        c = User.objects.filter(username='admin')
        c.delete()
        t = Profile.objects.filter(admin_or=True)
        t.delete()
        if not Profile.objects.filter(admin_or=True).exists():
            if not User.objects.filter(username='admin').exists():
                user = User()
                user.username = 'admin'
                user.password = 'admin'
                user.save()
            else:
                user = User.objects.get(username='admin')
            profile2 = Profile()
            profile2.admin_or = True
            profile2.user = user
            profile2.save()
        else:
            a = User.objects.get(user__username='admin')
            profile2 = Profile()
            profile2.admin_or = True
            profile2.user = a
            profile2.save()
        st = 'User_'
        for el in range(1, 101):
            User.objects.create(username=st + str(el), password='12345678')
        for el in range(1, 101):
            user = User.objects.get(username=st + str(el))
            profile = Profile.objects.create(user=user, money=100)
            utm_temp = profile.referral_link
            profile.save()

    # def test_bronz(self):
    #     st = 'User_'
    #     utm = None
    #     admin_ = Profile.objects.filter(admin_or=True).first()
    #     a = []
    #     for el in range(1, 7):
    #         a.append(Profile.objects.get(user__username=st + str(el)))
    #
    #     # cookies_ = Profile.objects.get(user__username=st + str(4)).referral_link
    #     cookies_ = utm
    #     i = 0
    #     for el in a:
    #         i += 1
    #         referral_system_emerald(el, 3, admin_)
    #         print(el.user.username)
    #         print(el.money)
    #     for el in a:
    #         el.refresh_from_db()
    #     print('kine_1')
    #     for el in First_Line.objects.all():
    #         print(el.main_user.user.username)
    #     print('kine_2')
    #     for el in Second_Line.objects.all():
    #         print(el.main_user.user.username)
    #     print('kine_3')
    #     for el in Third_Line.objects.all():
    #         print(el.main_user.user.username)
    #     proce_card = 7500
    #     price = 7500 * 0.8
    #     price /= 2
    #     for el in range(0, 6):
    #         print(a[el].user.username)
    #         print(a[el].money)
    #         if el == 0 or el == 1:
    #             self.assertEqual(
    #                 a[el].money,
    #                 10000 - proce_card + proce_card * 0.1 + proce_card * 0.04 + 0.01 * proce_card + 0.4 * proce_card)
    #         elif el == 2:
    #             self.assertEqual(
    #                 a[el].money,
    #                 10000 - proce_card + proce_card * 0.1 + proce_card * 0.04 + 0.01 * proce_card + 0.4 * proce_card)
    #         elif el == 3:
    #             self.assertEqual(
    #                 a[el].money, 10000 - proce_card + proce_card * 0.1 + proce_card * 0.04 + 0.4 * proce_card)
    #         elif el == 4:
    #             self.assertEqual(a[el].money, 10000 - proce_card + proce_card * 0.1)
    #         else:
    #             self.assertEqual(a[el].money, 10000 - proce_card)
    #     print(admin_.money)
    #     self.assertEqual(admin_.money, proce_card * 0.2 + proce_card * 0.1 + proce_card * 0.06 + proce_card * 0.05 * 3)
    #     # self.assertEqual(a[el].money, 90)
    #
    #     # self.assertEqual(a[el].money, 90)

    # def test_bronz2(self):
    #     st = 'User_'
    #     utm = None
    #     a = []
    #     for el in range(1, 101):
    #         a.append(Profile.objects.get(user__username=st + str(el)))
    #     # cookies_ = Profile.objects.get(user__username=st + str(4)).referral_link
    #     cookies_ = utm
    #     # i = 0
    #     # print(admin_.user.username)
    #     # print(admin_.money)
    #     referral_system_bronze(a[0], 1)
    #     for el in range(1, 4):
    #         referral_system_bronze(a[el], 1)
    #     for el in range(4, 12):
    #         referral_system_bronze(a[el], 1)
    #         g = Category_Bronze.objects.get(user=a[0])
    #         g.card_6_disable = True
    #         g.save()
    #         referral_system_bronze(a[0], 6)
    #     referral_system_bronze(a[0], 1)
    #
    #     # for el in range(0, 100):
    #     # print(get_user_in_card(a[el]))
    #     # el1 = get_user_in_matrix(a[el])
    #     # print(el1)
    #     # print(get_hist_card(a[el]))
    #     # print(el1['bronze'])
    #     # for el2 in el1.get('bronze'):
    #     #     print(el2)
    #     # print(el1['silver'])
    #     # for el2 in el1.get('silver'):
    #     #     print(el2)
    #     # print(el1['gold'])
    #     # for el2 in el1['gold']:
    #     #     print(el2)
    #     # print(el1['emerald'])
    #     # for el2 in el1['emerald']:
    #     #     print(el2)
    #     for el in a:
    #         el.refresh_from_db()
    #         print(el.user.username)
    #         print(el.money)
    #     for el in User_in_Matrix.objects.all():
    #         print(el.user.user.username)
    #         print(el.user.money)
    #         print(el.d)
    #         print(el.matrix.price)
    #         print(el.matrix.up)
    #
    #     # for el in range(0, 100):
    #     #
    #     # print(admin_.user.username)
    #     # print(admin_.money)
    #     # self.assertEqual(a[el].money, 90)
    #     # self.assertEqual(a[el].money, 90)

    def test_ref_sys(self):
        request = Request1()
        st = 'tering'
        st2 = '@yandex.ru'
        utm = None
        tmp = None
        for el in range(0, 5):
            if utm is not None:
                data = {
                    'username': '1',
                    'password1': '12345678QWER',
                    'email': st + str(el) + st2,
                    'password2': '12345678QWER',
                    'utm': utm
                }
            else:
                data = {
                    'username': '1',
                    'password1': '12345678QWER',
                    'email': st + str(el) + st2,
                    'password2': '12345678QWER',
                }
            request.data = data
            register_page(request)
            request.user = Profile.objects.get(user__email=st + str(el) + st2)
            utm = Profile.objects.get(user__email=st + str(el) + st2).referral_link
            print(Profile.objects.get(user__email=st + str(el) + st2).user.username)
            print(Profile.objects.get(user__email=st + str(el) + st2).line_1)
            print(Profile.objects.get(user__email=st + str(el) + st2).line_2)
            print(Profile.objects.get(user__email=st + str(el) + st2).line_3)
            referral_system_bronze(request, 1)
        for el in Profile.objects.all():
            print(el.user.username)
            print(el.money)
        for el in First_Line.objects.all():
            print(el.main_user)
            print(el.lost_profit)
            print(el.profit)
            print(el.total_person)
        print(admin_.user.username)
        print(admin_.money)

