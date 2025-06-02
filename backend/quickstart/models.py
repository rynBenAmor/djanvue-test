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



class Post(models.Model):
    """
    Model representing a post made by a user.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    title = models.CharField(max_length=255, blank=True, null=True)
    slug = models.SlugField(max_length=255, blank=True, null=True)
    image = models.ImageField(upload_to='post_imgs/', blank=True, null=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} by {self.user.username}"
    
    @property
    def get_blog_image(self):
        print("get_blog_image called")
        if self.image:
            return 'http://127.0.0.1:8000' + self.image.url
        return ''
    
    @property
    def get_author(self):
        return self.user.username
    
    def get_absolute_url(self):
        return f"blog/posts/{self.slug}/"