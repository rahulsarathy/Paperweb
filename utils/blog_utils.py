from blogs.scrapers.melting_asphalt import MeltingAsphalt
from blogs.scrapers.kwokchain import Kwokchain
from blogs.scrapers.marginal_revolution import MarginalRevolution
from blogs.scrapers.ribbonfarm import Ribbonfarm
from blogs.stratechery.stratechery import Stratechery
from blogs.scrapers.slatestarcodex import SlateStarCodex
from blogs.scrapers.mercatus_center import MercatusCenter
from blogs.scrapers.bryan_caplan import BryanCaplanEconlib
from blogs.scrapers.eugene_wei import EugeneWei
from blogs.scrapers.dan_wang import DanWang
from blogs.scrapers.elaineou import ElaineOu
from blogs.scrapers.everything_studies import EverythingStudies
from blogs.scrapers.overcoming_bias import OvercomingBias
from blogs.scrapers.noahpinion import Noahpinion
from blogs.scrapers.less_wrong import LessWrong
from blogs.scrapers.otium import Otium
from blogs.scrapers.gwern import Gwern
from blogs.scrapers.brookings import BrookingsInstitution

CATEGORIES = ["Rationality", "Economics", "Technology"]

BLOGS = (
    MeltingAsphalt,
    Kwokchain,
    MarginalRevolution,
    Ribbonfarm,
    Stratechery,
    SlateStarCodex,
    BryanCaplanEconlib,
    EugeneWei,
    DanWang,
    ElaineOu,
    EverythingStudies,
    OvercomingBias,
    Noahpinion,
    LessWrong,
    Otium,
    # Gwern
    # BrookingsInstitution,
    # MercatusCenter,

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