from django.core.management.base import BaseCommand, CommandError
from payments.models import InviteCode
import string
import random

class Command(BaseCommand):

    def add_arguments(self, parser):
        # Named (optional) arguments
        parser.add_argument(
            '--blog_id',
            type=str,
            help='Provide a Blog ID to get old URLs',
        )

    def handle(self, *args, **options):
        generate_invite_code()


def generate_invite_code(user=None):
    key = random_string(12)
    if user is not None:
        new_invite = InviteCode(key=key, owner=user)
    else:
        new_invite = InviteCode(key=key)
    new_invite.save()


def random_string(stringLength=10):
    """Generate a random string of fixed length """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(stringLength))