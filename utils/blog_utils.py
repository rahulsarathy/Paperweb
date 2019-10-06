from blogs.melting_asphalt.melting_asphalt import MeltingAsphalt
from blogs.kwokchain.kwokchain import Kwokchain
from blogs.marginal_revolution.marginal_revolution import MarginalRevolution
from blogs.Ribbonfarm.ribbonfarm import Ribbonfarm
from blogs.stratechery.stratechery import Stratechery
from blogs.slatestarcodex.slatestarcodex import SlateStarCodex
from blogs.mercatus_center.mercatus_center import MercatusCenter

CATEGORIES = ["Rationality", "Economics", "Technology"]

BLOGS = (
    MeltingAsphalt,
    Kwokchain,
    MarginalRevolution,
    Ribbonfarm,
    Stratechery,
    # NassimTalebScraper,
    SlateStarCodex,
    MercatusCenter,

)

def blog_map(requested_id):
    for blog in BLOGS:
        if blog().name_id == requested_id:
            return blog