from rest_framework.routers import DefaultRouter

from .views import EventoViewSet

router = DefaultRouter()
router.register('eventos', EventoViewSet, basename='eventos')

urlpatterns = router.urls
