from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
class User(AbstractUser):
    """
    Custom user model that extends the default Django user model.
    """
    profile_pic = models.ImageField(upload_to='user_imgs/', blank=True, null=True)

    @property
    def get_profile_pic(self):
        print("get_profile_pic called")
        if self.profile_pic:
            return 'http://127.0.0.1:8000' + self.profile_pic.url
        return ''
