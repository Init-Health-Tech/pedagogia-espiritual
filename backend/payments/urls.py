from rest_framework.routers import DefaultRouter

from .views import PagoViewSet, PlanSuscripcionViewSet, SuscripcionViewSet

router = DefaultRouter()
router.register('planes', PlanSuscripcionViewSet, basename='planes')
router.register('suscripciones', SuscripcionViewSet, basename='suscripciones')
router.register('pagos', PagoViewSet, basename='pagos')

urlpatterns = router.urls
