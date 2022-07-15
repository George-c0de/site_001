# -*- coding: utf-8 -*-

from django.urls import path, include
from django.views.decorators.csrf import csrf_exempt

from . import views

urlpatterns = [
    # path('super_secter_webhook/', csrf_exempt(views.TelegramBotWebhookView.as_view())),
    # path('super_secter_webhook/', csrf_exempt(views.sent)),
]
