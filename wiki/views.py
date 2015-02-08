# Create your views here.
# Create your views here.
from django.template import RequestContext
from django.shortcuts import render_to_response

def home(request):
    return render_to_response('wiki/index.html')

def about(request):
    return render_to_response('wiki/about.html')

def pp(request):
    return render_to_response('wiki/policy.html')

def about(request):
    return render_to_response('wiki/about.html')

def TOS(request):
    return render_to_response('wiki/tos.html')

def contact(request):
    return render_to_response('wiki/contacts.html')

def copyright(request):
    return render_to_response('wiki/copyright.html')

def test(request):
    return render_to_response('wiki/sessions.html')
