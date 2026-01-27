from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User

    list_display = ('username', 'email', 'role')
    list_filter = ('role',)

    fieldsets = UserAdmin.fieldsets + (
        ('Teacher Info', {
            'fields': (
                'role',
                'subject',
                'grades',
                'educational_qualifications',
                'about',
                'class_fee',
            )
        }),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Teacher Info', {
            'fields': (
                'role',
                'subject',
                'grades',
                'educational_qualifications',
                'about',
                'class_fee',
            )
        }),
    )
