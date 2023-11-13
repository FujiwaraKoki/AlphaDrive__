from rest_framework import serializers
from .models import CustomUser


class CustomUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        # fields = '__all__'
        fields = [
            "id",
            "user_name",
            "first_name",
            "last_name",
            "created_at",
            "updated_at",
            "is_staff",
            "is_active",
            "is_superuser",
            "group_company_id"
        ]