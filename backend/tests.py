from django.test import TestCase
from django.contrib.auth.models import User

from backend.models import User_in_Matrix, Matrix, Profile, All, First_Line, Second_Line, Third_Line, \
    Category_Bronze, Buy_Card, Card, All_card
from decimal import *


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


def matrix_pay(main_matrix, money):

    user_1 = User_in_Matrix.objects.filter(matrix__price=main_matrix.price).get(participant_number=main_matrix.go_money)
    user_2 = User_in_Matrix.objects.filter(matrix__price=main_matrix.price).get(
        participant_number=(main_matrix.go_money + 1))
    if user_1.user.id == user_2.user.id:
        user_1.user.money += Decimal(money / 2) * 2
        user_1.d += 1
        user_2.d += 1
        user_2.total_wins += (money / 2) * 2
        user_2.save()
        user_2.user.save()
        user_1.user.save()
        user_1.save()
    else:
        user_1.user.money += Decimal(money / 2)
        user_2.user.money += Decimal(money / 2)
        user_1.d += 1
        user_2.d += 1
        user_2.total_wins += money / 2
        user_1.total_wins += money / 2
        user_1.user.save()
        user_2.user.save()
        user_1.save()
        user_2.save()
    print(user_1.user.user.username)
    print(user_1.user.money)
    print(user_2.user.user.username)
    print(user_2.user.money)


def case_3_4_ref(main_user, money_to_card, all_, profile, id_, name, admin_):
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


# Логика матрицы
def logics_matrix(user_, money, card_):
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
                    new_matrix.price=price
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
                down_matrix.price = price
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
        main_matrix.price = price
        main_matrix.save()
        user_in_matrix.save()


def referral_system_bronze(el, id_, admin_):
    # Сбор данных
    profile = Profile.objects.get(user=el.user)
    card = 'card_' + str(id_)
    all_ = All.objects.all().first()
    if profile.line_1 is not None:
        main_user = First_Line.objects.filter(main_user_id=profile.line_1)
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
        print('error')
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
            case_3_4_ref(main_user, money_to_card, all_, profile, id_, 'bronze', admin_)
            save(category_bronze)
    buy_card = Buy_Card()
    buy_card.user = profile
    all_cards = All_card.objects.all()
    i = 0
    for el in all_cards:
        if el.category == 'bronze' and int(el.name) == id_:
            i += 1
            el.profit += money_to_card
            el.save()
    if i == 0:
        prof_c = All_card()
        prof_c.name = id_
        prof_c.category = 'bronze'
        prof_c.profit = money_to_card
        prof_c.save()
    card_ = Card()
    card_.price = money_to_card
    card_.category = 'bronze'
    card_.name = id_
    card_.save()
    buy_card.card = card_
    buy_card.save()
    new_money = money_to_card * Decimal('0.8')
    admin_.money += money_to_card * Decimal('0.05')
    logics_matrix(profile, new_money, buy_card)
    return 1


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
        for el in range(1, 100):
            a.append(Profile.objects.get(user__username=st + str(el)))

        # cookies_ = Profile.objects.get(user__username=st + str(4)).referral_link
        cookies_ = None
        i = 0
        for el in a:
            i += 1
            referral_system_bronze(el, 1, admin_)
            if i == 10:
                print(1)
        for el in a:
            el.refresh_from_db()
        for el in range(0, 28):
            print(a[el].user.username)
            print(a[el].money)
            self.assertEqual(a[el].money, 90 + (4 * 4))
        for el in range(28, 61):
            self.assertEqual(a[el].money, 90 + (4 * 3))
        # self.assertEqual(a[el].money, 90)
        al = 10 * 0.15 * 100
