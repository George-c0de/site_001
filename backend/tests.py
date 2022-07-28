from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone

from backend.models import User_in_Matrix, Matrix, Profile, All, First_Line, Second_Line, Third_Line, \
    Category_Bronze, Buy_Card, Card, Category_Silver, Category_Gold, Category_Emerald, History_card
from decimal import *

from backend.views import send_message_tgbot
from tgbot import message_for_bot


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
    hist = History_card()
    hist.buy = False
    hist2 = History_card()
    hist2.buy = False
    user_1 = User_in_Matrix.objects.filter(matrix__price=main_matrix.price).get(participant_number=main_matrix.go_money)
    user_2 = User_in_Matrix.objects.filter(matrix__price=main_matrix.price).get(
        participant_number=(main_matrix.go_money + 1))
    if user_1.user.id == user_2.user.id:
        user_1.user.money += Decimal(money / 2) * 2
        hist.price = Decimal(money / 2)
        hist2.price = Decimal(money / 2)
        hist.user = user_1.user
        hist2.user = user_1.user
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
        hist.price = Decimal(money / 2)
        hist2.price = Decimal(money / 2)
        hist.user = user_1.user
        hist2.user = user_2.user
        user_1.d += 1
        user_2.d += 1
        user_2.total_wins += money / 2
        user_1.total_wins += money / 2
        user_1.user.save()
        user_2.user.save()
        user_1.save()
        user_2.save()
    hist.save()
    hist2.save()


def case_3_4_ref(main_user, money_to_card, all_, profile, admin_, price):
    second_line = False
    third_line = False
    if Second_Line.objects.filter(id=profile.line_2).exists():
        second_line = True
    if Third_Line.objects.filter(id=profile.line_3).exists():
        third_line = True
    if not second_line and not third_line:
        admin_.money += money_to_card * Decimal('0.05')
        main_user.money += money_to_card * Decimal('0.1')
        all_.money += money_to_card
        profile.money -= money_to_card
        if User_in_Matrix.objects.filter(user=main_user).filter(matrix__price=price).exists():
            sec = User_in_Matrix.objects.filter(matrix__price=price).get(user=main_user)
            sec.all_wins += money_to_card * Decimal('0.1')
            sec.save()
    # четвертый случай
    elif not third_line:
        admin_.money += money_to_card * Decimal('0.01')
        profile.money -= money_to_card
        main_user.money += money_to_card * Decimal('0.1')
        second = Second_Line.objects.get(id=profile.line_2).main_user
        second.money += money_to_card * Decimal('0.04')
        if User_in_Matrix.objects.filter(user=second).filter(matrix__price=price).exists():
            sec = User_in_Matrix.objects.filter(matrix__price=price).get(user=second)
            sec.all_wins += money_to_card * Decimal('0.04')
            sec.save()
        second.save()
        all_.money += money_to_card
    else:
        profile.money -= money_to_card
        main_user.money += money_to_card * Decimal('0.1')
        second = Second_Line.objects.get(id=profile.line_2).main_user
        second.money += money_to_card * Decimal('0.04')
        second.save()
        if User_in_Matrix.objects.filter(matrix__price=price).filter(user=second).exists():
            sec = User_in_Matrix.objects.filter(matrix__price=price).get(user=second)
            sec.all_wins += money_to_card * Decimal('0.04')
            sec.save()
        th = Third_Line.objects.get(id=profile.line_3).main_user
        th.money += money_to_card * Decimal('0.01')
        if User_in_Matrix.objects.filter(matrix__price=price).filter(user=th).exists():
            sec = User_in_Matrix.objects.filter(matrix__price=price).get(user=th)
            sec.all_wins += money_to_card * Decimal('0.01')
            sec.save()
        th.save()
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
                    new_matrix.price = price
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
            if First_Line.objects.filter(main_user__id=admin_.id).exists():
                line_admin = First_Line.objects.get(main_user__id=admin_.id)
                profile.line_1 = line_admin.id
                line_admin.save()
                admin_.money += money_to_card * Decimal('0.1')
                print(money_to_card * Decimal('0.1'))
                all_.money += money_to_card
                profile.money -= money_to_card
            else:
                line_admin = First_Line()
                line_admin.main_user = admin_
                profile.line_1 = line_admin.id
                line_admin.save()
                admin_.money += money_to_card * Decimal('0.1')
                print(money_to_card * Decimal('0.1'))
                all_.money += money_to_card
                profile.money -= money_to_card
            save(main_user, all_, profile, admin_, category_bronze)
        # третий случай (Если у пригласившего нет 2 и 3 линии, то 5% уходит админу)
        else:
            case_3_4_ref(main_user, money_to_card, all_, profile, admin_, money_to_card)
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
    print(money_to_card * Decimal('0.05'))
    logics_matrix(profile, new_money, buy_card)
    return 1


def referral_system_silver(el, id_, admin_):
    # Сбор данных
    profile = Profile.objects.get(user=el.user)
    card = 'card_' + str(id_)
    all_ = All.objects.all().first()
    if profile.line_1 is not None:
        main_user = First_Line.objects.get(id=profile.line_1).main_user
    else:
        main_user = None
    if Category_Silver.objects.filter(user__id=profile.id).exists():
        category_silver = Category_Silver.objects.get(user__id=profile.id)
    else:
        category_silver = Category_Silver()
        category_silver.user = profile
    # Проверка блокировки карты для пользователя
    if id_ == 6 and category_silver.card_6_disable is False:
        print("error")
        return 0
    else:
        money_to_card = what_card(card, category_silver)
    money_to_card = Decimal(money_to_card)  # Стоимость карты
    if profile.money < money_to_card:
        print("error, money")
        return 0
    # Второй случай (Если человек заходит без реф. ссылки, то 15% админу.)
    if main_user is None:
        admin_.money += money_to_card * Decimal('0.15')
        profile.money -= money_to_card
        all_.money += money_to_card
        save(all_, profile, admin_, category_silver)
        # main_user = Profile.objects.get(referral_link=cookies)
    else:
        main_user = main_user
        max_card_ = '0' + str(id_)
        save(main_user)
        # Если у пригласившего не открыта карта номиналом,
        # которую купил рефер, то рефералка уходит админу
        if Buy_Card.objects.filter(user=main_user).filter(card__category='bronze').filter(card__name=id_).exists():
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
            save(main_user, all_, profile, admin_, category_silver)
        # третий случай (Если у пригласившего нет 2 и 3 линии, то 5% уходит админу)
        else:
            case_3_4_ref(main_user, money_to_card, all_, profile, admin_, money_to_card)
            save(category_silver)
    buy_card = Buy_Card()
    buy_card.user = profile
    card_ = Card()
    card_.price = money_to_card
    card_.category = 'silver'
    card_.name = id_
    card_.save()
    profile.max_card = id_ + 10
    profile.save()
    buy_card.card = card_
    buy_card.save()
    new_money = money_to_card * Decimal('0.8')
    admin_.money += money_to_card * Decimal('0.05')
    logics_matrix(profile, new_money, buy_card)
    return 1


def referral_system_gold(el, id_, admin_):
    # Сбор данных
    profile = Profile.objects.get(user=el.user)
    card = 'card_' + str(id_)
    all_ = All.objects.all().first()
    if profile.line_1 is not None:
        main_user = First_Line.objects.get(id=profile.line_1).main_user
    else:
        main_user = None
    if Category_Gold.objects.filter(user__id=profile.id).exists():
        category_gold = Category_Gold.objects.get(user__id=profile.id)
    else:
        category_gold = Category_Gold()
        category_gold.user = profile
    # Проверка блокировки карты для пользователя
    if id_ == 6 and category_gold.card_6_disable is False:
        print('error')
        return 0
    else:
        money_to_card = what_card(card, category_gold)
    money_to_card = Decimal(money_to_card)  # Стоимость карты
    if profile.money < money_to_card:
        print('error, money')
        return 0
    # Второй случай (Если человек заходит без реф. ссылки, то 15% админу.)
    if main_user is None:
        admin_.money += money_to_card * Decimal('0.15')
        profile.money -= money_to_card
        all_.money += money_to_card
        save(all_, profile, admin_, category_gold)
        # main_user = Profile.objects.get(referral_link=cookies)
    else:
        main_user = main_user
        max_card_ = '0' + str(id_)
        save(main_user)
        # Если у пригласившего не открыта карта номиналом,
        # которую купил рефер, то рефералка уходит админу
        if Buy_Card.objects.filter(user=main_user).filter(card__category='bronze').filter(card__name=id_).exists():
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
            save(main_user, all_, profile, admin_, category_gold)
        # третий случай (Если у пригласившего нет 2 и 3 линии, то 5% уходит админу)
        else:
            case_3_4_ref(main_user, money_to_card, all_, profile, admin_, money_to_card)
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
    profile.max_card = id_ + 20
    profile.save()
    new_money = money_to_card * Decimal('0.8')
    admin_.money += money_to_card * Decimal('0.05')
    logics_matrix(profile, new_money, buy_card)
    return 1

    # проверка на рефку
    # else:
    # a = Admin.objects.all().first()
    # b =
    # if Category_Bronze.objects.filter(user.id=).exists()


def referral_system_emerald(request, id_, admin_):
    # Сбор данных
    profile = Profile.objects.get(user=request.user)
    card = 'card_' + str(id_)
    all_ = All.objects.all().first()
    if profile.line_1 is not None:
        main_user = First_Line.objects.get(id=profile.line_1).main_user
    else:
        main_user = None
    if Category_Emerald.objects.filter(user__id=profile.id).exists():
        category_emerald = Category_Emerald.objects.get(user__id=profile.id)
    else:
        category_emerald = Category_Emerald()
        category_emerald.user = profile
    # Проверка блокировки карты для пользователя
    if id_ == 6 and category_emerald.card_6_disable is False:
        print('error')
        return 0
    else:
        money_to_card = what_card(card, category_emerald)
    money_to_card = Decimal(money_to_card)  # Стоимость карты
    if profile.money < money_to_card:
        print('error, money')
        return 0
    # Второй случай (Если человек заходит без реф. ссылки, то 15% админу.)
    if main_user is None:
        admin_.money += money_to_card * Decimal('0.15')
        profile.money -= money_to_card
        all_.money += money_to_card
        save(all_, profile, admin_, category_emerald)
        # main_user = Profile.objects.get(referral_link=cookies)
    else:
        main_user = main_user
        max_card_ = '0' + str(id_)
        save(main_user)
        # Если у пригласившего не открыта карта номиналом,
        # которую купил рефер, то рефералка уходит админу
        if Buy_Card.objects.filter(user=main_user).filter(card__category='bronze').filter(card__name=id_).exists():
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
            save(main_user, all_, profile, admin_, category_emerald)
        # третий случай (Если у пригласившего нет 2 и 3 линии, то 5% уходит админу)
        else:
            case_3_4_ref(main_user, money_to_card, all_, profile, admin_, money_to_card)
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
    profile.max_card = id_ + 30
    profile.save()
    new_money = money_to_card * Decimal('0.8')
    admin_.money += money_to_card * Decimal('0.05')
    logics_matrix(profile, new_money, buy_card)
    return 1

    # проверка на рефку
    # else:
    # a = Admin.objects.all().first()
    # b =
    # if Category_Bronze.objects.filter(user.id=).exists()


def get_user_in_card(el):
    if Profile.objects.filter(user_id=el.user.id).exists():
        all_user_in_matrix = User_in_Matrix.objects.all()
        profile_2 = Profile.objects.get(user_id=el.user.id)
        if User_in_Matrix.objects.filter(user_id=profile_2.id).exists():
            profile = User_in_Matrix.objects.filter(user_id=profile_2.id)
            bronze = [[], [], [], [], [], []]
            silver = [[], [], [], [], [], []]
            gold = [[], [], [], [], [], []]
            emerald = [[], [], [], [], [], []]
            for el in profile:
                card_ = el.card
                if card_.card.category == 'bronze':
                    go_percent = all_user_in_matrix.filter(card__card__category='bronze').filter(
                        card__card__name=card_.card.name).filter(matrix=el.matrix)
                    all_d = 0
                    for el_in_d in go_percent:
                        all_d += el_in_d.d
                    all = go_percent.count() * 4
                    if all != 0:
                        now_percent = (all_d / all) * 100
                    else:
                        now_percent = 0
                    if len(bronze[int(card_.card.name) - 1]) == 0:
                        bronze[int(card_.card.name) - 1].append(el.d)
                        bronze[int(card_.card.name) - 1].append(el.total_wins)
                        bronze[int(card_.card.name) - 1].append(el.all_wins)
                    else:
                        temp = (bronze[int(card_.card.name) - 1][0] + el.d)
                        temp = Decimal(temp / 2)
                        bronze[int(card_.card.name) - 1][0] = temp
                        bronze[int(card_.card.name) - 1][1] += el.total_wins
                        bronze[int(card_.card.name) - 1][2] += el.all_wins
                    bronze[int(card_.card.name) - 1][0] = now_percent
                elif card_.card.category == 'silver':
                    go_percent = all_user_in_matrix.filter(card__card__category='silver').filter(
                        card__card__name=card_.card.name).filter(matrix=el.matrix)
                    all_d = 0
                    for el_in_d in go_percent:
                        all_d += el_in_d.d
                    all = go_percent.count() * 4
                    if all != 0:
                        now_percent = (all_d / all) * 100
                    else:
                        now_percent = 0
                    if len(silver[int(card_.card.name) - 1]) == 0:
                        silver[int(card_.card.name) - 1].append(el.d)
                        silver[int(card_.card.name) - 1].append(el.total_wins)
                        silver[int(card_.card.name) - 1].append(el.all_wins)
                    else:
                        temp = (silver[int(card_.card.name) - 1][0] + el.d)
                        temp = Decimal(temp / 2)
                        silver[int(card_.card.name) - 1][0] = temp
                        silver[int(card_.card.name) - 1][1] += el.total_wins
                        silver[int(card_.card.name) - 1][2] += el.all_wins
                    silver[int(card_.card.name) - 1][0] = now_percent
                elif card_.card.category == 'gold':
                    go_percent = all_user_in_matrix.filter(card__card__category='gold').filter(
                        card__card__name=card_.card.name).filter(matrix=el.matrix)
                    all_d = 0
                    for el_in_d in go_percent:
                        all_d += el_in_d.d
                    all = go_percent.count() * 4
                    if all != 0:
                        now_percent = (all_d / all) * 100
                    else:
                        now_percent = 0
                    if len(gold[int(card_.card.name) - 1]) == 0:
                        gold[int(card_.card.name) - 1].append(el.d)
                        gold[int(card_.card.name) - 1].append(el.total_wins)
                        gold[int(card_.card.name) - 1].append(el.all_wins)
                    else:
                        temp = (gold[int(card_.card.name) - 1][0] + el.d)
                        temp = Decimal(temp / 2)
                        gold[int(card_.card.name) - 1][0] = temp
                        gold[int(card_.card.name) - 1][1] += el.total_wins
                        gold[int(card_.card.name) - 1][2] += el.all_wins
                    gold[int(card_.card.name) - 1][0] = now_percent
                else:
                    go_percent = all_user_in_matrix.filter(card__card__category='emerald').filter(
                        card__card__name=card_.card.name).filter(matrix=el.matrix)
                    all_d = 0
                    for el_in_d in go_percent:
                        all_d += el_in_d.d
                    all = go_percent.count() * 4
                    if all != 0:
                        now_percent = (all_d / all) * 100
                    else:
                        now_percent = 0
                    if len(emerald[int(card_.card.name) - 1]) == 0:
                        emerald[int(card_.card.name) - 1].append(el.d)
                        emerald[int(card_.card.name) - 1].append(el.total_wins)
                        emerald[int(card_.card.name) - 1].append(el.all_wins)
                    else:
                        temp = (emerald[int(card_.card.name) - 1][0] + el.d)
                        temp = Decimal(temp / 2)
                        emerald[int(card_.card.name) - 1][0] = temp
                        emerald[int(card_.card.name) - 1][1] += el.total_wins
                        emerald[int(card_.card.name) - 1][2] += el.all_wins
                    emerald[int(card_.card.name) - 1][0] = now_percent
            for el in bronze:
                if len(el) != 0:
                    print('r')
                else:
                    el.append(0)
                    el.append(0)
                    el.append(0)
            i = 0
            for el in emerald:
                if len(el) != 0:
                    print('r')
                else:
                    el.append(0)
                    el.append(0)
                    el.append(0)
                i += 1
            i = 0
            for el in silver:
                if len(el) != 0:
                    print('r')
                else:
                    el.append(0)
                    el.append(0)
                    el.append(0)
                i += 1
            i = 0
            for el in gold:
                if len(el) != 0:
                    print('r')
                else:
                    el.append(0)
                    el.append(0)
                    el.append(0)
                i += 1
            data = {'bronze': bronze, 'silver': silver, 'gold': gold, 'emerald': emerald}
            return data
    return 0


def get_user_in_matrix(el):
    if Profile.objects.filter(user_id=el.user.id).exists():
        profile = Profile.objects.get(user_id=el.user.id)
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
            return data
        else:
            data = {
                'bronze': [],
                'silver': [],
                'gold': [],
                'emerald': []
            }
            return data
    else:
        return 0


def get_hist_card(el):
    if History_card.objects.filter(user=el).exists():
        buy = History_card.objects.order_by('date')
        if buy.count() >= 3:
            time = buy[0].date
            str_time_1 = str(time.hour) + '-' + str(time.minute) + '-B ' + str(time.day) + '.' + str(
                time.month) + '.' + str(time.year)
            time = buy[1].date
            str_time_2 = str(time.hour) + '-' + str(time.minute) + '-B ' + str(time.day) + '.' + str(
                time.month) + '.' + str(time.year)
            time = buy[2].date
            str_time_3 = str(time.hour) + '-' + str(time.minute) + '-B ' + str(time.day) + '.' + str(
                time.month) + '.' + str(time.year)
            data = {
                'oneq': [buy[0].id, str_time_1, buy[0].price],
                'two': [buy[1].id, str_time_2, buy[1].price],
                'the': [buy[2].id, str_time_3, buy[2].price]
            }
        elif buy.count() >= 2:
            time = buy[0].date
            str_time_1 = str(time.hour) + '-' + str(time.minute) + '-B ' + str(time.day) + '.' + str(
                time.month) + '.' + str(time.year)
            time = buy[1].date
            str_time_2 = str(time.hour) + '-' + str(time.minute) + '-B ' + str(time.day) + '.' + str(
                time.month) + '.' + str(time.year)
            data = {
                'oneq': [buy[0].id, str_time_1, buy[0].price],
                'two': [buy[1].id, str_time_2, buy[1].price],
                'the': [0, 0, 0]
            }
        elif buy.count() >= 1:
            time = buy[0].date
            str_time_1 = str(time.hour) + '-' + str(time.minute) + '-B ' + str(time.day) + '.' + str(
                time.month) + '.' + str(time.year)
            data = {
                'oneq': [buy[0].id, str_time_1, buy[0].price],
                'two': [0, 0, 0],
                'the': [0, 0, 0]
            }
        else:
            data = {
                'oneq': [0, 0, 0],
                'two': [0, 0, 0],
                'the': [0, 0, 0]
            }
        return data
    else:
        data = {
            'oneq': [0, 0, 0],
            'two': [0, 0, 0],
            'the': [0, 0, 0]
        }
        return data


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
        for el in range(1, 9):
            User.objects.create(username=st + str(el), password='12345678')
        line_one = None
        utm = None
        utm_temp = utm
        for el in range(1, 9):
            user = User.objects.get(username=st + str(el))
            profile = Profile.objects.create(user=user, money=10)
            utm_temp = profile.referral_link
            if el > 1:
                main_user = Profile.objects.get(referral_link=utm)
                line_two = None
                line_th = None
                if First_Line.objects.filter(main_user=main_user).exists():
                    line_one = First_Line.objects.get(main_user=main_user)
                else:
                    line_one = First_Line.objects.create(main_user=main_user)
                    line_one.save()
                if main_user.line_1 is not None:
                    main_user_2 = First_Line.objects.get(id=main_user.line_1).main_user
                    if Second_Line.objects.filter(main_user=main_user_2).exists():
                        line_two = Second_Line.objects.get(main_user=main_user_2)
                    else:
                        line_two = Second_Line.objects.create(main_user=main_user_2)
                    if main_user_2.line_1 is not None:
                        main_user_3 = First_Line.objects.get(id=main_user_2.line_1).main_user
                        if Third_Line.objects.filter(main_user=main_user_3).exists():
                            line_th = Third_Line.objects.get(main_user=main_user_3)
                        else:
                            line_th = Third_Line.objects.create(main_user=main_user_3)
                if line_one is not None:
                    profile.line_1 = line_one.id
                if line_two is not None:
                    line_two.save()
                    profile.line_2 = line_two.id
                if line_th is not None:
                    line_th.save()
                    profile.line_3 = line_th.id
            utm = utm_temp
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

    def test_bronz2(self):
        st = 'User_'
        utm = None
        admin_ = Profile.objects.filter(admin_or=True).first()
        a = []
        for el in range(1, 8):
            a.append(Profile.objects.get(user__username=st + str(el)))
        # cookies_ = Profile.objects.get(user__username=st + str(4)).referral_link
        cookies_ = utm
        i = 0
        for el in range(1, 7, 2):
            referral_system_bronze(a[el], 1, admin_)
        for el in range(0, 7):
            print(a[el].user.username)
            print(get_user_in_card(a[el]))
            # el1 = get_user_in_matrix(a[el])
            # print(el1)
            # print(get_hist_card(a[el]))
            # print(el1['bronze'])
            # for el2 in el1.get('bronze'):
            #     print(el2)
            # print(el1['silver'])
            # for el2 in el1.get('silver'):
            #     print(el2)
            # print(el1['gold'])
            # for el2 in el1['gold']:
            #     print(el2)
            # print(el1['emerald'])
            # for el2 in el1['emerald']:
            #     print(el2)
        for el in a:
            el.refresh_from_db()
        for el in range(0, 7):
            print(a[el].user.username)
            print(a[el].money)
        print(admin_.user.username)
        print(admin_.money)
        # self.assertEqual(a[el].money, 90)

        # self.assertEqual(a[el].money, 90)
