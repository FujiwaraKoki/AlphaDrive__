from rest_framework import serializers
from .models import ShiftType, GroupCompany, EmployeeShift, MaxOfficeHour


class ShiftTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShiftType
        fields = '__all__'


class GroupCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupCompany
        fields = '__all__'

class EmployeeShiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeShift
        fields = '__all__'

class MaxOfficeHourSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaxOfficeHour
        fields = '__all__'