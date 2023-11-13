from rest_framework import viewsets
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import CustomUserSerializer
from .models import CustomUser 
 
from django.http import JsonResponse, HttpResponse
from django.db import transaction
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
import json


class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer


def CsrfView(request):
    return JsonResponse({'token': get_token(request)})


@csrf_exempt
@api_view(('POST', 'OPTION',))
def SaveButton(request):
    print("request method: ", request.method)
    if request.method == "POST":
        datas = JSONParser().parse(request)
        data = datas['users']
        print("data: ", data)

        serializer = CustomUserSerializer(data=data, many=True)
        print("serializer(users): ", serializer)

        if serializer.is_valid():
            for idx, item_data in enumerate(serializer.validated_data):
                print("item_data: ", item_data)
                
                item = CustomUser.objects.get(id=idx+1)  # ('user_name', 'non-admin'), ('first_name', 'non-admin'), ('last_name', ''), ('is_staff', False), ('is_active', False), ('is_superuser', True), ('group_company_id', 1)
                item.user_name = item_data.get('user_name', item.user_name)
                item.first_name = item_data.get('first_name', item.first_name)
                item.last_name = item_data.get('last_name', item.last_name)
                item.is_staff = item_data.get('is_staff', item.is_staff)
                item.is_active = item_data.get('is_active', item.is_active)
                item.is_superuser = item_data.get('is_superuser', item.is_superuser)
                item.group_company_id = item_data.get('group_company_id', item.group_company_id)
                # item.updated_at = datetime.datetime.now()
                item.save()
            # return JsonResponse(serializer.data, status=200)
            return Response(serializer.data, status=200)
        else:
            print("is_valid: False")
            print(serializer.errors)
            # return JsonResponse(serializer.errors, status=400)
            return Response(serializer.errors, status=400)

    elif request.method == "OPTION":
        response = HttpResponse()
        # response["Access-Control-Allow-Origin"] = 'http://localhost:3000'
        response["Access-Control-Allow-Origin"] = '*'
        response["Access-Control-Allow-Credentials"] = 'true'
        response["Access-Control-Allow-Headers"] = "Content-Type, Accept, X-XSRFToken"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        return response
