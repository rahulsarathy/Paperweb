<h1>Paperweb</h1>
<p>Select your favorite content from the web, and get it mailed to your doorstep as a magazine. </p>

<h2>Setup</h2>

<p>Clone the paperweb repo</p>

```
mkdir paperweb
git clone https://github.com/rahulsarathy/paperweb.git paperweb
cd paperweb
git remote add upstream git@github.com:rahulsarathy/paperweb.git
git fetch upstream
```

Retrieve hidden files from the administrator and copy them into the root directory:
```
.flaskenv
.env
```

<h2>To run</h2>

```
source venv/bin/activate
flask run
```
