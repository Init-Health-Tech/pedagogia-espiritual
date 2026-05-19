from rest_framework.routers import DefaultRouter

from .views import CategoriaContenidoViewSet, ContenidoViewSet

router = DefaultRouter()
router.register('categorias', CategoriaContenidoViewSet, basename='categorias')
router.register('', ContenidoViewSet, basename='contenidos')

urlpatterns = router.urls
