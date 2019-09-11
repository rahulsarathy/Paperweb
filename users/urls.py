from django.urls import include, path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r'', views.UserViewSet)

app_name = 'users'
urlpatterns = [
    # path('', include(router.urls)),
    path('rf/', include('rest_framework.urls', namespace='rest_framework')),
    path('get_address/', views.get_address),
    path('set_address/', views.set_address),
]