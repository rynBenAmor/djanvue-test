from rest_framework import serializers
from django.contrib.auth.models import Group, User


class UserSerializer(serializers.ModelSerializer):
    class Meta: 
        model = User
        fields = ('id', 'username', 'email', 'groups')

    
class GroupSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Group
        fields = ('id', 'name')