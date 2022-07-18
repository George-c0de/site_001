from django.template.defaulttags import url
from django.views.decorators.csrf import csrf_exempt
from backend import views
from django.urls import path, reverse_lazy, include
from django.contrib.auth import views as auth_views

from tgbot.views import TutorialBotView

urlpatterns = [
    # path('', views.index, name='home'),
    path('', views.getRoutes, name="routes"),
    path('login', views.login_page, name='login'),
    path('logout', views.logout_user, name='logout'),
    path('register', views.register_page, name='register'),
    path('captcha/', include('captcha.urls')),
    path('import_users', views.import_users, name='import_users'),
    path('password-reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('password-reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('password-reset/confirm/<uidb64>/<token>/',
         auth_views.PasswordResetCompleteView.as_view(), name='password_reset_confirm'),
    path('password-reset/complete/', auth_views.PasswordResetCompleteView.as_view(),
         name='password_reset_complete'),
    path('new_wallet/', views.generate_wallet),
    path('collect_usdt/', views.collect_usdt),
    path('send_trx/', views.send_trx),
    path('send_usdt/', views.send_usdt),
    path('delete/', views.delete),
    path('paymant/', views.main),
    path('bronze/<int:id_>', views.referral_system_bronze),
    path('silver/<int:id_>', views.referral_system_silver),
    path('gold/<int:id_>', views.referral_system_gold),
    path('emerald/<int:id_>', views.referral_system_emerald),
    path('matrix/<int:money>', views.logics_matrix),
    path('webhooks/tutorial/', csrf_exempt(TutorialBotView.as_view())),
    path('user', views.user_get),
    path('get_category', views.get_category),
    path('get_all', views.get_all),
    path('send_message_tgbot', views.send_message_tgbot),
    path('utm/<str:utm>', views.utm),
    path('referral', views.get_referrals),
    path('get_link_tg', views.get_link_tg),
    path('trans_get_output', views.trans_get_output),
    path('trans_get_input', views.trans_get_input),
    path('get_user_in_matrix', views.get_user_in_matrix),
    # Оплата
    path('dis', views.dis)

]
