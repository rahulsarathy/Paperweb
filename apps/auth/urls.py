from django.urls import include, path
from rest_framework import routers

from apps.auth import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)

app_name = 'auth'
urlpatterns = [
    path('', include(routers.urls)),
    path('api/', include('rest_framework.urls', namespace='rest_framework'))
]