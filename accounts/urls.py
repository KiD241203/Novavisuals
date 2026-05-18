
from django.urls import path,include
from . import views



urlpatterns = [
  path('',views.register,name='register'),
  path('login/',views.login_user,name='login'),
  path('logout/',views.logout_user,name='logout'),
  path('my-booking/',views.MyBookings,name='myBooking'),
  
  # Api viewwsss=======================================
  
  path('api/my-bookings/',views.MyBookingsApiView.as_view(),name='my_bookings_api'),
  
]
