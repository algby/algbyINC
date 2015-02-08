
from django.conf.urls import patterns, include, url

urlpatterns = patterns('webhost.views',
    url(r'^$', 'home', name='home'),
    url(r'^about/$', 'about', name='about'),
    url(r'^policy/$', 'pp', name='pp'),
    url(r'^TOS/$', 'TOS', name='TOS'),
    url(r'^contact/$', 'contact', name='contact'),
    url(r'^copyright/$', 'copyright', name='copyright'),
    url(r'^blog/$', 'blog', name='blog'),
    url(r'^faq/$', 'faq', name='faq'),
    url(r'^pk/$', 'pk', name='pk'),
    #url(r'^so/$', 'my_view', name='my_view'),
    url(r'^company/$', 'company', name='company'),
)
