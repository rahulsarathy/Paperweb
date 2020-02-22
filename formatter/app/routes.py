from app import app
from flask import request, Response
from app.s3_utils import download_link
import os
import PyPDF2
import json
import sys

@app.route('/')
@app.route('/index')
def index():
    return "Hello, World!"

@app.route('/html_to_pdf', methods=['POST'])
def html_to_pdf():
    html_id = request.values.get('html_id')
    file_name = '{}.html'.format(html_id)
    download_link('pulphtml-test', file_name, os.path.join('dump', file_name))

    # convert html into pdf
    # Chrome flag descriptions
    # --headless: run chrome without UI
    # --run-all-compositor-stages-before-draw: make sure html content is fully loaded before PDF generation
    # --print-to-pdf={}: Print to PDF at file output
    os.system('chromium-browser --disable-dev-shm-usage --headless --no-sandbox  --run-all-compositor-stages-before-draw --print-to-pdf='
              '/home/printer_start/dump/{}.pdf file:///home/printer_'
              'start/dump/{}'.format(html_id, file_name))

    # get number of pages of pdf
    reader = PyPDF2.PdfFileReader(open(os.path.join('dump', '{}.pdf'.format(html_id)), mode="rb"))
    num_pages = reader.getNumPages()

    # delete pdf and downloaded html file
    os.remove(os.path.join('dump', '{}.pdf'.format(html_id)))
    os.remove(os.path.join('dump', '{}.html'.format(html_id)))

    # return to main server with article ID and pdf page count
    output = {
        'pages': int(num_pages),
        'html_id': html_id,
    }
    r = Response(json.dumps(output), status=200)
    return r
