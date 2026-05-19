from django.db import models

# Create your models here.

class Works(models.Model):
    CATEGORY_CHOICE = [
        ('wedding', 'Wedding'),
        ('pre-wedding', 'Pre-Wedding'),
        ('save_tha_date', 'Save the date' ),
        ('birthday','Birthday'),
        ('events','Events')
    ]
    WORK_TYPE = [
        ('image', 'Image'),
        ('video', 'Video'),
    ]
    
    title = models.CharField( max_length=50)
    description = models.TextField(blank=True,null=True)
    file = models.ImageField( upload_to='works/', )
    work_type = models.CharField(choices=WORK_TYPE, max_length=50)
    category = models.CharField(choices=CATEGORY_CHOICE, max_length=50)
    created_at = models.DateTimeField(  auto_now_add=True)
    is_removed = models.BooleanField(default=False)
    
    def __str__(self):
        return self.title
    
    class Meta:
        db_table = 'Works'