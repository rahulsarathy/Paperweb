"""pulp URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import include
from django.conf.urls import handler404
from django.contrib import admin
from django.urls import path
from pulp import views


urlpatterns = [
  path('admin/', admin.site.urls),
  path('', views.landing, name='landing'),
  path('dashboard/', views.dashboard, name='dashboard'),
  path('reading_list/', views.reading_list, name='reading list'),
  path('profile/', views.profile, name='profile'),
  path('feed/', views.feed, name='feed'),
  path('auth/', include('django.contrib.auth.urls')),
  path('api/users/', include('users.urls')),
  path('api/blogs/', include('blogs.urls')),
  path('api/payments/', include('payments.urls')),
  # Google Maps API Key
  path('api/gmaps', views.google_maps_key, name='google_maps_key'),
]

handler404 = views.error_404