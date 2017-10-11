from .models import *
from django.contrib import admin
from django.contrib.admin import AdminSite, ModelAdmin


class LocationInline(admin.TabularInline):
    model = Location
    extra = 1


class ProjectAdmin(admin.ModelAdmin):

    inlines = (LocationInline,)
    list_filter = ['partner','sector']
    search_fields = ['project_title', ]
    filter_horizontal = ('implementing_partner',)
    list_display = [
        'id',
        'project_code',
        'project_title',
        'status_code',
        'partner',
        'sector',
        'planed_amount'
    ]


class ImplementingParntersAdmin(admin.ModelAdmin):

    search_fields = ['implementing_partner_name']
    list_display = [
        'id',
        'implementing_partner_name'
    ]


class ProvinceAdmin(admin.ModelAdmin):

    search_fields = ['name']
    list_display = [
        'name',
        'pcode',
        'name_l'
    ]


class DistrictAdmin(admin.ModelAdmin):

    list_filter = ['province']
    search_fields = ['name']
    list_display = [
        'dcode',
        'name',
        'name_l',
        'province'
    ]

admin.site.register(Project, ProjectAdmin)
admin.site.register(ImplementingPartner, ImplementingParntersAdmin)
admin.site.register(Province, ProvinceAdmin)
admin.site.register(District, DistrictAdmin)
admin.site.register([Sector, Partner, Subsector])
