import PyPDF2

with open('test.pdf', 'rb') as pdf_obj:
	reader = PyPDF2.PdfFileReader(pdf_obj)
	writer = PyPDF2.PdfFileWriter()
	for page in range(reader.getNumPages()):
		page = reader.getPage(page)
		writer.addPage(page)
	with open('output.pdf', 'wb') as f:
		writer.write(f)
