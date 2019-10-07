source venv/bin/activate
export DJANGO_SETTINGS_MODULE=siteconfig.production_settings
git pull origin master
pip install -r requirements.txt
./manage.py makemigrations
./manage.py migrate
cd static/js
npm run build
cd ../..
./manage.py collectstatic
rm -rf staticfiles/js/node_modules
sudo systemctl restart gunicorn
echo Finished running production steps.
