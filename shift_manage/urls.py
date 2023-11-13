from django.urls import path
from django.conf.urls import include
from rest_framework.routers import DefaultRouter
from . import views
# from .views import ShiftTypeViewSet, GroupCompanyViewSet, EmployeeShiftViewSet, MaxOfficeHourViewSet

router = DefaultRouter()
router.register('ShiftType', views.ShiftTypeViewSet)
router.register('GroupCompany', views.GroupCompanyViewSet)
router.register('EmployeeShift', views.EmployeeShiftViewSet)
router.register('MaxOfficeHour', views.MaxOfficeHourViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('SaveButton/', views.SaveButton, name="SaveButton"),
]
