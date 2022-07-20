import json
import telebot
from rest_framework.response import Response
import requests
from django.http import JsonResponse
from .models import *
from rest_framework.views import APIView

TELEGRAM_URL = "https://api.telegram.org/bot"
TUTORIAL_BOT_TOKEN = "5540149986:AAE0qQjVgvobPBOfVxSqOBueeGC2Vc9PWrs"


# https://api.telegram.org/bot<token>/setWebhook?url=<url>/webhooks/tutorial/
class TutorialBotView(APIView):
    def post(self, request, *args, **kwargs):
        t_data = json.loads(request.body)
        memcache_key = "vCH1vGWJxfSeofSAs0K5PA"
        # print(t_data)
        t_message = t_data["message"]
        t_chat = t_message["chat"]
        # if not Chat_id.objects.filter(user=request.user.id).exists():
        #     print(request.user.id)
        #     Chat_id.objects.create(user=request.user.id, id=int(t_chat["id"]))
        try:
            text = t_message["text"]
        except Exception as e:
            return JsonResponse({"ok": "POST request processed"})
        text = text.replace(text[0], "", 1)
        print(text)
        if text.startswith('start'):
            if text != 'start':
                print('yes')
                text = text.split()
                if text[1] is not None:
                    print('yes')
                    print(text[1])
                    if Memcache.objects.filter(memcache=text[1]).exists():
                        print('yes')
                        user = Memcache.objects.get(memcache=text[1]).user
                        if Profile.objects.filter(id=user).exists():
                            print('yes')
                            profile = Profile.objects.get(id=user)
                            if not User_Bot.objects.filter(profile=profile).exists():
                                User_Bot.objects.create(chat_id=t_chat["id"], profile=profile)
                            if Event.objects.filter(user_id=profile.id).exists():
                                event = Event.objects.get(user_id=profile.id)
                                self.send_message(event.message, t_chat['id'])
                                event.delete()
        else:
            if Chat_id.objects.filter(id=t_chat["id"]).exists():
                print('no')
                chat = Chat_id.objects.get(id=int(t_chat["id"]))
                # we want chat obj to be the same as fetched from collection
                t_chat['id'] = chat.id
                if User_Bot.objects.filter(chat_id=t_chat['id']).exists():
                    print('no')
                    user = User_Bot.objects.get(chat_id=t_chat['id']).profile.id
                    if Event.objects.filter(user_id=user).exists():
                        print('no')
                        msg = Event.objects.get(user_id=user).message
                        self.send_message(msg, t_chat['id'])
                        Event.objects.get(user_id=user).delete()
        return JsonResponse({"ok": "POST request processed"})

    def get(self, request, *args, **kwargs):
        print(2)
        t_data = json.loads(request.body)
        print(t_data)
        print(request)
        t_message = t_data["message"]
        t_chat = t_message["chat"]

        try:
            text = t_message["text"].strip().lower()
        except Exception as e:
            return JsonResponse({"ok": "POST request processed"})

        text = text.lstrip("/")
        if Chat_id.objects.filter(id=t_chat["id"]).exists():
            chat = Chat_id.objects.get(id=t_chat["id"])
        else:
            chat = Chat_id.objects.create(id=t_chat["id"], user=request.user)
            # we want chat obj to be the same as fetched from collection
            chat["id"] = chat.id
        if Message.objects.filter(Chat_id=t_chat['id']).exists():
            msg = Message.objects.get(Chat_id=t_chat['id'])
            self.send_message(msg, t_chat['id'])
            Message.objects.get(Chat_id=t_chat['id']).delete()
        else:
            msg = 'go home'
            self.send_message(msg, t_chat['id'])
        return JsonResponse({"ok": "POST request processed"})

    @staticmethod
    def send_message(message, chat_id):
        data = {
            "chat_id": chat_id,
            "text": message,
            "parse_mode": "Markdown",
        }
        response = requests.post(
            f"{TELEGRAM_URL}{TUTORIAL_BOT_TOKEN}/sendMessage", data=data
        )


def index():
    bot = telebot.TeleBot(TUTORIAL_BOT_TOKEN)

    @bot.message_handler(commands=['start'])
    def send_welcome(message):
        bot.send_message(message.chat.id, "Привет")

    bot.polling()


def send_msg(request):
    token = TUTORIAL_BOT_TOKEN
    chat_id = 829942305
    url_req = "https://api.telegram.org/bot" + token + "/sendMessage" + "?chat_id=" + str(chat_id) + "&text=" + "hello"
    results = requests.get(url_req)
    print(results.json())
    return Response('OK')


def sent(request):
    t_data = json.loads(request.body)
    t_message = t_data["message"]
    t_chat = t_message["chat"]

    try:
        text = t_message["text"].strip().lower()
    except Exception as e:
        return JsonResponse({"ok": "POST request processed"})

    text = text.lstrip("/")
    if Chat_id.objects.filter(id=t_chat["id"]).exists():
        chat = Chat_id.objects.get(id=t_chat["id"])
    else:
        chat = Chat_id.objects.create(id=t_chat["id"], user=request.user)
        # we want chat obj to be the same as fetched from collection
        chat["_id"] = chat.id
    if Message.objects.filter(Chat_id=t_chat['id']).exists():
        msg = Message.objects.get(Chat_id=t_chat['id'])
        data = {
            "chat_id": t_chat['id'],
            "text": msg,
            "parse_mode": "Markdown",
        }
        response = requests.post(
            f"{TELEGRAM_URL}{TUTORIAL_BOT_TOKEN}/sendMessage", data=data
        )
        Message.objects.get(Chat_id=t_chat['id']).delete()
        return response
    else:
        msg = 'go home'
        data = {
            "chat_id": t_chat['id'],
            "text": msg,
            "parse_mode": "Markdown",
        }
        response = requests.post(
            f"{TELEGRAM_URL}{TUTORIAL_BOT_TOKEN}/sendMessage", data=data
        )
        return response
