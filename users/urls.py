from django.urls import path
from django.conf.urls import include
from rest_framework.routers import DefaultRouter
# from .views import CustomUserViewSet
from . import views

router = DefaultRouter()
router.register(r'CustomUser', views.CustomUserViewSet)

"""
urlpatterns = [

] + router.urls
"""

urlpatterns = [
    path('', include(router.urls)),
    path('SaveButton/', views.SaveButton, name="SaveButton"),
    path('csrf/', views.CsrfView, name="CsrfView"),
]
