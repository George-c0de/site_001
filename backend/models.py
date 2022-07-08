import uuid

from django.contrib.auth.models import User
from django.db import models
from django.utils.translation import gettext_lazy as _


class All(models.Model):
    money = models.DecimalField('Деньги', max_digits=10, decimal_places=2, default=0)


class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    money = models.DecimalField('Деньги', max_digits=10, decimal_places=2)
    wallet = models.CharField('Кошелек', max_length=150, null=True, blank=True)

    class Meta:
        verbose_name_plural = _("Админ")


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    money = models.DecimalField('Деньги', max_digits=10, decimal_places=2, default=0)
    referral_link = models.CharField('Реферальная ссылка', max_length=100, blank=True, unique=True, default=uuid.uuid4)
    referral_amount = models.DecimalField('Сумма полученных средств по реферальной системе', max_digits=10,
                                          decimal_places=2, default=0)
    missed_amount = models.DecimalField('Упущенная сумма', max_digits=10, decimal_places=2, default=0)
    wallet = models.CharField('Кошелек', max_length=150, null=True, blank=True)
    line_1 = models.CharField('First_Line', null=True, blank=True, max_length=150)
    line_2 = models.CharField('Second_Line', null=True, blank=True, max_length=150)
    line_3 = models.CharField('Third_Line', null=True, blank=True, max_length=150)
    max_card = models.IntegerField('Максимальная купленная карта(Формат при bronze 6 карта: 06)',
                                   null=True, blank=True, default=0)
    admin_or = models.BooleanField('Админ или нет', default=False)

    class Meta:
        verbose_name_plural = _("Профили пользователей")

    def __str__(self):
        return '{}(id {})'.format(self.user.username, self.user.id)


class First_Line(models.Model):
    main_user = models.OneToOneField(Profile, on_delete=models.CASCADE)


class Second_Line(models.Model):
    main_user = models.OneToOneField(Profile, on_delete=models.CASCADE)


class Third_Line(models.Model):
    main_user = models.OneToOneField(Profile, on_delete=models.CASCADE)


class Card(models.Model):
    name = models.CharField('Название', max_length=50)
    price = models.DecimalField('Стоимость', max_digits=10, decimal_places=2)


class Category_Bronze(models.Model):
    card_1 = models.IntegerField(default=10)
    card_2 = models.IntegerField(default=15)
    card_3 = models.IntegerField(default=25)
    card_4 = models.IntegerField(default=40)
    card_5 = models.IntegerField(default=50)
    card_6 = models.IntegerField(default=77)
    card_6_disable = models.BooleanField('Доступ для 6 карты', default=False)
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)


class Category_Silver(models.Model):
    card_1 = models.IntegerField(default=100)
    card_2 = models.IntegerField(default=150)
    card_3 = models.IntegerField(default=250)
    card_4 = models.IntegerField(default=400)
    card_5 = models.IntegerField(default=500)
    card_6 = models.IntegerField(default=666)
    card_6_disable = models.BooleanField('Доступ для 6 карты', default=False)
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)


class Category_Gold(models.Model):
    card_1 = models.IntegerField(default=750)
    card_2 = models.IntegerField(default=1000)
    card_3 = models.IntegerField(default=1250)
    card_4 = models.IntegerField(default=1500)
    card_5 = models.IntegerField(default=2000)
    card_6 = models.IntegerField(default=2222)
    card_6_disable = models.BooleanField('Доступ для 6 карты', default=False)
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)


class Category_Emerald(models.Model):
    card_1 = models.IntegerField(default=2500)
    card_2 = models.IntegerField(default=5000)
    card_3 = models.IntegerField(default=7500)
    card_4 = models.IntegerField(default=10000)
    card_5 = models.IntegerField(default=15000)
    card_6 = models.IntegerField(default=22222)
    card_6_disable = models.BooleanField('Доступ для 6 карты', default=False)
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)


"""
# Вывод
class History_Output(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quantity = models.DecimalField('Кол-во', max_digits=10, decimal_places=2)
    card = models.CharField('Номер счета', max_length=150)
    data = models.DateTimeField('Время', auto_now_add=True)
    success = models.BooleanField('Успешность', default=False)
"""


# Ввод
class History_Transactions(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    quantity = models.DecimalField('Кол-во', max_digits=10, decimal_places=2)
    card = models.CharField('Номер счета', max_length=150)
    data = models.DateTimeField('Время', auto_now_add=True)
    success = models.BooleanField('Успешность', default=False)
    Choices = [('Output', 'Вывод'), ('Input', 'Ввод')]
    name_operation = models.CharField(max_length=50, choices=Choices)

    class Meta:
        verbose_name_plural = _("Транзакции")


class Buy_Card(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    card = models.ForeignKey(Card, on_delete=models.CASCADE)


class Matrix(models.Model):
    up = models.BooleanField('Верх, если да - true', default=False)
    max_users = models.IntegerField('Максимальное кол-во участников', default=4)
    go_money = models.IntegerField('Номер участника, который получает след выплату', default=0)
    col = models.IntegerField('Кол-во в матрице', default=0)


"""
class Payment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quantity = models.DecimalField('Кол-во', max_digits=10, decimal_places=2)
    data = models.DateTimeField('Время', auto_now_add=True)
    success = models.BooleanField('Успешность', default=False)
"""


class User_in_Matrix(models.Model):
    participant_number = models.IntegerField('Номер участника')
    matrix = models.ForeignKey(Matrix, on_delete=models.CASCADE)
    d = models.IntegerField('Кол-во зачислений', default=0)
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)


# Кошелек
class Wallet(models.Model):
    address = models.CharField('Адрес', max_length=150)
    pkey = models.CharField('pkey', max_length=150)


# база данных транзакций
class Transaction(models.Model):
    tx_id = models.CharField('tx_id', max_length=150)  # id транзакции в Tron
    timestamp = models.IntegerField('timestamp')  # время транзакции
    sender = models.CharField('sender', max_length=150)  # отправитель
    receiver = models.CharField('receiver', max_length=150)  # получатель
    currency = models.CharField('currency', max_length=150)  # валюта (TRX / USDT)
    amount = models.FloatField('amount')  # количество
    fee = models.IntegerField('fee')  # использованный газ
