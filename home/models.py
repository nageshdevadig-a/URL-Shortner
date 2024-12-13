from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .manager import CustomUserManager

# Create your models here.
class CustomUser(AbstractBaseUser,PermissionsMixin):
    userId = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=50)
    email = models.EmailField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    profile_photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)
    objects = CustomUserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']
    def __str__(self):
        return self.email


class UrlManager(models.Model):
    urlID = models.BigAutoField(primary_key=True)
    longUrl = models.CharField(max_length=1000)
    shortUrl = models.CharField(unique=True, max_length=20)
    relationID = models.ForeignKey('UserUrlRelation', on_delete=models.CASCADE)
    visits = models.IntegerField(default=0)

    def __str__(self):
        return self.shortUrl

class UserUrlRelation(models.Model):
    id = models.BigAutoField(primary_key=True)
    userID = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    urlID = models.ForeignKey(UrlManager, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.urlID