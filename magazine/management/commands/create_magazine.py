from fpdf import FPDF, HTMLMixin
from django.core.management.base import BaseCommand
from blogs.models import Article, Blog
from magazine.html_template import template

class Command(BaseCommand):

    def handle(self, *args, **options):
        # pdf = FPDF()
        # pdf.add_page()
        # pdf.set_font("Arial", size=12)
        # pdf.cell(200, 10, txt="Welcome to Python!", ln=1, align="C")
        # pdf.output("simple_demo.pdf")
        html2pdf()

def html2pdf():
    # html = '''<h1 align="center">PyFPDF HTML Demo</h1>
    # <p>This is regular text</p>
    # <p>You can also <b>bold</b>, <i>italicize</i> or <u>underline</u>
    # '''
    html = template

    pdf = HTML2PDF()
    pdf.add_page()
    pdf.write_html(html)
    pdf.output('html2pdf.pdf')

class HTML2PDF(FPDF, HTMLMixin):
    pass