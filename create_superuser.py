import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'CaptureNest.settings')

django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

username = "novavisuals_admin_access"
email = "novavisuals_admin_access@gmail.com"
password = "nova123admin"

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username, email, password)
    print("Superuser created")
else:
    print("Superuser already exists")
    
