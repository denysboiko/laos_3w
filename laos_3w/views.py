from django.shortcuts import render
from .models import *
from rest_framework import viewsets
from .serializers import *

import json


def home(request):
    return render(
        request,
        'index.html',
        {'user': request.user,
         'data': 'Hi'
         }
    )


class ProvinceViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Province.objects.all()
    serializer_class = ProvinceSerializer


class DistrictViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = District.objects.all()
    serializer_class = DistinctSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class ProjectViewSet2(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = ProjectByProvinces.objects.values('province__name').distinct()
    serializer_class = ProjectSerializer2


def Projects(request):
    """
    API endpoint that allows users to be viewed or edited.
    """

    queryset = Project.objects.all().values()

    serializer = ProjectSerializer(queryset)
    print (queryset)
    return JsonResponse({'data': list(queryset)})


from django.shortcuts import render_to_response, redirect
from django.http import HttpResponseBadRequest, HttpResponse
from django import forms
from django.template import RequestContext
import django_excel as excel


class UploadFileForm(forms.Form):
    file = forms.FileField()


from django.http import JsonResponse


def upload(request):

    if request.method == "POST":
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            filehandle = request.FILES['file']
            return excel.make_response(filehandle.get_sheet(), "csv")
        else:
            return HttpResponseBadRequest()

    else:
        form = UploadFileForm()

    return render_to_response('upload.html',
                              {'form': form},
                              context_instance=RequestContext(request))

def download(request):
    sheet = excel.pe.Sheet([[1, 2], [3, 4]])
    return excel.make_response(sheet, "csv")


# def import_data(request):
#     if request.method == "POST":
#         form = UploadFileForm(request.POST,
#                               request.FILES)
#
#         def choice_func(row):
#             q = Province.objects.filter(slug=row[0])[0]
#             row[0] = q
#             return row
#         if form.is_valid():
#             request.FILES['file'].save_book_to_database(
#                 models=[Province, Choice],
#                 initializers=[None, choice_func],
#                 mapdicts=[
#                     ['question_text', 'pub_date', 'slug'],
#                     ['question', 'choice_text', 'votes']]
#             )
#             return redirect('handson_view')
#         else:
#             return HttpResponseBadRequest()
#     else:
#         form = UploadFileForm()
#     return render(
#         request,
#         'upload_form.html',
#         {
#             'form': form,
#             'title': 'Import excel data into database example',
#             'header': 'Please upload sample-data.xls:'
#         })


def import_sheet(request):
    if request.method == "POST":
        form = UploadFileForm(request.POST,
                              request.FILES)
        if form.is_valid():
            request.FILES['file'].save_to_database(
                # save_book_to_database
                # save_to_database
                model= ProjectByProvinces,
                # ProjectByProvinces,
                # [ImplementingPartner, Subsector],
                # initializers=[None, None],
                mapdict=
                    # [
                    #     'id',
                    #     'dcode',
                    #     'name',
                    #     'name_l',
                    #     'area',
                    #     'province_id'
                    # ]
                [
                    "project_id",
                    "province_id",
                    "district_id"
                ]
                # [
                #
                #     "project_code",
                #     "partner_id",
                #     "project_title",
                #     "year",
                #     "start_date",
                #     "end_date",
                #     "status_id",
                #     "sector_id",
                #     "other_subsector_id",
                #     "planed_amount",
                #     "responsible_id",
                #     "implementing_partner_id"
                # ]
                    # [
                    #     'implementing_partner_name',
                    # ]
                #     [
                #         'other_subsector_name',
                #     ]

            )
            return HttpResponse("OK")
        else:
            return HttpResponseBadRequest()
    else:
        form = UploadFileForm()
    return render(
        request,
        'upload.html',
        {'form': form})
