from blogs.Econlib.bryan_caplan.bryan_caplan_blog import BryanCaplanBlog
from blogs.melting_asphalt.melting_asphalt_blog import MeltingAsphaltBlog
from blogs.Nassim_Taleb.nassim_taleb_blog import NassimTalebBlog
from blogs.Ribbonfarm.ribbonfarm_blog import RibbonfarmBlog
from blogs.kwokchain.kwokchain_blog import KwokChainBlog
from blogs.slatestarcodex.slatestarcodex_blog import SlateStarCodexBlog
from blogs.mercatus_center.mercatus_center_blog import MercatusCenterBlog
from blogs.marginal_revolution.marginal_revolution_blog import MarginalRevolutionBlog
from blogs.stratechery.stratechery_blog import StratecheryBlog
from blogs.mercatus_center.mercatus_center_blog import MercatusCenterBlog

from blogs.melting_asphalt.melting_asphalt_scraper import MeltingAsphaltScraper
from blogs.kwokchain.kwokchain_scraper import KwokchainScraper
from blogs.marginal_revolution.marginal_revolution_scraper import MarginalRevolutionScraper
from blogs.Ribbonfarm.ribbonfarm_scraper import RibbonfarmScraper
from blogs.stratechery.stratechery_scraper import StratecheryScraper
from blogs.Nassim_Taleb.nassim_taleb_scraper import NassimTalebScraper
from blogs.slatestarcodex.slatestarcodex_scraper import SlateStarCodexScraper
from blogs.mercatus_center.mercatus_center_scraper import MercatusCenterScraper

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
    StratecheryBlog,
)

SCRAPERS = (
    MeltingAsphaltScraper,
    KwokchainScraper,
    MarginalRevolutionScraper,
    RibbonfarmScraper,
    StratecheryScraper,
    # NassimTalebScraper,
    SlateStarCodexScraper,
    MercatusCenterScraper

)

scraper_map = {
    MeltingAsphaltScraper().name_id: MeltingAsphaltScraper,
    KwokchainScraper().name_id: KwokchainScraper,
    MarginalRevolutionScraper().name_id: MarginalRevolutionScraper,
    RibbonfarmScraper().name_id: RibbonfarmScraper,
    StratecheryScraper().name_id: StratecheryScraper,
    # NassimTalebScraper().name_id: NassimTalebScraper
    SlateStarCodexScraper().name_id: SlateStarCodexScraper
}

# def create_blog_map():
#     scraper_map = {}
#     for blog in BLOGS:
#         scraper_map[blog().name_id] = blog
#     return scraper_map


def blog_map(requested_id):
    for blog in BLOGS:
        if blog().name_id == requested_id:
            return blog

def scraper_map(requested_id):
    for scraper in SCRAPERS:
        if scraper().name_id == requested_id:
            return scraper