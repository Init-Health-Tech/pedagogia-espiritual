from rest_framework.routers import DefaultRouter

from .views import EsquemaGrupoViewSet, GrupoPastoreoViewSet

router = DefaultRouter()
router.register('esquemas', EsquemaGrupoViewSet, basename='esquemas')
router.register('', GrupoPastoreoViewSet, basename='grupos')

urlpatterns = router.urls
