<h1>Pulp</h1>
<p>Select your favorite content from the web, and get it mailed to your doorstep as a magazine. </p>

<h2>Setup</h2>

<p>Clone the Pulp repo</p>

```
mkdir paperweb
git clone https://github.com/rahulsarathy/Pulp.git Pulp
cd Pulp
git remote add upstream git@github.com:rahulsarathy/Pulp.git
git fetch upstream
```

<h2>To run</h2>

<h3>Start up webserver</h3>

```
source venv/bin/activate
cd pulp
python manage.py runserver
```
<h3>Start up webpack server (for live js change updates)</h3>

```
cd static/js
npm i
npm start
```
