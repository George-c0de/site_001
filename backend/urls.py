from django.urls import path, include
from backend import views

urlpatterns = [
    path('', views.index, name='home'),
    path('login', views.login_page, name='login'),
    path('utm/<str:utm>', views.index_with_utm),
    path('logout', views.logout_user, name='logout'),
    path('register', views.register_page, name='register'),
    path('captcha/', include('captcha.urls')),
    path('import_users', views.import_users, name='import_users')
]
