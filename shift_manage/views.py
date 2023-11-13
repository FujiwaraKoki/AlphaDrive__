# from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import ShiftTypeSerializer, GroupCompanySerializer, EmployeeShiftSerializer, MaxOfficeHourSerializer
from .models import ShiftType, GroupCompany, EmployeeShift, MaxOfficeHour
from users.models import CustomUser

from django.http import JsonResponse, HttpResponse
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt

import json
import datetime


class ShiftTypeViewSet(viewsets.ModelViewSet):
    queryset = ShiftType.objects.all()
    serializer_class = ShiftTypeSerializer


class GroupCompanyViewSet(viewsets.ModelViewSet):
    queryset = GroupCompany.objects.all()
    serializer_class = GroupCompanySerializer


class EmployeeShiftViewSet(viewsets.ModelViewSet):
    queryset = EmployeeShift.objects.all()
    serializer_class = EmployeeShiftSerializer


class MaxOfficeHourViewSet(viewsets.ModelViewSet):
    queryset = MaxOfficeHour.objects.all()
    serializer_class = MaxOfficeHourSerializer



@csrf_exempt
@api_view(('POST', 'OPTION',))
def SaveButton(request):
    print("request method: ", request.method)
    if request.method == "POST":
        datas = JSONParser().parse(request)
        data = datas['shifts']
        print("data: ", data)

        serializer = EmployeeShiftSerializer(data=data, many=True)

        print("serializer: ", serializer)
        if serializer.is_valid():
            print("is_valid: True")
            print("data: ", serializer.data)
            print("validated_data: ", serializer.validated_data)

            shift_check_1 = check_shift_(serializer.validated_data)
            if shift_check_1["status"] == 400:
                return Response({'error': shift_check_1["message"]}, status=shift_check_1["status"])


            for idx, item_data in enumerate(serializer.validated_data):
                print("item_data: ", item_data)
                # print("id: ", item_data['id'])
                # item = EmployeeShift.objects.get(id=item_data['id'])
                item = EmployeeShift.objects.get(id=idx+1)
                item.user = item_data.get('user', item.user)
                item.shift_type = item_data.get('shift_type', item.shift_type)
                item.work_day = item_data.get('work_day', item.work_day)
                # item.updated_at = datetime.datetime.now()
                item.save()

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

def check_shift_(item_list):
    now = datetime.datetime.now()

    datetime_range = {
        "init": datetime.datetime(year=now.year, month=11, day=11, hour=0, minute=0, second=0),
        "last": datetime.datetime(year=now.year, month=11, day=19, hour=23, minute=59, second=59)
    }

    users = CustomUser.objects
    shift_types = ShiftType.objects

    admin_item_list = []

    # シフト確認対象者のシフトのみ抽出する
    for item in item_list:
        print("item: ", item)
        # user = users.get(pk=item.user)
        user = users.get(pk=item["user"])
        print("user: ", user)
        if user.is_staff:
            # work_day_split = item.work_day.split("-")
            work_day = item["work_day"]

            # shift_type = shift_types.get(pk=item.shift_type)
            shift_type = shift_types.get(pk=item["shift_type"])

            shift_start_time = shift_type.start_time
            shift_end_time = shift_type.end_time

            # シフトの日跨ぎ判定
            if shift_start_time > shift_end_time:
                shift_dict = {
                    "init": datetime.datetime(year=work_day.year, month=work_day.month, day=work_day.day, hour=shift_start_time.hour, minute=shift_start_time.minute, second=shift_start_time.second),
                    "last": datetime.datetime(year=work_day.year, month=work_day.month, day=work_day.day+1, hour=shift_end_time.hour, minute=shift_end_time.minute, second=shift_end_time.second)
                }
            else:
                shift_dict = {
                    "init": datetime.datetime(year=work_day.year, month=work_day.month, day=work_day.day, hour=shift_start_time.hour, minute=shift_start_time.minute, second=shift_start_time.second),
                    "last": datetime.datetime(year=work_day.year, month=work_day.month, day=work_day.day, hour=shift_end_time.hour, minute=shift_end_time.minute, second=shift_end_time.second)
                }

            admin_item_list.append(shift_dict)

    admin_item_list_sort = sorted(admin_item_list, key=lambda x: x["init"])
    print("admin_item_list_sort: ", admin_item_list_sort)

    drop_datetime_range = []

    for i in range(len(admin_item_list_sort)):
        print("data: ", admin_item_list_sort[i])
        # 範囲外のシフトは判定から外す
        if (   (admin_item_list_sort[i]["last"] < datetime_range["init"])
            or (admin_item_list_sort[i]["init"] > datetime_range["last"])):
            continue

        # 範囲開始時刻と範囲内最初のシフト開始時刻に乖離がある場合、エラーメッセージに追加
        if (   (i == 0)
            and (admin_item_list_sort[i]["init"] - datetime_range["init"] > datetime.timedelta(seconds=1))):
            drop_datetime_range.append({
                "init": datetime_range["init"],
                "last": admin_item_list_sort[i]["init"]
            })

        # 範囲終了時刻と範囲内最後のシフト終了時刻に乖離がある場合、エラーメッセージに追加
        if (    (i == len(admin_item_list_sort)-1)
            and (datetime_range["last"] - admin_item_list_sort[i]["last"] > datetime.timedelta(seconds=1))):
            drop_datetime_range.append({
                "init": admin_item_list_sort[i]["last"],
                "last": datetime_range["last"]
            })

        # 連続するシフト間に乖離がある場合、エラーメッセージに追加
        # if (   (admin_item_list_sort[i]["last"] < admin_item_list_sort[i+1]["init"])
        if (    (0 <= i < len(admin_item_list_sort)-1)
            and (admin_item_list_sort[i+1]["init"] - admin_item_list_sort[i]["last"] > datetime.timedelta(seconds=1))):
            drop_datetime_range.append({
                "init": admin_item_list_sort[i]["last"],
                "last": admin_item_list_sort[i+1]["init"]
            })

    if len(drop_datetime_range) == 0:
        print("Success")
        res = {
            "status": status.HTTP_200_OK,
            "message": ""
        }
    else:
        message = "下記時間帯のシフトが記入されていません。\n\n"
        message += f"開始時刻: {datetime_range['init']}\n"
        message += f"終了時刻: {datetime_range['last']}\n\n"
        print("Error")
        for drop_range in drop_datetime_range:
            print("From: {}, To: {}".format(drop_range["init"], drop_range["last"]))
            message += f"From: {drop_range['init']}, To: {drop_range['last']}\n"

        res = {
            "status": status.HTTP_400_BAD_REQUEST,
            "message": message
        }

    return res