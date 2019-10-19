from PyPDF2 import PdfFileMerger, PdfFileReader, utils

pdf_merger = PdfFileMerger(strict=False)

input_paths = ['./econlib1.pdf', './econlib2.pdf', './econlib3.pdf', './econlib4.pdf']
#input_paths = ['./first.pdf', './second.pdf']

try: 
    PdfFileReader(open('./econlib1.pdf', mode="rb"))
except utils.PdfReadError:
    print('invalid pdf file')

for path in input_paths:
    pdf_merger.append(path)
    
pdf_merger.write('./final.pdf')
