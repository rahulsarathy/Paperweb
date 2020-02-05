from app import app
from flask import request, Response
from app.s3_utils import download_link
import os
import PyPDF2
import sys

@app.route('/')
@app.route('/index')
def index():
    return "Hello, World!"

@app.route('/html_to_pdf', methods=['POST'])
def html_to_pdf():
    print("current dir is", file=sys.stderr)
    print(os.getcwd(), file=sys.stderr)
    for root, dirs, files in os.walk("./dump"):
        for filename in files:
            print(filename, file=sys.stderr)
    html_id = request.values.get('html_id')
    file_name = '{}.html'.format(html_id)
    download_link('pulppdfs', file_name, os.path.join('dump', file_name))
    os.system('chromium-browser --headless --no-sandbox --print-to-pdf=/home/printer_start/dump/{}.pdf file:///home/printer_'
              'start/dump/{}'.format(html_id, file_name))
    # get number of pages of pdf
    # reader = PyPDF2.PdfFileReader(open(os.path.join('home', 'printer_start', 'dump', '{}.pdf'.format(html_id))))
    reader = PyPDF2.PdfFileReader(open(os.path.join('dump', '{}.pdf'.format(html_id)), mode="rb"))
    num_pages = reader.getNumPages()
    os.remove(os.path.join('dump', '{}.pdf'.format(html_id)))
    # return to main server with PDF ID and pdf count
    output = {
        'pages': num_pages,
        'html_id': html_id,
    }
    r = Response(str(output), status=200)
    return r
