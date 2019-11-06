## Testing

_NB: All of the following commands should be run in a docker container, that is_ 

`docker exec -it <container> <command with args>`. 

For example, `docker exec -it pulp_backend_1 ./manage.py test blogs`.

Run unit tests with `./manage.py test <app>`.

### Code Coverage

Navigate to the root of the Django application:

`cd Pulp/backend`

Calculate code coverage with

`coverage run --source='.' manage.py test <app>`

For example,

`coverage run --source='.' manage.py test blogs`

Then, view the code coverage report with

`coverage report`

This shows the number and percentage of lines covered in each file. For a more detailed report, run the code coverage report for HTML:

`coverage html`

This will produce an `htmlcov` subdirectory which contains HTML coverage reports for each individual file, indicate which specific lines within the file are covered. Open the HTML files in your browser to see the detailed coverage report.
