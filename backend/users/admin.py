from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.template.response import TemplateResponse
from .models import User, Student, Teacher

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User

    list_display = ('username', 'name', 'student_id', 'role', 'email', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_superuser', 'is_active', 'district', 'current_grade')
    search_fields = ('username', 'name', 'email', 'student_id', 'phone')
    ordering = ('username',)

    readonly_fields = ('student_id', 'profile_image_preview')

    def profile_image_preview(self, obj):
        from django.utils.html import format_html
        if obj.profile_image:
            return format_html('<img src="{}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 50%;" />', obj.profile_image.url)
        return "No Image"
    
    profile_image_preview.short_description = 'Profile Preview'

    def add_view(self, request, form_url='', extra_context=None):
        if not request.GET.get('role') and not request.POST:
            return TemplateResponse(request, 'admin/users/add_role_selection.html', {
                'title': 'Select User Type',
            })
        return super().add_view(request, form_url, extra_context)

    def get_fieldsets(self, request, obj=None):
        fieldsets = list(super().get_fieldsets(request, obj))
        
        # Get role from obj or from request (for add view)
        role = getattr(obj, 'role', request.GET.get('role'))
        
        profile_fields = ['role', 'name', 'profile_image', 'profile_image_preview', 'phone', 'address', 'district']
        fieldsets.append(('Profile Information', {'fields': profile_fields}))

        if role == 'student':
            fieldsets.append(('Student Specific Info', {'fields': ('student_id', 'current_grade')}))
        elif role == 'teacher':
            fieldsets.append(('Teacher Specific Info', {
                'fields': ('subject', 'grades', 'educational_qualifications', 'about', 'class_fee')
            }))
        else:
            # If no role yet or mixed, maybe show both or neither. 
            # In add_view we force role selection, so this is mostly for change_view
            if obj: # Existing user
                if obj.role == 'student':
                    fieldsets.append(('Student Specific Info', {'fields': ('student_id', 'current_grade')}))
                elif obj.role == 'teacher':
                    fieldsets.append(('Teacher Specific Info', {
                        'fields': ('subject', 'grades', 'educational_qualifications', 'about', 'class_fee')
                    }))

        return fieldsets

    def get_add_fieldsets(self, request):
        role = request.GET.get('role')
        add_fieldsets = list(super().add_fieldsets)
        
        profile_fields = ['role', 'name', 'profile_image', 'phone', 'address', 'district']
        add_fieldsets.append(('Profile Information', {'fields': profile_fields}))

        if role == 'student':
            add_fieldsets.append(('Student Info', {'fields': ('current_grade',)}))
        elif role == 'teacher':
            add_fieldsets.append(('Teacher Info', {
                'fields': ('subject', 'grades', 'educational_qualifications', 'about', 'class_fee')
            }))
            
        return add_fieldsets

    def save_model(self, request, obj, form, change):
        if not change and not obj.role:
            role = request.GET.get('role')
            if role:
                obj.role = role
        super().save_model(request, obj, form, change)

@admin.register(Student)
class StudentAdmin(CustomUserAdmin):
    def get_queryset(self, request):
        return super().get_queryset(request).filter(role='student')
    
    def add_view(self, request, form_url='', extra_context=None):
        # Force role to student
        g = request.GET.copy()
        g['role'] = 'student'
        request.GET = g
        return super(UserAdmin, self).add_view(request, form_url, extra_context)

@admin.register(Teacher)
class TeacherAdmin(CustomUserAdmin):
    def get_queryset(self, request):
        return super().get_queryset(request).filter(role='teacher')

    def add_view(self, request, form_url='', extra_context=None):
        # Force role to teacher
        g = request.GET.copy()
        g['role'] = 'teacher'
        request.GET = g
        return super(UserAdmin, self).add_view(request, form_url, extra_context)

