from .models import *
from django.contrib.auth.models import User, Group
from rest_framework import serializers


class ProvinceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Province
        fields = '__all__'


class ProjectSerializer(serializers.Serializer):
    project_code = serializers.IntegerField()
    project_title = models.CharField(max_length=80)


class ProjectSerializer2(serializers.ModelSerializer):
    project = serializers.ReadOnlyField(source='project.project_title')
    province = serializers.ReadOnlyField(source='province.name')
    partner = serializers.ReadOnlyField(source='project.partner.partner_name')
    status = serializers.ReadOnlyField(source='project.status.status')
    sector = serializers.ReadOnlyField(source='project.sector.sector_name')
    province_amount = serializers.ReadOnlyField()

    class Meta:
        model = ProjectByProvinces
        fields = [
            'project',
            'status',
            'sector',
            'partner',
            'province',
            'province_amount',
        ]
