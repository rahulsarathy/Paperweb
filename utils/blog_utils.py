from blogs.scrapers.melting_asphalt import MeltingAsphalt
from blogs.scrapers.kwokchain import Kwokchain
from blogs.scrapers.marginal_revolution import MarginalRevolution
from blogs.scrapers.ribbonfarm import Ribbonfarm
from blogs.stratechery.stratechery import Stratechery
from blogs.slatestarcodex.slatestarcodex import SlateStarCodex
from blogs.scrapers.mercatus_center import MercatusCenter
from blogs.scrapers.bryan_caplan import BryanCaplanEconlib
from blogs.scrapers.eugenewei import EugeneWei

CATEGORIES = ["Rationality", "Economics", "Technology"]

BLOGS = (
    MeltingAsphalt,
    Kwokchain,
    MarginalRevolution,
    Ribbonfarm,
    Stratechery,
    SlateStarCodex,
    MercatusCenter,
    BryanCaplanEconlib,
    EugeneWei
)

def blog_map(requested_id):
    for blog in BLOGS:
        if blog().name_id == requested_id:
            return blog

def blog_from_url(permalink):
    if 'meltingasphalt' in permalink:
        return MeltingAsphalt
    elif 'kwokchain' in permalink:
        return Kwokchain
    elif 'ribbonfarm' in permalink:
        return Ribbonfarm
    elif 'stratechery' in permalink:
        return Stratechery
    elif 'slatestarcodex' in permalink:
        return SlateStarCodex
    elif 'mercatus' in permalink:
        return MercatusCenter