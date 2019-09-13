from django.contrib import admin
from django.urls import include, path
from siteconfig import views


urlpatterns = [
  # Admin URLs
  path('admin/', admin.site.urls),

  # Landing Page
  path('', views.index, name='index'),

  # Dashboard Page
  path('dashboard/', views.dashboard, name='dashboard'),

  # Profile Page
  path('profile/', views.profile, name='profile'),

  # Authentication URLs
  path('auth/', include('django.contrib.auth.urls')),

  # User related API URLs
  path('api/users/', include('users.urls')),

  # Blog related API URLs
  path('api/blogs/', include('blogs.urls')),

  # Payment related API URLs
  path('api/payments/', include('payments.urls')),
]
