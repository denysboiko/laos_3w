from .models import *
from django.contrib import admin




class MembershipInline(admin.TabularInline):
    model = ProjectByProvinces
    extra = 1


class ProjectAdmin(admin.ModelAdmin):
    inlines = (MembershipInline,)



admin.site.register(Project, ProjectAdmin)
admin.site.register([Status, Province, Sector, Partner, Responsible, District])
