import moto

from unittest import mock
import logging
import vcr

from django.contrib.auth.models import User
from utils import stripe_utils
from payments.models import BillingInfo

from django.utils.timezone import now
from django.test import TestCase


class StripeUtilsTests(TestCase):

	def setUp(self):
		self.test_user = User.objects.create(email='rita@sarathy.org')
		
		self.stripe_user1 = 'rahul@getpulp.io'
		self.stripe_user2 = 'cat1@cat.com'

	@vcr.use_cassette('payments/tests/__snapshots__/test_create_session.yaml')
	def test_create_session(self):
		session = stripe_utils.create_session(1, self.test_user.email)
		self.assertEquals(session['customer_email'], self.test_user.email)
		self.assertEquals(session['client_reference_id'], str(1))

	@vcr.use_cassette('payments/tests/__snapshots__/check_previous_customer_no_customer.yaml')
	def test_check_previous_customer_no_customer(self):
		previous_customer = stripe_utils.check_previous_customer('false@false.com')
		self.assertIsNone(previous_customer)

	@mock.patch("logging.warning")
	@vcr.use_cassette('payments/tests/__snapshots__/test_check_previous_customer_one_customer.yaml')
	def test_check_previous_customer_one_customer(self, mock_logger):
		previous_customer = stripe_utils.check_previous_customer(self.stripe_user1)
		assert not mock_logger.called
		self.assertEquals(previous_customer['email'], self.stripe_user1)

	@mock.patch("logging.warning")
	@vcr.use_cassette('payments/tests/__snapshots__/test_check_previous_customer_multiple_customer.yaml')
	def test_check_previous_customer_multiple_customer(self, mock_logger):
		previous_customer = stripe_utils.check_previous_customer(self.stripe_user2)
		mock_logger.assert_called_with('Email: {} has more than one stripe customer'.format(self.stripe_user2))
		self.assertEquals(previous_customer['description'], 'test cat2')
		self.assertEquals(previous_customer['email'], self.stripe_user2)

	@vcr.use_cassette('payments/tests/__snapshots__/test_stripe_db_no_customer.yaml')
	def test_stripe_db_no_customer(self):
		user_paid = stripe_utils.stripe_db_user_paid(self.test_user)
		self.assertFalse(user_paid)

	@vcr.use_cassette('payments/tests/__snapshots__/test_stripe_db_user_paid.yaml')
	def test_stripe_db_user_paid(self):

		paid_user = User.objects.create(email='rahul@getpulp.io', username='test_paid_user')

		stripe_db_user_paid = stripe_utils.stripe_db_user_paid(paid_user)
		self.assertTrue(stripe_db_user_paid)

		billing_info = BillingInfo.objects.get(customer=paid_user)
		self.assertEquals(billing_info.stripe_customer_id, 'cus_H1HoIrfnLjPRnW')
		self.assertEquals(billing_info.stripe_subscription_id, 'sub_H1NCvGBXbVvLp7')


	def test_stripe_db_user_unpaid(self):
		unpaid_user = self.test_user
		
		stripe_db_user_unpaid = stripe_utils.stripe_db_user_paid(unpaid_user)
		self.assertFalse(stripe_db_user_unpaid)
		
		with self.assertRaises(BillingInfo.DoesNotExist):
			BillingInfo.objects.get(customer=unpaid_user)