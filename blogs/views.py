from django.shortcuts import render
from django.http import JsonResponse


from rest_framework.decorators import api_view
from rest_framework import viewsets
from rest_framework.response import Response


from blogs import serializers

from blogs.Econlib.bryan_caplan.bryan_caplan_blog import BryanCaplanBlog
from blogs.melting_asphalt.melting_asphalt_blog import MeltingAsphaltBlog
from blogs.Nassim_Taleb.nassim_taleb_blog import NassimTalebBlog
from blogs.Ribbonfarm.ribbonfarm_blog import RibbonfarmBlog
from blogs.kwokchain.kwokchain_blog import KwokChainBlog

BLOGS = (
    BryanCaplanBlog,
    MeltingAsphaltBlog,
    # NassimTalebBlog,
    RibbonfarmBlog,
    KwokChainBlog,
)


class BlogViewSet(viewsets.ViewSet):
    # Required for the Browsable API renderer to have a nice form.
    serializer_class = serializers.BlogSerializer

    def list(self, request):
        serializer = serializers.BlogSerializer(
            instance=BLOGS, many=True)
        return Response(serializer.data)

@api_view(['GET'])
def get_blogs(request):
    blog_json = []
    for blog in BLOGS:
        new_blog = blog()
        blog_json.append(new_blog.to_json())
    return JsonResponse(blog_json, safe=False)