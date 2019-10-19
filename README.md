# Pre-Build Checklist
After cloning the repository in preparation to run please make sure that you have:
* Installed Docker locally 
```$ docker --version```
> tested wtih Docker version 19.03.2, build 6a30dfc
* Installed Docker Compose locally 
```$ docker-compose --version```
> tested with docker-compose version 1.24.1, build 4667896b
* A .env.dev file in your project root directory. This is used by docker-compose to setup the environment variables 

.env.dev file has following entries:
>
> ## django
> DEBUG=1

> SECRET_KEY="enter secret key"

> DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 [::1]

> DJANGO_SETTINGS_MODULE=pulp.dev_settings
> 
> ## database
> SQL_ENGINE=django.db.backends.postgresql

> SQL_DATABASE=pulp_db

> SQL_USER=admin

> SQL_PASSWORD="enter db password"

> SQL_HOST=db

> SQL_PORT=5432

> DATABASE=postgres

> 
> ## ngrok
> NGROK_HOST='95c0c850.ngrok.io'

# Build 
$ docker-compose up -d --build

# Run 
$ Open http://localhost:8000/landing in a browser

# Cleanup 
$ docker-compose down -v 