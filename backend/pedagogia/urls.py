from rest_framework.routers import DefaultRouter

from .views import AvanceEspiritualViewSet, EtapaEspiritualViewSet, FichaPedagogicaViewSet

router = DefaultRouter()
router.register('etapas', EtapaEspiritualViewSet, basename='etapas')
router.register('fichas', FichaPedagogicaViewSet, basename='fichas')
router.register('avances', AvanceEspiritualViewSet, basename='avances')

urlpatterns = router.urls
