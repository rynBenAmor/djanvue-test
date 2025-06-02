from rest_framework import serializers
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
from .models import Post
User = get_user_model()



class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'get_profile_pic', 'profile_pic')


    
class GroupSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Group
        fields = ('id', 'name')



class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Post
        fields = ('id', 'user', 'content', 'title', 'get_blog_image', 'get_absolute_url', 'get_author', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')