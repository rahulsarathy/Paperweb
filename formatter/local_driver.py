import time
from selenium import webdriver
import json, base64

image_source = 'file:///home/printer_start/dump/-8989687746741444906.html'

appState = {
    "recentDestinations": [
        {
            "id": "Save as PDF",
            "origin": "local",
            "account": ""
        }
    ],
    "selectedDestinationId": "Save as PDF",
    "version": 2
}

profile = {'printing.print_preview_sticky_settings.appState': json.dumps(appState)}
chrome_options = webdriver.ChromeOptions()
chrome_options.add_experimental_option('prefs', profile)
chrome_options.add_argument('--kiosk-printing')
chrome_options.add_argument('--no-margins')
chrome_options.add_argument('--headless')
chrome_options.add_argument('--disable-dev-shm-usage')
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('window-size=1200x600')
driver = webdriver.Chrome(options=chrome_options)  # Optional argument, if not specified will search path.
driver.get(image_source);
driver.execute_script('window.print();')
# time.sleep(5) # Let the user actually see something!
# search_box = driver.find_element_by_name('q')
# search_box.send_keys('ChromeDriver')
# search_box.submit()
driver.quit()
