from django.test import TestCase
from django.contrib.auth.models import User
from backend.models import *
from decimal import *
from backend.views import what_card, save, case_3_4_ref, logics_matrix, register_page, all_ref_logic


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
        for el in range(1, 124):
            User.objects.create(username=st + str(el), password='12345678').save()
        for el in range(1, 124):
            user = User.objects.get(username=st + str(el))
            profile = Profile.objects.create(user=user, money=100)
            utm_temp = profile.referral_link
            profile.save()

    def test_ref_sys(self):
        for el in Profile.objects.all():
            el.refresh_from_db()
        admin_ = Profile.objects.get(admin_or=True)
        st = 'User_'
        i = 0
        for el in Profile.objects.filter(admin_or=False):
            i += 1
            t_print = 'сейчас у User_1:'
            print('Итерация ' + str(i))
            for el1 in User_in_Matrix.objects.filter(user=Profile.objects.get(user__username='User_1')):
                t_print = t_print + '\nВыплат получено' + str(el1.d)
                t_print = t_print + '\nНомер в матрице' + str(el1.participant_number)
            t_print += '\n'

            t_print = t_print + '\n' + 'стало У User_1:'
            g = False
            for el35 in range(0, 2):
                if all_ref_logic('bronze', 1, Profile.objects.get(user__username='User_1')) == 400:
                    for el1 in User_in_Matrix.objects.filter(user=Profile.objects.get(user__username='User_1')):
                        # print('Выплат ' + str(el1.d))
                        pass
                else:
                    g = True
                    for el1 in User_in_Matrix.objects.filter(user=Profile.objects.get(user__username='User_1')):
                        # print('Выплат ' + str(el1.d))
                        pass
                all_ref_logic('bronze', 1, el)
            for el1 in User_in_Matrix.objects.filter(user=Profile.objects.get(user__username='User_1')):
                t_print = t_print + '\nВыплат получено' + str(el1.d)
                t_print = t_print + '\nНомер в матрице' + str(el1.participant_number)
            if g:
                print(t_print)
        for el in Profile.objects.all():
            el.refresh_from_db()
        for el in Profile.objects.filter(admin_or=False):
            print(el.user.username)
            print(el.money)
