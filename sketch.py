from bs4 import BeautifulSoup

f = open("index.html", "r")
soup = BeautifulSoup(f, 'html.parser')
content = soup.body
print(str(content))

c = open("output.html", "r+")

output_soup = BeautifulSoup(c, "html.parser")
output_body = output_soup.body
output_body.clear()

c.close()

c = open("output.html", "w+")
c.write(str(output_soup))

# output_body.insert(content)
#
# c.write(str(soup))

