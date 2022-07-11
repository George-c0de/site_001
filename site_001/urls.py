from django.template.defaulttags import url
from django.urls import path
from django.conf.urls import include
from django.contrib import admin
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('backend.urls')),
    path('accounts/', include('django.contrib.auth.urls')),
    # path('', include('frontend.urls')),
    path('', TemplateView.as_view(template_name='index.html')),
]
