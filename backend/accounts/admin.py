from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_active_member', 'is_staff')
    list_filter = ('role', 'is_active_member', 'is_staff', 'is_superuser')
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Perfil MFST', {
            'fields': ('role', 'phone', 'avatar', 'bio', 'is_active_member', 'date_joined_movement'),
        }),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Perfil MFST', {'fields': ('role', 'email', 'first_name', 'last_name')}),
    )
