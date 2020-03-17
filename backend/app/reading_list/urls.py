from django.urls import include, path
from rest_framework import routers

from . import views


app_name = 'reading_list'

urlpatterns = [
    path('add_reading', views.handle_add_to_reading_list),
    path('get_reading', views.get_reading),
    path('remove_reading', views.remove_from_reading_list),
    path('get_archive', views.get_archive),
    path('archive_item', views.archive_item),
    path('update_deliver', views.update_deliver),
    path('unarchive', views.unarchive),
    path('services_status', views.service_status),
]