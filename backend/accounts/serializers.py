from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'role', 'phone', 'avatar', 'bio', 'is_active_member',
            'date_joined_movement', 'date_joined', 'created_at',
        )
        read_only_fields = ('id', 'role', 'date_joined', 'created_at')

    def get_full_name(self, obj):
        name = f'{obj.first_name} {obj.last_name}'.strip()
        return name or obj.username


class UserAdminSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True, required=False, min_length=8)

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'password', 'first_name', 'last_name', 'full_name',
            'role', 'phone', 'avatar', 'bio', 'is_active_member', 'is_active',
            'date_joined_movement', 'date_joined', 'created_at',
        )
        read_only_fields = ('id', 'date_joined', 'created_at')

    def get_full_name(self, obj):
        name = f'{obj.first_name} {obj.last_name}'.strip()
        return name or obj.username

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


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
