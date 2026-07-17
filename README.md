# NovaVisuals — Photography & Media Platform

A full-stack photography and media platform with home, account, gallery,
and admin modules, built with Django REST Framework and Pillow for
image processing.

## Features
- User authentication and account management
- Photo gallery with upload and organization
- Admin dashboard for content management
- Image processing pipeline via Pillow

## Tech Stack
Python · Django · Django REST Framework · PostgreSQL · Pillow · HTML/CSS/JS
Deployed on Render with Gunicorn + WhiteNoise

## Folder Structure
```
Novavisuals/
├── accounts/       # User authentication
├── admin_app/      # Admin dashboard/content management
├── home/           # Landing/home views
├── static/
├── templates/
└── manage.py
```

## Installation
```bash
git clone https://github.com/prabin-fullstack/Novavisuals.git
cd Novavisuals
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Environment Variables
```
SECRET_KEY=your-django-secret-key
DATABASE_URL=postgres://user:password@host:port/dbname
```

## Screenshots
*(Add: gallery view, upload flow, admin dashboard)*

## Future Improvements
- Add image tagging/search
- Add user profile customization

## License
MIT
