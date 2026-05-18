from django.urls import path
from . import views

urlpatterns = [
    path('',views.admin_view,name='admin_view'),
    path('api/bookings/',views.BookingsAPIView.as_view()),
    path('api/status-update/<int:id>/',views.StatusUpdateAPIView.as_view()),
    path('api/customers/',views.CustomerAPIView.as_view()),
    path('api/works/',views.WorkAPIView.as_view()),
    path('api/delete-work/<int:id>/',views.DeleteWorkAPIView.as_view()),
    path('api/delete-booking/<int:id>/',views.DeleteBookingsAPIView.as_view()),
    path('api/delete-customer/<int:id>/',views.DeleteCustomerAPIView.as_view()),
    path('api/edit-work/<int:id>/',views.WorkEditAPIView.as_view()),
    path('api/add-work/',views.AddWorkAPIView .as_view()),
    
    path('admin_loggin/',views.admin_loggin,name='admin_loggin')
]