from blogs.Econlib.bryan_caplan.bryan_caplan_blog import BryanCaplanBlog
from blogs.melting_asphalt.melting_asphalt_blog import MeltingAsphaltBlog
from blogs.Nassim_Taleb.nassim_taleb_blog import NassimTalebBlog
from blogs.Ribbonfarm.ribbonfarm_blog import RibbonfarmBlog
from blogs.kwokchain.kwokchain_blog import KwokChainBlog
from blogs.slatestarcodex.slatestarcodex_blog import SlateStarCodexBlog
from blogs.mercatus_center.mercatus_center_blog import MercatusCenterBlog
from blogs.marginal_revolution.marginal_revolution_blog import MarginalRevolutionBlog

from blogs.melting_asphalt.melting_asphalt_scraper import MeltingAsphaltScraper
from blogs.kwokchain.kwokchain_scraper import KwokchainScraper
from blogs.marginal_revolution.marginal_revolution_scraper import MarginalRevolutionScraper
from blogs.Ribbonfarm.ribbonfarm_scraper import RibbonfarmScraper
from blogs.stratechery.stratechery_scraper import StratecheryScraper

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

SCRAPERS = (
    MeltingAsphaltScraper,
    KwokchainScraper,
    MarginalRevolutionScraper,
    RibbonfarmScraper,
    StratecheryScraper
)
