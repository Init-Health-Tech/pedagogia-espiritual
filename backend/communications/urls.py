from rest_framework.routers import DefaultRouter

from .views import AnuncioViewSet, MensajeViewSet

router = DefaultRouter()
router.register('anuncios', AnuncioViewSet, basename='anuncios')
router.register('mensajes', MensajeViewSet, basename='mensajes')

urlpatterns = router.urls
