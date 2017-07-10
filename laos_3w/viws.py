from django.shortcuts import render


def home(request):
    return render(
        request,
        'index.html',
        { 'user': request.user,
          'data': 'Hi'
        }
    )