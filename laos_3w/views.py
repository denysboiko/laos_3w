from django.shortcuts import render
from .models import *

def home(request):
    return render(
        request,
        'index.html',
        { 'user': request.user,
          'data': 'Hi'
        }
    )


from django.shortcuts import render_to_response, redirect
from django.http import HttpResponseBadRequest, HttpResponse
from django import forms
from django.template import RequestContext
import django_excel as excel


class UploadFileForm(forms.Form):
    file = forms.FileField()


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
                name_columns_by_row=2,
                model=Province,
                mapdict=['pcode', 'name', 'name_l', 'longitude', 'latitude'])
            return HttpResponse("OK")
        else:
            return HttpResponseBadRequest()
    else:
        form = UploadFileForm()
    return render(
        request,
        'upload.html',
        {'form': form})