from __future__ import annotations
from django.db import models
from django.contrib.auth.models import User
from backend.models import Profile

class User_Bot(models.Model):
    chat_id = models.PositiveBigIntegerField(default=0)  # telegram_id
    username = models.CharField('Имя', max_length=50, default=0)
    first_name = models.CharField(max_length=256, default=0)
    last_name = models.CharField(max_length=256, default=0)
    language_code = models.CharField(max_length=8, help_text="Telegram client's lang", default='ru')
    deep_link = models.CharField(max_length=64, default=0)
    is_blocked_bot = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE)

    def __str__(self):
        return f'@{self.username}' if self.username is not None else f'{self.chat_id}'


class Chat_id(models.Model):
    user = models.PositiveBigIntegerField('Id_user')


class Message(models.Model):
    User_Bot = models.CharField(max_length=250)
    Chat_id = models.CharField(max_length=150)


class Event(models.Model):
    message = models.CharField('Сообщение пользователю', max_length=200)
    user_id = models.CharField(max_length=150, default=0)


class Memcache(models.Model):
    user = models.CharField(max_length=150)
    memcache = models.CharField(max_length=150)


# tg
