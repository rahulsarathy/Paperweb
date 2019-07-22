from django.contrib import admin
from django.urls import include, path
from siteconfig import views


urlpatterns = [
  path('admin/', admin.site.urls),
  path('', views.index, name='index'),
  path('auth/', include('django.contrib.auth.urls')),
]
