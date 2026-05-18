from django.shortcuts import render,get_object_or_404,redirect
from accounts.models import Booking
from rest_framework.views import APIView
from rest_framework.response import Response
from accounts.serializers import BookingSerializer,WorkSerializer,UserSerializer
from home.models import Works
from django.contrib.auth.models import User
from django.contrib.auth import login,logout,authenticate
from django.contrib import messages
from django.http import JsonResponse
from django.urls import reverse



# Create your views here.


def admin_view(request):
    
    return render(request,'admin_app/admin.html')



class BookingsAPIView(APIView):

    def get(self,request):
        bookings = Booking.objects.filter(is_removed=False)
        serializer = BookingSerializer(bookings,many=True)
        return Response(serializer.data)
    

class StatusUpdateAPIView(APIView):
    def patch(self,request,id):
        booking = get_object_or_404(Booking,id=id,is_removed=False)
    
        status_value = request.data.get('status')
        
        if not status_value:
            return Response({
                'error': 'Status is required'
            }, status=400)
        
        
        booking.status = status_value
        booking.save()
      
        return Response({
            'message': 'Status updated successfully'
        })
        
class CustomerAPIView(APIView):
    def get(self,request):
        user = User.objects.all()
        serilazier = UserSerializer(user,many=True)
        
        return Response (serilazier.data)
    
    
class WorkAPIView(APIView):

    def get(self, request):

        works = Works.objects.all()

        serializer = WorkSerializer(works, many=True)

        return Response(serializer.data)    


class DeleteWorkAPIView(APIView):
    def delete(self,request,id):
        work = get_object_or_404(Works,id=id)
        if work.file:
            work.file.delete()
        work.delete()
        return Response({'message':'work deleted successfully'})
    

class DeleteBookingsAPIView(APIView):
    def delete(self,request,id):
        booking = get_object_or_404(Booking,id=id,is_removed=False)
        booking.is_removed = True
        booking.save()
        
        return Response({'Message':'Booking deleted successfully'})
    
class DeleteCustomerAPIView(APIView):
    def delete(self,request,id):
        customer = get_object_or_404(User,id=id)
        customer.delete()
        return Response({
            'message': 'Customer deleted successfully'
        })


class WorkEditAPIView(APIView):
    def put(self,request,id):
        work = get_object_or_404(Works,id=id)
        serialzer = WorkSerializer(work,data=request.data, partial=True)
        if serialzer.is_valid():
            serialzer.save()
            return Response({
                'message':'Work updated successfully',
                'data':serialzer.data
            })
        return Response(serialzer.errors,status=400)
    
class AddWorkAPIView(APIView):
    def post(self,request):
        serializer = WorkSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'messsage':'Work added successfully','data':serializer.data},status=201)
        return Response(serializer.errors,status=400)
    
    


def admin_loggin(request):
    Passkey = '142443'
    
    if request.method == 'POST':
            username = request.POST.get('username')
            password = request.POST.get('password')
            passkey = request.POST.get('passkey')

            
            user = authenticate(request, username=username, password=password)
            print(user)
            if user is not None:
                if passkey == Passkey:
                    if user.is_superuser:
                        login(request,user)
                        
                        return JsonResponse({
                            'success':True,
                            'message':'Logggin successfull',
                            'redirect':reverse('admin_view')
                        })
                    else:
                        return JsonResponse({
                            'success':False,
                            'message':'Invalid superuser',
                            
                        })
                else:
                    return JsonResponse({
                            'success':False,
                            'message':'Invalid Passkey',
                            
                        })
            else:
                return JsonResponse({
                            'success':False,
                            'message':'Invalid usernaem or password or passkey',
                            
                        })
            
    return render(request,'admin_app/admin_loggin.html')

