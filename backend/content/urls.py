from rest_framework.routers import DefaultRouter

from .views import CategoriaContenidoViewSet, ContenidoViewSet, TutorialVideoViewSet

router = DefaultRouter()
router.register('tutoriales', TutorialVideoViewSet, basename='tutoriales')
router.register('categorias', CategoriaContenidoViewSet, basename='categorias')
router.register('', ContenidoViewSet, basename='contenidos')

urlpatterns = router.urls
