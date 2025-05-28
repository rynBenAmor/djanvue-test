from rest_framework import serializers
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model

User = get_user_model()



class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'get_profile_pic', 'profile_pic')


    
class GroupSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Group
        fields = ('id', 'name')