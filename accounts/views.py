from django.shortcuts import render,redirect
from django.contrib.auth.models import User
from django.contrib.auth import login,logout,authenticate
from django.contrib.auth.decorators import login_required
from .models import Booking
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from . serializers import BookingSerializer
from rest_framework.views import APIView
from django.contrib import messages
from django.http import JsonResponse

# Create your views here.


from django.http import JsonResponse
from django.contrib.auth.models import User

def register(request):

    if request.method == 'POST':

        firstname = request.POST.get('firstname')

        lastname = request.POST.get('lastname')

        username = request.POST.get('email')

        email = request.POST.get('email')

        password = request.POST.get('password1')

        password2 = request.POST.get('password2')


        # PASSWORD CHECK
        if password != password2:

            return JsonResponse({

                'success': False,

                'message': 'Passwords do not match'

            })


        # EMAIL EXISTS
        if User.objects.filter(email=email).exists():

            return JsonResponse({

                'success': False,

                'message': 'Email already exists'

            })


        # CREATE USER
        User.objects.create_user(

            username=username,

            email=email,

            password=password,

            first_name=firstname,

            last_name=lastname

        )

        return JsonResponse({

            'success': True,

            'message': 'Account created successfully'

        })

    return JsonResponse({

        'success': False,

        'message': 'Invalid request'

    })


def login_user(request):

    if request.method == 'POST':

        email = request.POST.get('email')

        password = request.POST.get('password')

        user = authenticate(
            username=email,
            password=password
        )

        if user is not None:

            login(request, user)
            return JsonResponse({

            'success': True,

            'message': 'Loggin successfull',
            'redirect':'/'

    

        })

        return JsonResponse({

            'success': False,

            'message': 'Invalid email or password'

        })

    return render(
        request,
        'accounts/login.html'
    )



def logout_user(request):
    
    logout(request)
    return redirect('home')

@login_required
def MyBookings(request):
  
    return render(request,'accounts/myBooking.html')

class MyBookingsApiView(APIView):
    permission_classes = [IsAuthenticated]
    
    
    def get(self,request):
        bookings =  Booking.objects.filter(user=request.user).order_by('-created_at')
        serializer = BookingSerializer(bookings,many=True)
        return Response(serializer.data)


    