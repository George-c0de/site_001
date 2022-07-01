import uuid

from django.contrib.auth.models import User
from django.db import models


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    money = models.DecimalField('Деньги')
    referral_link = models.CharField('Реферальная ссылка', max_length=100, blank=True, unique=True, default=uuid.uuid4)
    referral_amount = models.DecimalField('Сумма полученных средств по реферальной системе')
    missed_amount = models.DecimalField('Упущенная сумма')
    wallet = models.CharField('Кошелек', max_length=150)

    def __str__(self):
        return 'Profile for user {}'.format(self.user.username)


class Card(models.Model):
    name = models.CharField('Название', max_length=50)
    price = models.DecimalField('Стоимость')


class Category_Bronze(models.Model):
    card_1 = models.IntegerField(default=10)
    card_2 = models.IntegerField(default=15)
    card_3 = models.IntegerField(default=25)
    card_4 = models.IntegerField(default=40)
    card_5 = models.IntegerField(default=50)
    card_6 = models.IntegerField(default=77)
    card_6_disable = models.BooleanField('Доступ для 6 карты', default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class Category_Silver(models.Model):
    card_1 = models.IntegerField(default=100)
    card_2 = models.IntegerField(default=150)
    card_3 = models.IntegerField(default=250)
    card_4 = models.IntegerField(default=400)
    card_5 = models.IntegerField(default=500)
    card_6 = models.IntegerField(default=666)
    card_6_disable = models.BooleanField('Доступ для 6 карты', default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class Category_Gold(models.Model):
    card_1 = models.IntegerField(default=750)
    card_2 = models.IntegerField(default=1000)
    card_3 = models.IntegerField(default=1250)
    card_4 = models.IntegerField(default=1500)
    card_5 = models.IntegerField(default=2000)
    card_6 = models.IntegerField(default=2222)
    card_6_disable = models.BooleanField('Доступ для 6 карты', default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class Category_Emerald(models.Model):
    card_1 = models.IntegerField(default=2500)
    card_2 = models.IntegerField(default=5000)
    card_3 = models.IntegerField(default=7500)
    card_4 = models.IntegerField(default=10000)
    card_5 = models.IntegerField(default=15000)
    card_6 = models.IntegerField(default=22222)
    card_6_disable = models.BooleanField('Доступ для 6 карты', default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


# Вывод
class History_Output(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quantity = models.DecimalField('Кол-во')
    card = models.CharField('Номер счета', max_length=150)
    data = models.DateTimeField('Время', auto_now_add=True)
    success = models.BooleanField('Успешность', default=False)


class Buy_Card(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    card = models.ForeignKey(Card, on_delete=models.CASCADE)


class Payment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quantity = models.DecimalField('Кол-во')
    data = models.DateTimeField('Время', auto_now_add=True)
    success = models.BooleanField('Успешность', default=False)


# Ввод
class History_Input(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quantity = models.DecimalField('Кол-во')
    card = models.CharField('Номер счета', max_length=150)
    data = models.DateTimeField('Время', auto_now_add=True)
    success = models.BooleanField('Успешность', default=False)


class First_Line(models.Model):
    main_user = models.ForeignKey(User, on_delete=models.CASCADE)
    invited_user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)


class Second_Line(models.Model):
    main_user = models.ForeignKey(User, on_delete=models.CASCADE)
    invited_user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)


class Third_Line(models.Model):
    main_user = models.OneToOneField(User, on_delete=models.CASCADE)
    invited_user = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True)
