from rest_framework.routers import DefaultRouter

from .views import (
    AvanceEspiritualViewSet,
    FichaAreaEvaluacionViewSet,
    FichaEntradaSemanalViewSet,
    FichaPedagogicaViewSet,
    FichaPraxisItemViewSet,
    FichaPraxisRegistroViewSet,
    ModuloViewSet,
    PreguntaChecklistViewSet,
)

router = DefaultRouter()
router.register('modulos', ModuloViewSet, basename='modulos')
router.register('preguntas', PreguntaChecklistViewSet, basename='preguntas')
router.register('fichas', FichaPedagogicaViewSet, basename='fichas')
router.register('avances', AvanceEspiritualViewSet, basename='avances')
router.register('areas-evaluacion', FichaAreaEvaluacionViewSet, basename='areas-evaluacion')
router.register('praxis-items', FichaPraxisItemViewSet, basename='praxis-items')
router.register('entradas-semanales', FichaEntradaSemanalViewSet, basename='entradas-semanales')
router.register('praxis-registros', FichaPraxisRegistroViewSet, basename='praxis-registros')

urlpatterns = router.urls
