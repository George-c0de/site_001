from django.template.defaulttags import url
from django.urls import path, include
from backend import views
from django.urls import path, reverse_lazy, include
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', views.index, name='home'),
    path('login', views.login_page, name='login'),
    path('utm/<str:utm>', views.index_with_utm),
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
    path('matrix/<int:money>', views.logics_matrix)
]
