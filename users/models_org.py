from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    user_name = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    # group_company_id = models.ForeignKey('shift_manage.GroupCompany', on_delete=models.SET_NULL, null=True)
    group_company_id= models.IntegerField(null=True)

    class Meta(AbstractUser.Meta):
        db_table = 'custom_user'  # オプション: テーブル名を変更する場合
        swappable = 'AUTH_USER_MODEL'
