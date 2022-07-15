from django.template.defaulttags import url
from django.urls import path
from django.conf.urls import include
from django.contrib import admin
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView

from tgbot import views
from tgbot.views import TutorialBotView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('backend.urls')),
    path('accounts/', include('django.contrib.auth.urls')),
    # path('', include('frontend.urls')),
    path('', TemplateView.as_view(template_name='index.html')),
    # path('super_secter_webhook/', csrf_exempt(views.TutorialBotView.as_view())),
    path('webhooks/tutorial/', csrf_exempt(TutorialBotView.as_view())),
]
