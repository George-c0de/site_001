from django.test import TestCase
from django.contrib.auth.models import User
from backend.models import User_in_Matrix, Matrix, Profile, All, First_Line, Second_Line, Third_Line, \
    Category_Bronze, Buy_Card, Card, Category_Silver, Category_Gold, Category_Emerald, History_card
from decimal import *
from backend.views import what_card, admin_, save, case_3_4_ref, logics_matrix, register_page, all_ref_logic


def referral_system_bronze(name, id_, profile):
    # Сбор данных
    all_ref_logic(name, id_, profile)
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
            profile = Profile.objects.create(user=user, money=100)
            utm_temp = profile.referral_link
            profile.save()

    def test_ref_sys(self):
        pass
        # st = 'User_'
        # for el in range(0, 100):
        #     print(Profile.objects.get(user__email=st + str(el) + st2).user.username)
        #     print(Profile.objects.get(user__email=st + str(el) + st2).line_1)
        #     print(Profile.objects.get(user__email=st + str(el) + st2).line_2)
        #     print(Profile.objects.get(user__email=st + str(el) + st2).line_3)
        #     referral_system_bronze(request, 1)
        # for el in Profile.objects.all():
        #     print(el.user.username)
        #     print(el.money)
        # for el in First_Line.objects.all():
        #     print(el.main_user)
        #     print(el.lost_profit)
        #     print(el.profit)
        #     print(el.total_person)
        # print(admin_.user.username)
        # print(admin_.money)

