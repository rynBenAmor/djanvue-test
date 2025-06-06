from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.core.files.storage import default_storage
from django.http import HttpResponse


class ImageUploadView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes =  [AllowAny]

    def post(self, request, format=None):
        file_obj = request.FILES.get('image')
        if not file_obj:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        filename = default_storage.save(f'chat_images/{file_obj.name}', file_obj)
        file_url = default_storage.url(filename)
        return Response({'url': file_url}, status=status.HTTP_201_CREATED) # response is created 201
    

def test_view(request):
    return HttpResponse("hello world")