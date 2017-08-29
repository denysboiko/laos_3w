from .models import *
from django.contrib import admin
from django.contrib.admin import AdminSite, ModelAdmin

class MembershipInline(admin.TabularInline):
    model = ProjectByProvinces
    extra = 1

class ProjectAdmin(admin.ModelAdmin):

    inlines = (MembershipInline,)
    list_filter = ['sector', 'status']
    search_fields = ['project_title', ]
    list_display = [
        'project_code',
        'project_title',
        'planed_amount',
        'status'
    ]


admin.site.register(Project, ProjectAdmin)


admin.site.register([Status, Province, Sector, Partner, District, ImplementingPartner, Subsector])
