from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class Booking(models.Model):
    CATEGORY_CHOICES = [
        ('wedding', 'Wedding'),
        ('pre-wedding', 'Pre-Wedding'),
        ('save_the_date', 'Save The Date'),
        ('birthday', 'Birthday'),
        ('events', 'Events'),
    ]
    HEARD_CHOICES = [
        ('instagram', 'Instagram'),
        ('facebook', 'Facebook'),
        ('friend', 'Friend'),
        ('google', 'Google'),
    ]
    STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('confirmed', 'Confirmed'),
    ('sessioncompleted', 'Session Completed'),
    ('editinginprogress', 'Editing in Progress'),
    ('completed', 'Completed'),
    ('cancelled', 'Cancelled'),
    ('customercancelled', 'Customer Cancelled'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField( max_length=50)
    email = models.EmailField( max_length=254)
    phone = models.CharField( max_length=15)
    event_date = models.DateField( )
    city = models.CharField( max_length=150)
    message = models.TextField(blank=True,null=True)
    heard_via = models.CharField(choices=HEARD_CHOICES, max_length=50)
    package = models.CharField( max_length=150)
    celebration = models.CharField( choices=CATEGORY_CHOICES,max_length=150)
    created_at = models.DateTimeField( auto_now_add=True)
    status = models.CharField(default='pending',choices=STATUS_CHOICES, max_length=50)
    price_of_package = models.CharField(max_length=100, blank=True, null=True)
    duration = models.CharField(max_length=100, blank=True, null=True)
    is_removed = models.BooleanField(default=False)

    
    def __str__(self):
        return self.name
    
    class Meta:
        db_table = 'Bookings'
        ordering = ['-created_at']