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
from blogs.slatestarcodex.slatestarcodex_blog import SlateStarCodexBlog
from blogs.mercatus_center.mercatus_center_blog import MercatusCenterBlog
from blogs.marginal_revolution.marginal_revolution_blog import MarginalRevolutionBlog

CATEGORIES = ["Rationality", "Economics", "Technology"]

BLOGS = (
    BryanCaplanBlog,
    MeltingAsphaltBlog,
    # NassimTalebBlog,
    RibbonfarmBlog,
    KwokChainBlog,
    SlateStarCodexBlog,
    MercatusCenterBlog,
    MarginalRevolutionBlog,
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

    final_json = {}
    for blog in BLOGS:
        new_blog = blog()
        categories = new_blog.categories

        if categories:
            for category in categories:
                if category not in final_json:
                    final_json[category] = [new_blog.to_json()]
                else:
                    final_json[category].append(new_blog.to_json())

    return JsonResponse(final_json, safe=False)