from django.core.management.base import BaseCommand, CommandError
from payments.models import InviteCode

class Command(BaseCommand):

    def add_arguments(self, parser):
        # Named (optional) arguments
        parser.add_argument(
            '--blog_id',
            type=str,
            help='Provide a Blog ID to get old URLs',
        )

    def handle(self, *args, **options):
        key = randomString(12)
        new_invite = InviteCode(key=key)

def randomString(stringLength=10):
    """Generate a random string of fixed length """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(stringLength))