from rest_framework.routers import DefaultRouter

from .views import AvanceEspiritualViewSet, FichaPedagogicaViewSet, ModuloViewSet, PreguntaChecklistViewSet

router = DefaultRouter()
router.register('modulos', ModuloViewSet, basename='modulos')
router.register('preguntas', PreguntaChecklistViewSet, basename='preguntas')
router.register('fichas', FichaPedagogicaViewSet, basename='fichas')
router.register('avances', AvanceEspiritualViewSet, basename='avances')

urlpatterns = router.urls
