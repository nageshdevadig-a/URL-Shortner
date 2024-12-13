from django.contrib.auth.models import BaseUserManager


class CustomUserManager(BaseUserManager):
    def create_user(self, email, name, password=None, **extra_fields):
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        user.set_password(password)  # Hash the password
        user.save(using=self._db)
        return user


    def update_password(self, password, email):
        user = self.get(email=email)
        user.set_password(password)
        user.save(using=self._db)
        return user