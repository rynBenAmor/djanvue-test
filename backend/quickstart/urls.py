from django.urls import path
from .views import UserList, GroupList, UserDetail, CurrentUserView

urlpatterns = [
    path('users/', UserList.as_view(), name='user-list'),
    path('user_detail/<int:pk>/', UserDetail.as_view(), name='user-detail'),
    path('user/me/', CurrentUserView.as_view(), name='current_user'),
    path('groups/', GroupList.as_view(), name='group-list'),
]