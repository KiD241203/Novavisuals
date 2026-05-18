from django.shortcuts import render,get_object_or_404
from . models import Works
from django.contrib.auth.models import User
from accounts . models import Booking
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
# Create your views here.


def home(request):
    return render(request,'home.html')

def gallery(request):
    works = Works.objects.all()
    context = {
        'works':works,
    }
    return render(request,'gallery.html',context)

def packages(request):
    return render(request,'packages.html')

@login_required
@login_required
def booking(request):

    if request.method == 'POST':

        name = request.POST.get('customer_name')

        phone = request.POST.get('phone')

        email = request.POST.get('email')

        event_date = request.POST.get('event_date')

        city = request.POST.get('city')

        referral = request.POST.get('referral')

        message = request.POST.get('message')

        category = request.POST.get('celebration')

        package = request.POST.get('package')

        value = request.POST.get('value')

        duration = request.POST.get('duration')


        booking = Booking.objects.create(

            user=request.user,

            name=name,

            phone=phone,

            email=email,

            event_date=event_date,

            city=city,

            heard_via=referral,

            message=message,

            celebration=category,

            package=package,

            price_of_package=value,

            duration=duration

        )

        return JsonResponse({

            'success': True,

            'message': 'Booking submitted successfully',

            'reference': f'CN-{booking.id}'

        })

    return render(
        request,
        'booking.html'
    )