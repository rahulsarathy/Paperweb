from django.contrib import admin
from django.urls import include, path
from siteconfig import views


urlpatterns = [
  path('admin/', admin.site.urls),
  path('', views.index, name='index'),
  path('dashboard/', views.dashboard, name='dashboard'),
  path('auth/', include('django.contrib.auth.urls')),
  path('api/users/', include('users.urls')),
  path('api/blogs/', include('blogs.urls')),
]
