from django.test import TestCase
from django.contrib.auth.models import User

from backend.models import User_in_Matrix, Matrix, Profile
from decimal import *


def matrix_pay(main_matrix, money):
    # if main_matrix.go_money == 27 or main_matrix.go_money + 1 == 27:
    #     print(main_matrix.go_money)
    #     print(main_matrix.go_money + 1)
    # if User_in_Matrix.objects.filter(participant_number=main_matrix.go_money).exists():
    #     user_1 = User_in_Matrix.objects.get(participant_number=main_matrix.go_money)
    #     if User_in_Matrix.objects.filter(participant_number=(main_matrix.go_money + 1)).exists():
    #         user_2 = User_in_Matrix.objects.get(participant_number=(main_matrix.go_money + 1))
    #     else:
    #         user_1_2 = User_in_Matrix.objects.filter(matrix=main_matrix).order_by('participant_number')
    #         user_2 = user_1_2.first()
    # else:
    #     user_1_2 = User_in_Matrix.objects.filter(matrix=main_matrix).order_by('participant_number')
    #     user_1 = user_1_2[0]
    #     user_2 = user_1_2[1]
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
    # print(user_1.user.user.username)
    # print(user_1.user.money)
    # print(user_2.user.user.username)
    # print(user_2.user.money)
    # print(user_2.user.money)



def search(main_matrix, ):
    all_users = User_in_Matrix.objects.filter(matrix=main_matrix).order_by('-participant_number')
    if all_users[1].participant_number == main_matrix.go_money:
        main_matrix.go_money = all_users[-1]
    elif all_users[0].participant_number == main_matrix.go_money:
        main_matrix.go_money = all_users[-2]
    else:
        main_matrix.go_money += 2


def logics_matrix(a, money):
    for el in a:
        profile = el
        user_in_matrix = User_in_Matrix()
        user_in_matrix.user = profile
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


class Matrix_test(TestCase):
    @classmethod
    def setUp(cls):
        # user_1 = User.objects.create(username='User_1', password='12345678')
        # user_2 = User.objects.create(username='User_2', password='12345678')
        # user_3 = User.objects.create(username='User_3', password='12345678')
        # user_4 = User.objects.create(username='User_4', password='12345678')
        # user_5 = User.objects.create(username='User_5', password='12345678')
        #
        # user_6 = User.objects.create(username='User_6', password='12345678')
        # user_7 = User.objects.create(username='User_7', password='12345678')
        # user_8 = User.objects.create(username='User_8', password='12345678')
        # user_9 = User.objects.create(username='User_9', password='12345678')
        # user_10 = User.objects.create(username='User_10', password='12345678')
        #
        # user_11 = User.objects.create(username='User_11', password='12345678')
        # user_12 = User.objects.create(username='User_12', password='12345678')
        # user_13 = User.objects.create(username='User_13', password='12345678')
        # user_14 = User.objects.create(username='User_14', password='12345678')
        # user_15 = User.objects.create(username='User_15', password='12345678')
        st = 'User_'
        for el in range(1, 101):
            User.objects.create(username=st + str(el), password='12345678')
        for el in range(1, 101):
            user = User.objects.get(username=st + str(el))
            Profile.objects.create(user=user)
        # Profile.objects.create(user=user_1)
        # Profile.objects.create(user=user_2)
        # Profile.objects.create(user=user_3)
        # Profile.objects.create(user=user_4)
        # Profile.objects.create(user=user_5)
        #
        # Profile.objects.create(user=user_6)
        # Profile.objects.create(user=user_7)
        # Profile.objects.create(user=user_8)
        # Profile.objects.create(user=user_9)
        # Profile.objects.create(user=user_10)

        # Profile.objects.create(user=user_11)
        # Profile.objects.create(user=user_12)
        # Profile.objects.create(user=user_13)
        # Profile.objects.create(user=user_14)
        # Profile.objects.create(user=user_15)

    def test_5_user(self):
        user_1 = Profile.objects.get(user__username='User_1')
        user_2 = Profile.objects.get(user__username='User_2')
        user_3 = Profile.objects.get(user__username='User_3')
        user_4 = Profile.objects.get(user__username='User_4')
        user_5 = Profile.objects.get(user__username='User_5')
        a = [user_1, user_2, user_3, user_4, user_5]
        money = 80
        logics_matrix(a, money)
        for el in a:
            el.refresh_from_db()
        self.assertEqual(user_1.money, 40)
        self.assertEqual(user_2.money, 40)
        self.assertEqual(Matrix.objects.count(), 2)
        self.assertEqual(Matrix.objects.filter(up=True).count(), 1)
        self.assertEqual(Matrix.objects.filter(up=False).count(), 1)
        self.assertEqual(User_in_Matrix.objects.count(), 5)
        self.assertEqual(User_in_Matrix.objects.filter(matrix=Matrix.objects.get(up=True)).count(), 4)
        self.assertEqual(User_in_Matrix.objects.filter(matrix=Matrix.objects.get(up=False)).count(), 1)
        self.assertEqual(User_in_Matrix.objects.get(user=user_1).d, 1)
        self.assertEqual(User_in_Matrix.objects.get(user=user_2).d, 1)
        self.assertEqual(User_in_Matrix.objects.get(user=user_1).participant_number, 0)
        self.assertEqual(User_in_Matrix.objects.get(user=user_2).participant_number, 1)
        self.assertEqual(User_in_Matrix.objects.get(user=user_3).participant_number, 2)
        self.assertEqual(User_in_Matrix.objects.get(user=user_4).participant_number, 3)
        self.assertEqual(User_in_Matrix.objects.get(user=user_5).participant_number, 4)

    def test_3_user(self):
        user_1 = Profile.objects.get(user__username='User_1')
        user_2 = Profile.objects.get(user__username='User_2')
        user_3 = Profile.objects.get(user__username='User_3')
        a = [user_1, user_2, user_3]
        money = 80
        logics_matrix(a, money)
        for el in a:
            el.refresh_from_db()
        self.assertEqual(Matrix.objects.all().count(), 1)
        self.assertEqual(Matrix.objects.filter(up=True).count(), 1)
        self.assertEqual(user_1.money, 0)
        self.assertEqual(user_2.money, 0)
        self.assertEqual(user_3.money, 0)
        for el in User_in_Matrix.objects.all():
            self.assertEqual(el.d, 0)
            self.assertEqual(el.user.money, 0)

    def test_13_user(self):
        user_1 = Profile.objects.get(user__username='User_1')
        user_2 = Profile.objects.get(user__username='User_2')
        user_3 = Profile.objects.get(user__username='User_3')
        user_4 = Profile.objects.get(user__username='User_4')
        user_5 = Profile.objects.get(user__username='User_5')
        user_6 = Profile.objects.get(user__username='User_6')
        user_7 = Profile.objects.get(user__username='User_7')
        user_8 = Profile.objects.get(user__username='User_8')
        user_9 = Profile.objects.get(user__username='User_9')
        user_10 = Profile.objects.get(user__username='User_10')
        user_11 = Profile.objects.get(user__username='User_11')
        user_12 = Profile.objects.get(user__username='User_12')
        user_13 = Profile.objects.get(user__username='User_13')
        user_14 = Profile.objects.get(user__username='User_14')
        user_15 = Profile.objects.get(user__username='User_15')
        a = [user_1, user_2, user_3, user_4, user_5, user_6,
             user_7, user_8, user_9, user_10, user_11, user_12,
             user_13, user_14, user_15]
        money = 80
        logics_matrix(a, money)
        for el in a:
            el.refresh_from_db()
            print(el.user.username)
            print(el.money)

        for el in range(0, 4):
            # self.assertEqual(User_in_Matrix.objects.get(user=a[el]).d, 4)
            self.assertEqual(a[el].money, 160)
        for el in range(4, 10):
            self.assertEqual(User_in_Matrix.objects.get(user=a[el]).d, 1)
            self.assertEqual(a[el].money, 40)
        self.assertEqual(Matrix.objects.all().count(), 2)
        self.assertEqual(Matrix.objects.filter(up=True).count(), 1)
        self.assertEqual(Matrix.objects.filter(up=False).count(), 1)

        self.assertEqual(Matrix.objects.get(up=True).max_users, 8)
        self.assertEqual(Matrix.objects.get(up=False).max_users, 16)

        self.assertEqual(User_in_Matrix.objects.filter(matrix=Matrix.objects.get(up=False)).count(), 3)
        self.assertEqual(User_in_Matrix.objects.filter(matrix=Matrix.objects.get(up=True)).count(), 8)

    def test_100_ser(self):
        st = 'User_'
        money = 80
        a = []
        for el in range(1, 101):
            a.append(Profile.objects.get(user__username=st + str(el)))
        logics_matrix(a, money)
        for el in a:
            el.refresh_from_db()
        self.assertEqual(Matrix.objects.all().count(), 2)
        self.assertEqual(Matrix.objects.filter(up=True).count(), 1)
        self.assertEqual(Matrix.objects.filter(up=False).count(), 1)

        self.assertEqual(User_in_Matrix.objects.filter(matrix=Matrix.objects.get(up=True)).count(), 32)
        self.assertEqual(User_in_Matrix.objects.filter(matrix=Matrix.objects.get(up=False)).count(), 40)
        for el in range(0, 28):
            print('№' + str(el))
            self.assertEqual(User_in_Matrix.objects.filter(user=a[el]).exists(), False)
            self.assertEqual(a[el].money, 160)
            print(a[el].money)
            # self.assertEqual(a[el].money, 160)
        for el in range(28, 44):
            print('№' + str(el))
            print(a[el].money)
            self.assertEqual(a[el].money, 120)
        for el in range(44, 60):
            print('№' + str(el))
            print(a[el].money)
            self.assertEqual(a[el].money, 80)

    def test_user_2(self):
        money = 80
        a = []
        for el in range(1, 101):
            a.append(Profile.objects.get(user__username='User_1'))
        logics_matrix(a, money)
        for el in a:
            el.refresh_from_db()
        el = Profile.objects.get(user__username='User_1')
        print(el.money)
        self.assertEqual(el.money, 7680)

    def test_user_2_and_1_rand(self):
        money = 80
        a = []
        a.append(Profile.objects.get(user__username='User_2'))
        for el in range(1, 101):
            a.append(Profile.objects.get(user__username='User_1'))
        logics_matrix(a, money)
        for el in a:
            el.refresh_from_db()
        print(Profile.objects.get(user__username='User_2').money)
        el = Profile.objects.get(user__username='User_1')
        print(el.money)
        self.assertEqual(el.money, 7600)
