from blogs.melting_asphalt.melting_asphalt import MeltingAsphalt
from blogs.kwokchain.kwokchain import Kwokchain
from blogs.marginal_revolution.marginal_revolution import MarginalRevolution
from blogs.Ribbonfarm.ribbonfarm import Ribbonfarm
from blogs.stratechery.stratechery import Stratechery
from blogs.slatestarcodex.slatestarcodex import SlateStarCodex
from blogs.mercatus_center.mercatus_center import MercatusCenter
from blogs.Econlib.bryan_caplan.bryan_caplan import BryanCaplanEconlib

CATEGORIES = ["Rationality", "Economics", "Technology"]

BLOGS = (
    MeltingAsphalt,
    Kwokchain,
    MarginalRevolution,
    Ribbonfarm,
    Stratechery,
    SlateStarCodex,
    MercatusCenter,
    BryanCaplanEconlib
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