from django.urls import path
from .views import LogoutView, UserList, GroupList, UserDetail, CurrentUserView, PostList, PostDetail

urlpatterns = [
     path('user/logout/', LogoutView.as_view(), name='logout'),

    path('users/', UserList.as_view(), name='user-list'),
    path('user_detail/<int:pk>/', UserDetail.as_view(), name='user-detail'),
    path('user/me/', CurrentUserView.as_view(), name='current_user'),
    path('groups/', GroupList.as_view(), name='group-list'),

    path('blog/posts/', PostList.as_view(), name='post-list'),
    path('blog/posts/<slug:post_slug>/', PostDetail.as_view(), name='post-detail'),
]