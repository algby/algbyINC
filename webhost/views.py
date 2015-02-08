# Create your views here.
# Create your views here.
from django.template import RequestContext
from django.shortcuts import render_to_response

def home(request):
    return render_to_response('webhost/index.html')

def about(request):
    return render_to_response('webhost/about.html')

def company(request):
    return render_to_response('webhost/policy.html')

def blog(request):
    return render_to_response('webhost/blog.html')

def TOS(request):
    return render_to_response('webhost/tos.html')

def contact(request):
    return render_to_response('webhost/contacts.html')

def copyright(request):
    return render_to_response('webhost/copyright.html')

def faq(request):
    return render_to_response('webhost/faq.html')

def pk(request):
    return render_to_response('webhost/plans.html')
