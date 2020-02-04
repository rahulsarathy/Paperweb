import time
from formatter import webdriver
import json

image_source = 'file:///Users/Rahul/Developer/selenium/dump/-8989687746741444906.html'

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
# chrome_options.add_argument('window-size=1200x600')
driver = webdriver.Chrome('/Users/Rahul/Developer/selenium/chromedriver', chrome_options=chrome_options)  # Optional argument, if not specified will search path.
driver.get(image_source);
driver.execute_script('window.print();')
# time.sleep(5) # Let the user actually see something!
# search_box = driver.find_element_by_name('q')
# search_box.send_keys('ChromeDriver')
# search_box.submit()
driver.quit()
