"""
WSGI config for site_001 project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'site_001.settings')

application = get_wsgi_application()
# import sys, os
#
# app_name = 'site_001'
# env_name = 'new_site'
#
# cwd = os.getcwd()
# sys.path.append(cwd)
# sys.path.append(cwd + '/' + app_name)
#
# INTERP = cwd + '/' + env_name + '/bin/python'
# if sys.executable != INTERP: os.execl(INTERP, INTERP, *sys.argv)
#
# sys.path.insert(0, cwd + '/' + env_name + '/bin')
# sys.path.insert(0, cwd + '/' + env_name + '/lib/python2.7/site-packages/django')
# sys.path.insert(0, cwd + '/' + env_name + '/lib/python2.7/site-packages')
#
# os.environ.setdefault("DJANGO_SETTINGS_MODULE", app_name + ".settings")
#
# from django.core.wsgi import get_wsgi_application
#
# application = get_wsgi_application()
