from django.contrib import admin
from .models import Subject

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'teacher', 'stream', 'class_fee')
    list_filter = ('grades', 'stream', 'teacher')
    search_fields = ('name', 'description')
    filter_horizontal = ('grades',)
