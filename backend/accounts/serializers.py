import re
import secrets

from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

ROLES_ADMIN_EDITABLES = (User.Role.MEMBER, User.Role.COORDINATOR)


def _username_desde_email(email):
    local = (email or '').split('@')[0].lower()
    base = re.sub(r'[^a-z0-9._-]', '', local)[:40] or 'usuario'
    candidato = base
    n = 1
    while User.objects.filter(username=candidato).exists():
        candidato = f'{base}{n}'
        n += 1
    return candidato


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'role', 'phone', 'avatar', 'bio', 'is_active_member',
            'must_change_password', 'date_joined_movement', 'date_joined', 'created_at',
        )
        read_only_fields = (
            'id', 'role', 'must_change_password', 'date_joined', 'created_at',
        )

    def get_full_name(self, obj):
        name = f'{obj.first_name} {obj.last_name}'.strip()
        return name or obj.username


class UserAdminSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True, required=False, min_length=8)

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'password',
            'first_name', 'last_name', 'full_name',
            'role', 'phone', 'avatar', 'bio', 'is_active_member', 'is_active',
            'must_change_password', 'date_joined_movement', 'date_joined', 'created_at',
        )
        read_only_fields = ('id', 'username', 'must_change_password', 'date_joined', 'created_at')

    def get_full_name(self, obj):
        name = f'{obj.first_name} {obj.last_name}'.strip()
        return name or obj.username

    def validate_role(self, role):
        if role not in ROLES_ADMIN_EDITABLES:
            raise serializers.ValidationError(
                'Por ahora solo puedes asignar roles de Miembro o Coordinador.',
            )
        return role

    def validate_email(self, email):
        email = (email or '').strip().lower()
        if not email:
            raise serializers.ValidationError('El correo electrónico es obligatorio.')
        qs = User.objects.filter(email__iexact=email)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError('Ya existe un usuario con este correo.')
        return email

    def validate(self, attrs):
        if self.instance and (self.instance.is_admin_user or self.instance.role == User.Role.ADMIN):
            raise serializers.ValidationError(
                'No se pueden editar cuentas de administrador desde este panel.',
            )
        if not self.instance:
            if not (attrs.get('first_name') or '').strip():
                raise serializers.ValidationError({'first_name': 'El nombre es obligatorio.'})
            if not (attrs.get('last_name') or '').strip():
                raise serializers.ValidationError({'last_name': 'El apellido es obligatorio.'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password', None)
        email = validated_data['email']
        validated_data.setdefault('username', _username_desde_email(email))
        role = validated_data.get('role', User.Role.MEMBER)
        if role not in ROLES_ADMIN_EDITABLES:
            raise serializers.ValidationError({
                'role': 'Por ahora solo puedes asignar roles de Miembro o Coordinador.',
            })

        temp = secrets.token_urlsafe(12)
        user = User(**validated_data)
        user.set_password(temp)
        user.must_change_password = True
        user.is_active_member = True
        user.save()
        self._temporary_password = temp
        return user

    def update(self, instance, validated_data):
        validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

    def to_representation(self, instance):
        data = super().to_representation(instance)
        temp = getattr(self, '_temporary_password', None)
        if temp:
            data['temporary_password'] = temp
        return data


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password_confirm', 'first_name', 'last_name', 'phone')

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({'password_confirm': 'Las contraseñas no coinciden.'})
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User(**validated_data, role=User.Role.MEMBER)
        user.set_password(password)
        user.save()
        return user


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
    new_password_confirm = serializers.CharField(write_only=True, min_length=8)

    def validate(self, data):
        if data['new_password'] != data['new_password_confirm']:
            raise serializers.ValidationError({
                'new_password_confirm': 'Las contraseñas no coinciden.',
            })
        user = self.context['request'].user
        if not user.check_password(data['current_password']):
            raise serializers.ValidationError({
                'current_password': 'La contraseña actual no es correcta.',
            })
        return data

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.must_change_password = False
        user.save(update_fields=['password', 'must_change_password'])
        return user
