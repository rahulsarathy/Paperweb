from django.urls import include, path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)

app_name = 'api'
urlpatterns = [
    path('', include(router.urls)),
    path('rf/', include('rest_framework.urls', namespace='rest_framework'))
]