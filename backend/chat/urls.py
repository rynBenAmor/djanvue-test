from django.urls import path
from .views import ImageUploadView, test_view

urlpatterns = [
    path('upload-image/', ImageUploadView.as_view(), name='upload-image'),
    path('test/', test_view, name='test-view'),
]