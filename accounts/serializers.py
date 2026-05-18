from rest_framework import serializers
from . models import Booking
from home.models import Works
from django.contrib.auth.models import User

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'  
        

class WorkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Works
        fields = '__all__'
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'