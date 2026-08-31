from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ChangePasswordView, MeView, RegisterView, UserViewSet

router = DefaultRouter()
router.register('users', UserViewSet, basename='users')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', MeView.as_view(), name='me'),
    path('me/change_password/', ChangePasswordView.as_view(), name='change_password'),
    path('', include(router.urls)),
]
