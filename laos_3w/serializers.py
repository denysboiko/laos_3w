from .models import *
from django.contrib.auth.models import User, Group
from rest_framework import serializers


class ProvinceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Province
        fields = '__all__'


class ProjectSerializer2(serializers.ModelSerializer):

    project_title = models.CharField(max_length=80)
    partner = serializers.StringRelatedField()
    status = serializers.StringRelatedField()
    sector = serializers.StringRelatedField()
    province = serializers.StringRelatedField(many=True)
    province_amount = serializers.StringRelatedField(many=True, source="province")

    class Meta:
        model = Project
        fields = [
            'project_title',
            'status',
            'sector',
            'partner',
            'province',
            'province_amount'
        ]




class ProjectSerializer(serializers.ModelSerializer):
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
