from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User

    list_display = ('username', 'name', 'student_id', 'role', 'email', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_superuser', 'is_active', 'district', 'current_grade')
    search_fields = ('username', 'name', 'email', 'student_id', 'phone')
    ordering = ('username',)

    fieldsets = UserAdmin.fieldsets + (
        ('Profile Information', {
            'fields': (
                'role',
                'name',
                'phone',
                'address',
                'district',
            )
        }),
        ('Student Specific Info', {
            'fields': (
                'student_id',
                'current_grade',
            )
        }),
        ('Teacher Specific Info', {
            'fields': (
                'subject',
                'grades',
                'educational_qualifications',
                'about',
                'class_fee',
            )
        }),
    )

    readonly_fields = ('student_id',)

    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Profile Information', {
            'fields': (
                'role',
                'name',
                'phone',
                'address',
                'district',
            )
        }),
        ('Student Info (Optional for Teachers)', {
            'fields': (
                'current_grade',
            )
        }),
        ('Teacher Info (Optional for Students)', {
            'fields': (
                'subject',
                'grades',
                'educational_qualifications',
                'about',
                'class_fee',
            )
        }),
    )

