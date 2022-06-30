import uuid

from django.contrib.auth.models import User
from django.db import models


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    money = models.DecimalField('Деньги')
    referral_link = models.CharField(max_length=100, blank=True, unique=True, default=uuid.uuid4)

    def __str__(self):
        return 'Profile for user {}'.format(self.user.username)


# Вывод
class History_Output(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quantity = models.DecimalField('Кол-во')
    card = models.CharField('Номер счета', max_length=150)
    data = models.DateTimeField('Время')

# Ввод
class History_Input(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quantity = models.DecimalField('Кол-во')
    card = models.CharField('Номер счета', max_length=150)


class First_Line(models.Model):
    main_user = models.ForeignKey(User, on_delete=models.CASCADE)
    invited_user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)


class Second_Line(models.Model):
    main_user = models.ForeignKey(User, on_delete=models.CASCADE)
    invited_user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)


class Third_Line(models.Model):
    main_user = models.OneToOneField(User, on_delete=models.CASCADE)
    invited_user = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True)
