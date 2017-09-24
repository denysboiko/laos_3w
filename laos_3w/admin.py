from .models import *
from django.contrib import admin
from django.contrib.admin import AdminSite, ModelAdmin

class MembershipInline(admin.TabularInline):
    model = ProjectByProvinces
    extra = 1

class LocationInline(admin.TabularInline):
    model = Location
    extra = 1

class ProjectAdmin(admin.ModelAdmin):

    inlines = (LocationInline, MembershipInline,)
    list_filter = ['partner','sector', 'status']
    search_fields = ['project_title', ]
    filter_horizontal = ('implementing_partner',)
    list_display = [
        'project_code',
        'project_title',
        'planed_amount',
        'status'
    ]


admin.site.register(Project, ProjectAdmin)


admin.site.register([Status, Province, Sector, Partner, District, ImplementingPartner, Subsector, Location])
