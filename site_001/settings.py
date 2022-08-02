import smtplib
from pathlib import Path
import os
import dotenv
import environ

env = environ.Env(
    # set casting, default value
    DEBUG=(bool, False)
)
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
# BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))
# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

SECRET_KEY = env('SECRET_KEY')
DEBUG = True
ALLOWED_HOSTS = ["*", ]  # since Telegram uses a lot of IPs for webhooks
# ALLOWED_HOSTS = []
CORS_ORIGIN_ALLOW_ALL = True
# Application definition
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ]
}
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'backend',
    'captcha',
    'tgbot',
    'frontend.frontend',
    'corsheaders',
    'crispy_forms',
    'sendgrid_backend'
]
CRISPY_TEMPLATE_PACK = 'uni_form'
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

]
# INTERNAL_IPS = [
#     # ...
#     'http://45.85.117.38/',
#     # ...
# ]

CORS_ALLOW_CREDENTIALS = True
REACT_ROUTES = [
    'login',
    'home',
    'rules',
    'signup',
    'home/game',
    'home/referals',
    'home/statistics',
    'home/deposit',
    'home/pay',
    'signup/<str:id>',
]

ROOT_URLCONF = 'site_001.urls'
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates/build']
        ,
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'site_001.wsgi.application'

# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

DATABASES = {
    'default': {

        'ENGINE': 'django.db.backends.postgresql_psycopg2',

        'NAME': 'project_site',

        'USER': 'postgres',

        'PASSWORD': '123',

        'HOST': 'localhost',

        'PORT': '5432',
    }
}

# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

# LANGUAGE_CODE = 'ru-ru'
LANGUAGE_CODE = 'ru'  # язык сайта по умолчанию

LANGUAGES = (
    ('ru', 'Russian'),
    ('en', 'English'),
    ('de', 'Germany'),
    ('es', 'Spain'),
    ('br', 'Brazil'),
    ('ar', 'Argentina'),
    ('pr', 'Puerto Rico'),
    ('fr', 'France'),
    ('it', 'Italy'),
)

USE_I18N = True  # активация системы перевода django

# месторасположение файлов перевода
LOCALE_PATHS = (
    'locale',
    # os.path.join(PROJECT_DIR, 'locale'),
)
TIME_ZONE = 'UTC'

USE_TZ = True
USE_L10N = True
# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

STATIC_URL = 'static/'
STATICFILES_DIRS = [
    BASE_DIR / 'templates/build/static'
]
# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
CORS_ALLOW_ALL_ORIGINS = True
# SMTP Hostname

#EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend' #Для проверки писем
# EMAIL_BACKEND = 'django.core.mail.backends.filebased.EmailBackend' # сохранять
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# EMAIL_BACKEND = "sendgrid_backend.SendgridBackend"
DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL')

EMAIL_HOST = 'smtp.sendgrid.net'
EMAIL_PORT = 587
SENDGRID_SANDBOX_MODE_IN_DEBUG = False
SENDGRID_ECHO_TO_STDOUT = False
SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY')

EMAIL_HOST_USER = 'apikey'
EMAIL_HOST_PASSWORD = os.getenv('SENDGRID_API_KEY')
EMAIL_USE_TLS = True

TELEGRAM_TOKEN = env('TELEGRAM_TOKEN')
CSRF_TRUSTED_ORIGINS = ['http://45.85.117.38/']
