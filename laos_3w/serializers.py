from .models import *
from django.contrib.auth.models import User, Group
from rest_framework import serializers


class ProvinceAmountSerializer(serializers.ModelSerializer):

    # province_amount = models.FloatField()
    name = serializers.ReadOnlyField(source='province.district')

    class Meta:
        model = ProjectByProvinces
        fields = ('name','province_amount',)


class ProvinceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Province
        fields = '__all__'


class ProjectSerializer2(serializers.ModelSerializer):

    project_title = models.CharField(max_length=80)
    planed_amount = models.FloatField()
    partner = serializers.StringRelatedField()
    status = serializers.StringRelatedField()
    implementing_partner = serializers.StringRelatedField()
    sector = serializers.StringRelatedField()
    other_subsector = serializers.StringRelatedField()
    province = serializers.StringRelatedField(many=True)
    province_l = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name_l',
        source='province'
     )
    district = serializers.StringRelatedField(many=True)
        # ProvinceAmountSerializer(many=True, source='project_by_provinces_set')

    class Meta:
        model = Project
        fields = [
            'project_title',
            'status',
            'implementing_partner',
            'sector',
            'partner',
            'planed_amount',
            'other_subsector',
            'province',
            'province_l',
            'district'
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
