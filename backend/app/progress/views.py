# progress/views.py
from django.shortcuts import render

def index(request):
    return render(request, 'progress/index.html')

def room(request, room_name):
    return render(request, 'progress/room.html', {
        'room_name': room_name
    })