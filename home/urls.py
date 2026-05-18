from django.urls import path,include
from . import views
urlpatterns = [
    path('',views.home,name='home'),
    path('gallery/',views.gallery,name='gallery'),
    path('packages/',views.packages,name='packages'),
    path('booking/',views.booking,name='booking'),
]