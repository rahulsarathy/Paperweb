from app import app
from flask import request
from app.s3_utils import download_link
import os

@app.route('/')
@app.route('/index')
def index():
    return "Hello, World!"


@app.route('/html_to_pdf', methods=['POST'])
def html_to_pdf():
    html_id = request.values.get('html_id')
    file_name = '{}.html'.format(html_id)
    download_link('pulppdfs', file_name, os.path.join('dump', file_name))
    os.exec('chromium-browser --headless --no-sandbox --print-to-pdf file:///home/printer_start/dump/{}'.
             format(file_name))
    # upload new pdf to s3
    # return to main server with PDF ID

    return "Hello, Word"
