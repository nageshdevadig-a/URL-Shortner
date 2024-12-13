from django.urls import path
from . import views

urlpatterns = [
    path('', views.displayProfilePage, name='profile_page'),
    path('logout/', views.logoutUser, name='logout_page'),
    path('update-profile', views.updateProfilePage, name='update_profile_page'),
    path('delete-account',views.deleteAccountPage, name='delete_account_page'),
    path('update-url',views.updateUrlPage, name='update_url_page'),
    path('delete-url',views.deleteUrlPage, name='delete_url_page'),
    path('search/logout/', views.logoutUser, name='logout_page'),
    path('search/update-profile', views.updateProfilePage, name='update_profile_page'),
    path('search/delete-account', views.deleteAccountPage, name='delete_account_page'),
    path('search/update-url',views.updateUrlPage, name='update_url_page'),
    path('search/delete-url',views.deleteUrlPage, name='delete_url_page'),
    path('search/',views.searchQuery, name="search_page"),
    path('upload-profile-photo/', views.upload_profile_photo, name='upload_profile_photo'),
]