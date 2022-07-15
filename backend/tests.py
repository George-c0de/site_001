from django.shortcuts import render
from django.test import TestCase
from django.contrib.auth.models import User

from backend.models import User_in_Matrix, Matrix, Profile, Category_Silver, All, First_Line, Second_Line, Third_Line, \
    Category_Bronze, Buy_Card, Card
from decimal import *


# def matrix_pay(main_matrix, money):
#     user_1 = User_in_Matrix.objects.get(participant_number=main_matrix.go_money)
#     user_2 = User_in_Matrix.objects.get(participant_number=(main_matrix.go_money + 1))
#     if user_1.user.id == user_2.user.id:
#         user_1.user.money += Decimal(money / 2) * 2
#         user_1.d += 1
#         user_2.d += 1
#         user_2.save()
#         user_2.user.save()
#         user_1.user.save()
#         user_1.save()
#     else:
#         user_1.user.money += Decimal(money / 2)
#         user_2.user.money += Decimal(money / 2)
#         user_1.d += 1
#         user_2.d += 1
#         user_1.user.save()
#         user_2.user.save()
#         user_1.save()
#         user_2.save()
#
#
# def search(main_matrix, ):
#     all_users = User_in_Matrix.objects.filter(matrix=main_matrix).order_by('-participant_number')
#     if all_users[1].participant_number == main_matrix.go_money:
#         main_matrix.go_money = all_users[-1]
#     elif all_users[0].participant_number == main_matrix.go_money:
#         main_matrix.go_money = all_users[-2]
#     else:
#         main_matrix.go_money += 2
#
#
# def logics_matrix(a, money):
#     for el in a:
#         profile = el
#         user_in_matrix = User_in_Matrix()
#         user_in_matrix.user = profile
#         if User_in_Matrix.objects.all().count() != 0:
#             user_in_matrix.participant_number = User_in_Matrix.objects.order_by(
#                 '-participant_number').first().participant_number + 1
#         else:
#             user_in_matrix.participant_number = 0
#         # Проверка существ главной матрицы
#         if Matrix.objects.filter(up=True).exists():
#             main_matrix = Matrix.objects.get(up=True)
#             # Проверка на максимальность матрицы
#             if main_matrix.col == main_matrix.max_users:
#                 # Проверка на вторую матрицу(принимающую)
#                 if Matrix.objects.filter(up=False).exists():
#                     down_matrix = Matrix.objects.get(up=False)
#                     # Проверка на максимальность матрицы
#                     if down_matrix.col == down_matrix.max_users:
#                         print('Матрица полна')
#                         down_matrix.up = True
#
#                         temp = User_in_Matrix.objects.filter(matrix=main_matrix).order_by('-participant_number')
#                         temp = temp.first().participant_number + 1
#                         down_matrix.go_money = temp
#                         main_matrix.delete()
#                         new_matrix = Matrix()
#                         new_matrix.max_users = down_matrix.max_users * 2
#                         new_matrix.col += 1
#                         user_in_matrix.matrix = new_matrix
#                         matrix_pay(down_matrix, money)
#                         all_users = User_in_Matrix.objects.filter(matrix=down_matrix).order_by('-participant_number')
#                         if all_users[1].participant_number == down_matrix.go_money:
#                             down_matrix.go_money = all_users[all_users.count() - 1].participant_number
#                         elif all_users[0].participant_number == down_matrix.go_money:
#                             down_matrix.go_money = all_users[all_users.count() - 2].participant_number
#                         else:
#                             down_matrix.go_money += 2
#                         # save
#                         down_matrix.save()
#                         new_matrix.save()
#                         user_in_matrix.save()
#                     else:
#                         matrix_pay(main_matrix, money)
#                         all_users = User_in_Matrix.objects.filter(matrix=main_matrix).order_by('-participant_number')
#                         if all_users[1].participant_number == main_matrix.go_money:
#                             main_matrix.go_money = all_users[all_users.count() - 1].participant_number
#                         elif all_users[0].participant_number == main_matrix.go_money:
#                             main_matrix.go_money = all_users[all_users.count() - 2].participant_number
#                         else:
#                             main_matrix.go_money += 2
#                         down_matrix.col += 1
#                         user_in_matrix.matrix = down_matrix
#                         # save
#                         user_in_matrix.save()
#                         down_matrix.save()
#                         main_matrix.save()
#                 else:
#                     down_matrix = Matrix()
#                     down_matrix.max_users = main_matrix.max_users * 2
#                     down_matrix.col += 1
#                     user_in_matrix.matrix = down_matrix
#                     matrix_pay(main_matrix, money)
#                     all_users = User_in_Matrix.objects.filter(matrix=main_matrix).order_by('-participant_number')
#                     if all_users[1].participant_number == main_matrix.go_money:
#                         main_matrix.go_money = all_users[all_users.count() - 1].participant_number
#                     elif all_users[0].participant_number == main_matrix.go_money:
#                         main_matrix.go_money = all_users[all_users.count() - 2].participant_number
#                     else:
#                         main_matrix.go_money += 2
#                         # save
#                     main_matrix.save()
#                     down_matrix.save()
#                     user_in_matrix.save()
#             else:
#                 user_in_matrix.matrix = main_matrix
#                 main_matrix.col += 1
#                 user_in_matrix.save()
#                 main_matrix.save()
#         else:
#             main_matrix = Matrix()
#             main_matrix.col += 1
#             user_in_matrix.matrix = main_matrix
#             main_matrix.up = True
#             main_matrix.save()
#             user_in_matrix.save()
#
#
# class Matrix_test(TestCase):
#     @classmethod
#     def setUp(cls):
#         st = 'User_'
#         for el in range(1, 101):
#             User.objects.create(username=st + str(el), password='12345678')
#         for el in range(1, 101):
#             user = User.objects.get(username=st + str(el))
#             Profile.objects.create(user=user)
#
#     def test_5_user(self):
#         user_1 = Profile.objects.get(user__username='User_1')
#         user_2 = Profile.objects.get(user__username='User_2')
#         user_3 = Profile.objects.get(user__username='User_3')
#         user_4 = Profile.objects.get(user__username='User_4')
#         user_5 = Profile.objects.get(user__username='User_5')
#         a = [user_1, user_2, user_3, user_4, user_5]
#         money = 80
#         logics_matrix(a, money)
#         for el in a:
#             el.refresh_from_db()
#         self.assertEqual(user_1.money, 40)
#         self.assertEqual(user_2.money, 40)
#         self.assertEqual(Matrix.objects.count(), 2)
#         self.assertEqual(Matrix.objects.filter(up=True).count(), 1)
#         self.assertEqual(Matrix.objects.filter(up=False).count(), 1)
#         self.assertEqual(User_in_Matrix.objects.count(), 5)
#         self.assertEqual(User_in_Matrix.objects.filter(matrix=Matrix.objects.get(up=True)).count(), 4)
#         self.assertEqual(User_in_Matrix.objects.filter(matrix=Matrix.objects.get(up=False)).count(), 1)
#         self.assertEqual(User_in_Matrix.objects.get(user=user_1).d, 1)
#         self.assertEqual(User_in_Matrix.objects.get(user=user_2).d, 1)
#         self.assertEqual(User_in_Matrix.objects.get(user=user_1).participant_number, 0)
#         self.assertEqual(User_in_Matrix.objects.get(user=user_2).participant_number, 1)
#         self.assertEqual(User_in_Matrix.objects.get(user=user_3).participant_number, 2)
#         self.assertEqual(User_in_Matrix.objects.get(user=user_4).participant_number, 3)
#         self.assertEqual(User_in_Matrix.objects.get(user=user_5).participant_number, 4)
#
#     def test_3_user(self):
#         user_1 = Profile.objects.get(user__username='User_1')
#         user_2 = Profile.objects.get(user__username='User_2')
#         user_3 = Profile.objects.get(user__username='User_3')
#         a = [user_1, user_2, user_3]
#         money = 80
#         logics_matrix(a, money)
#         for el in a:
#             el.refresh_from_db()
#         self.assertEqual(Matrix.objects.all().count(), 1)
#         self.assertEqual(Matrix.objects.filter(up=True).count(), 1)
#         self.assertEqual(user_1.money, 0)
#         self.assertEqual(user_2.money, 0)
#         self.assertEqual(user_3.money, 0)
#         for el in User_in_Matrix.objects.all():
#             self.assertEqual(el.d, 0)
#             self.assertEqual(el.user.money, 0)
#
#     def test_13_user(self):
#         user_1 = Profile.objects.get(user__username='User_1')
#         user_2 = Profile.objects.get(user__username='User_2')
#         user_3 = Profile.objects.get(user__username='User_3')
#         user_4 = Profile.objects.get(user__username='User_4')
#         user_5 = Profile.objects.get(user__username='User_5')
#         user_6 = Profile.objects.get(user__username='User_6')
#         user_7 = Profile.objects.get(user__username='User_7')
#         user_8 = Profile.objects.get(user__username='User_8')
#         user_9 = Profile.objects.get(user__username='User_9')
#         user_10 = Profile.objects.get(user__username='User_10')
#         user_11 = Profile.objects.get(user__username='User_11')
#         user_12 = Profile.objects.get(user__username='User_12')
#         user_13 = Profile.objects.get(user__username='User_13')
#         user_14 = Profile.objects.get(user__username='User_14')
#         user_15 = Profile.objects.get(user__username='User_15')
#         a = [user_1, user_2, user_3, user_4, user_5, user_6,
#              user_7, user_8, user_9, user_10, user_11, user_12,
#              user_13, user_14, user_15]
#         money = 80
#         logics_matrix(a, money)
#         for el in a:
#             el.refresh_from_db()
#             print(el.user.username)
#             print(el.money)
#
#         for el in range(0, 4):
#             # self.assertEqual(User_in_Matrix.objects.get(user=a[el]).d, 4)
#             self.assertEqual(a[el].money, 160)
#         for el in range(4, 10):
#             self.assertEqual(User_in_Matrix.objects.get(user=a[el]).d, 1)
#             self.assertEqual(a[el].money, 40)
#         self.assertEqual(Matrix.objects.all().count(), 2)
#         self.assertEqual(Matrix.objects.filter(up=True).count(), 1)
#         self.assertEqual(Matrix.objects.filter(up=False).count(), 1)
#
#         self.assertEqual(Matrix.objects.get(up=True).max_users, 8)
#         self.assertEqual(Matrix.objects.get(up=False).max_users, 16)
#
#         self.assertEqual(User_in_Matrix.objects.filter(matrix=Matrix.objects.get(up=False)).count(), 3)
#         self.assertEqual(User_in_Matrix.objects.filter(matrix=Matrix.objects.get(up=True)).count(), 8)
#
#     def test_100_ser(self):
#         st = 'User_'
#         money = 80
#         a = []
#         for el in range(1, 101):
#             a.append(Profile.objects.get(user__username=st + str(el)))
#         logics_matrix(a, money)
#         for el in a:
#             el.refresh_from_db()
#         self.assertEqual(Matrix.objects.all().count(), 2)
#         self.assertEqual(Matrix.objects.filter(up=True).count(), 1)
#         self.assertEqual(Matrix.objects.filter(up=False).count(), 1)
#
#         self.assertEqual(User_in_Matrix.objects.filter(matrix=Matrix.objects.get(up=True)).count(), 32)
#         self.assertEqual(User_in_Matrix.objects.filter(matrix=Matrix.objects.get(up=False)).count(), 40)
#         for el in range(0, 28):
#             print('№' + str(el))
#             self.assertEqual(User_in_Matrix.objects.filter(user=a[el]).exists(), False)
#             self.assertEqual(a[el].money, 160)
#             print(a[el].money)
#             # self.assertEqual(a[el].money, 160)
#         for el in range(28, 44):
#             print('№' + str(el))
#             print(a[el].money)
#             self.assertEqual(a[el].money, 120)
#         for el in range(44, 60):
#             print('№' + str(el))
#             print(a[el].money)
#             self.assertEqual(a[el].money, 80)
#
#     def test_user_2(self):
#         money = 80
#         a = []
#         for el in range(1, 101):
#             a.append(Profile.objects.get(user__username='User_1'))
#         logics_matrix(a, money)
#         for el in a:
#             el.refresh_from_db()
#         el = Profile.objects.get(user__username='User_1')
#         print(el.money)
#         self.assertEqual(el.money, 7680)
#
#     def test_user_2_and_1_rand(self):
#         money = 80
#         a = []
#         a.append(Profile.objects.get(user__username='User_2'))
#         for el in range(1, 101):
#             a.append(Profile.objects.get(user__username='User_1'))
#         logics_matrix(a, money)
#         for el in a:
#             el.refresh_from_db()
#         print(Profile.objects.get(user__username='User_2').money)
#         el = Profile.objects.get(user__username='User_1')
#         print(el.money)
#         self.assertEqual(el.money, 7600)


#

def save(*args):
    for el in args:
        el.save()


def case_3_4_ref(main_user, money_to_card, all_, profile, admin_):
    second_line = False
    third_line = False
    if Second_Line.objects.filter(main_user__id=main_user.id).exists():
        second_line = True
    if Third_Line.objects.filter(main_user__id=main_user.id).exists():
        third_line = True
    if not second_line and not third_line:
        admin_.money += money_to_card * Decimal('0.05')
        main_user.money += money_to_card * Decimal('0.1')
        all_.money += money_to_card
        profile.money -= money_to_card
    # четвертый случай
    elif not third_line:
        admin_.money += money_to_card * Decimal('0.01')
        profile.money -= money_to_card
        main_user.money += money_to_card * Decimal('0.1')
        all_.money += money_to_card
    else:
        profile.money -= money_to_card
        main_user.money += money_to_card * Decimal('0.1')
        all_.money += money_to_card
    save(main_user, all_, profile, admin_)


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


def referral_system_silver(a, id_, cookies_, admin_):
    # Сбор данных
    for el in a:
        profile = Profile.objects.get(user__id=el.id)
        card = 'card_' + str(id_)
        all_ = All.objects.all().first()
        cookies = cookies_
        if cookies is None:
            cookies = None
        if Category_Silver.objects.filter(user__id=profile.id).exists():
            category_bronze = Category_Silver.objects.get(user__id=profile.id)
        else:
            category_bronze = Category_Silver()
            category_bronze.user = profile
        # Проверка блокировки карты для пользователя
        if id_ == 6 and category_bronze.card_6_disable is False:
            print('no money')
            return 0
        else:
            money_to_card = what_card(card, category_bronze)
        money_to_card = Decimal(money_to_card)  # Стоимость карты
        # Второй случай (Если человек заходит без реф. ссылки, то 15% админу.)
        if cookies is None or cookies == '':
            admin_.money += money_to_card * Decimal('0.15')
            profile.money -= money_to_card
            all_.money += money_to_card
            save(all_, profile, admin_, category_bronze)
            # main_user = Profile.objects.get(referral_link=cookies)
            max_card_ = '0' + str(id_)
        else:
            main_user = Profile.objects.get(referral_link=cookies)
            max_card_ = '0' + str(id_)
            save(main_user)
            if profile.money < money_to_card:
                print('no money')
                return 0
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
                else:
                    line_admin = First_Line()
                    line_admin.main_user = admin_
                    profile.line_1 = line_admin.id
                    line_admin.save()
                    admin_.money += money_to_card * Decimal('0.1')
                    all_.money += money_to_card
                    profile.money -= money_to_card
                    main_user.save()
                    all_.save()
                    profile.save()
                    admin_.save()
                    category_bronze.save()
            # третий случай (Если у пригласившего нет 2 и 3 линии, то 5% уходит админу)
            else:
                case_3_4_ref(main_user, money_to_card, all_, profile, admin_)
                save(category_bronze)

        users = Profile.objects.exclude(user__username='maria').exclude(user__username='Василий')

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
        user_1.d += 1
        user_2.d += 1
        user_2.save()
        user_2.user.save()
        user_1.user.save()
        user_1.save()
    else:
        user_1.user.money += Decimal(money / 2)
        user_2.user.money += Decimal(money / 2)
        user_1.d += 1
        user_2.d += 1
        user_1.user.save()
        user_2.user.save()
        user_1.save()
        user_2.save()


def logics_matrix(user_, money):
    profile = user_
    user_in_matrix = User_in_Matrix()
    user_in_matrix.user = Profile.objects.get(user=profile.user)
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


# class Card_test(TestCase):
#     @classmethod
#     def setUp(cls):
#         if not All.objects.all().exists():
#             a = All()
#             a.save()
#         c = User.objects.filter(username='admin')
#         c.delete()
#         t = Profile.objects.filter(admin_or=True)
#         t.delete()
#         if not Profile.objects.filter(admin_or=True).exists():
#             if not User.objects.filter(username='admin').exists():
#                 user = User()
#                 user.username = 'admin'
#                 user.password = 'admin'
#                 user.save()
#             else:
#                 user = User.objects.get(username='admin')
#             profile2 = Profile()
#             profile2.admin_or = True
#             profile2.user = user
#             profile2.save()
#         else:
#             a = User.objects.get(user__username='admin')
#             profile2 = Profile()
#             profile2.admin_or = True
#             profile2.user = a
#             profile2.save()
#         st = 'User_'
#         for el in range(1, 101):
#             User.objects.create(username=st + str(el), password='12345678')
#         for el in range(1, 101):
#             user = User.objects.get(username=st + str(el))
#             Profile.objects.create(user=user, money=100)
#
#     def test_bez_ref(self):
#         st = 'User_'
#         admin_ = Profile.objects.filter(admin_or=True).first()
#         a = []
#         for el in range(1, 3):
#             a.append(Profile.objects.get(user__username=st + str(el)))
#
#         # cookies_ = Profile.objects.get(user__username=st + str(4)).referral_link
#         cookies_ = None
#         referral_system_silver(a, 1, cookies_, admin_)
#         for el in a:
#             el.refresh_from_db()
#             print(el.user.username)
#             print(el.money)
#             self.assertEqual(el.money, 0)
#         print(admin_.user.username)
#         print(admin_.money)
#         self.assertEqual(admin_.money, 30)
#
#     def test_bez_ref1(self):
#         st = 'User_'
#         admin_ = Profile.objects.filter(admin_or=True).first()
#         a = []
#         for el in range(1, 3):
#             a.append(Profile.objects.get(user__username=st + str(el)))
#
#         # cookies_ = Profile.objects.get(user__username=st + str(4)).referral_link
#         cookies_ = None
#         referral_system_silver(a, 1, cookies_, admin_)
#         for el in a:
#             el.refresh_from_db()
#             print(el.user.username)
#             print(el.money)
#         print(admin_.user.username)
#         print(admin_.money)
#         self.assertEqual(admin_.money, 30)
def referral_system_bronze(a, id_, admin_, cookies=None):
    # Сбор данных
    for el in a:
        profile = el
        card = 'card_' + str(id_)
        all_ = All.objects.all().first()
        if cookies is None:
            cookies = None
        if Category_Bronze.objects.filter(user__id=profile.id).exists():
            category_bronze = Category_Bronze.objects.get(user__id=profile.id)
        else:
            category_bronze = Category_Bronze()
            category_bronze.user = profile
        # Проверка блокировки карты для пользователя
        if id_ == 6 and category_bronze.card_6_disable is False:
            continue
        else:
            money_to_card = what_card(card, category_bronze)
        money_to_card = Decimal(money_to_card)  # Стоимость карты
        # Второй случай (Если человек заходит без реф. ссылки, то 15% админу.)
        if cookies is None or cookies == '':
            admin_.money += money_to_card * Decimal('0.15')
            profile.money -= money_to_card
            all_.money += money_to_card
            save(all_, profile, admin_, category_bronze)
            # main_user = Profile.objects.get(referral_link=cookies)
            max_card_ = '0' + str(id_)
        else:
            main_user = Profile.objects.get(referral_link=cookies)
            max_card_ = '0' + str(id_)
            save(main_user)
            if profile.money < money_to_card:
                continue
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
                else:
                    line_admin = First_Line()
                    line_admin.main_user = admin_
                    profile.line_1 = line_admin.id
                    line_admin.save()
                    admin_.money += money_to_card * Decimal('0.1')
                    all_.money += money_to_card
                    profile.money -= money_to_card
                save(main_user, all_, profile, admin_, category_bronze)
            # третий случай (Если у пригласившего нет 2 и 3 линии, то 5% уходит админу)
            else:
                case_3_4_ref(main_user, money_to_card, all_, profile, admin_)
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
        # logics_matrix(profile, new_money)
        continue

    # проверка на рефку
    # else:
    # a = Admin.objects.all().first()
    # b =
    # if Category_Bronze.objects.filter(user.id=).exists()


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
            Profile.objects.create(user=user, money=100)

    def test_bronz(self):
        st = 'User_'
        admin_ = Profile.objects.filter(admin_or=True).first()
        a = []
        for el in range(1, 101):
            a.append(Profile.objects.get(user__username=st + str(el)))

        # cookies_ = Profile.objects.get(user__username=st + str(4)).referral_link
        cookies_ = None
        referral_system_bronze(a, 1, admin_)
        for el in a:
            print(el)
            print(el.money)
            el.refresh_from_db()
            self.assertEqual(el.money, 90)
            buy_card = Buy_Card.objects.filter(user=el).exists()
            self.assertEqual(buy_card, True)

        for el in range(0, 4):
            print(a[el])
            print(a[el].money)
            # self.assertEqual(a[el].money, 90)
        print(admin_.user.username)
        print(admin_.money)
        al = 10 * 0.15 * 100
        self.assertEqual(admin_.money, 200)
