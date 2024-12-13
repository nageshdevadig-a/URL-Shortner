from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('sign-in',views.signIn,name='signin'),
    path('sign-up',views.signUp,name='signup'),
    path('check-available',views.checkAvailable,name='checkAvailable'),
    path('submit-url',views.createUrlRouting,name='create-routing'),
    path('change-password/', views.changePasswordPage, name='change_password_page'),
    path('<str:shortUrl>', views.urlRedirect, name='urlRedirect'),

]