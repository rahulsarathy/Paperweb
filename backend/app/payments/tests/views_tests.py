import moto

from unittest import mock
import vcr

from django.contrib.auth.models import User
from payments.views import payment_status, cancel_payment, create_session
from utils.stripe_utils import stripe_db_user_paid
from payments.models import BillingInfo
from django.http import JsonResponse

from rest_framework import status
from rest_framework.test import APIRequestFactory
from rest_framework.test import APITestCase
from rest_framework.test import force_authenticate


class PaymentsViewsTests(APITestCase):

	def setUp(self):
		self.create_session = '/api/payments/create_session/'
		self.payment_status = '/api/payments/payment_status/'
		self.cancel_payment = '/api/payments/cancel_payment/'
		self.stripe_hook = '/api/payments/stripehook/'
		self.next_billing_date = '/api/payments/next_billing_date/'
		self.next_delivery_date = '/api/payments/next_delivery_date/'
		self.get_stripe_public_key = '/api/payments/get_stripe_public_key'

		self.test_user = User.objects.create(
			email='rita@sarathy.org')
		self.factory = APIRequestFactory()

	@vcr.use_cassette('payments/tests/__snapshots__/test_check_payment_status_paid.yaml')
	def test_check_payment_status_paid(self):

		paid_user = User.objects.create(
			email='rahul@getpulp.io', username='paid_user')
		request = self.factory.get(self.payment_status)
		force_authenticate(request, user=paid_user)
		response = payment_status(request)
		self.assertEquals(response.status_code, status.HTTP_208_ALREADY_REPORTED)

	@vcr.use_cassette('payments/tests/__snapshots__/test_check_payment_status_unpaid.yaml')
	def test_check_payment_status_unpaid(self):
		request = self.factory.get(self.payment_status)
		force_authenticate(request, user=self.test_user)
		response = payment_status(request)
		self.assertEquals(response.status_code, status.HTTP_200_OK)

		with self.assertRaises(BillingInfo.DoesNotExist):
			BillingInfo.objects.get(customer=self.test_user)

	@vcr.use_cassette('payments/tests/__snapshots__/test_cancel_payment.yaml')
	def test_cancel_payment(self):
		paid_user = User.objects.create(
			email='rahul@getpulp.io', username='paid_user')
		self.assertTrue(stripe_db_user_paid(paid_user))

		request = self.factory.post(self.cancel_payment)
		force_authenticate(request, user=paid_user)
		response = cancel_payment(request)
		self.assertEquals(response.status_code, status.HTTP_200_OK)

		self.assertFalse(stripe_db_user_paid(paid_user))
		billing_info = BillingInfo.objects.get(customer=paid_user)
		self.assertIsNone(billing_info.stripe_subscription_id)

	@mock.patch('utils.stripe_utils.check_payment_status')
	@vcr.use_cassette('payments/tests/__snapshots__/test_create_session_paid.yaml')
	def test_create_session_paid(self, mock_check_payment_status):
		paid_user = User.objects.create(
			email='rahul@getpulp.io', username='paid_user')
		BillingInfo(customer=paid_user, stripe_subscription_id='sub_H2mygz39GNb5C1', stripe_customer_id='cus_H2lvIVaB5erjgo').save()
		mock_check_payment_status.return_value = True

		request = self.factory.post(self.create_session)
		force_authenticate(request, user=paid_user)
		response = create_session(request)
		self.assertEquals(response.status_code, status.HTTP_403_FORBIDDEN)

	# @mock.patch('utils.stripe_utils.check_payment_status')
	# def test_create_session_customer_id(self, mock_check_payment_status):
	# 	mock_check_payment_status.return_value = False
	# 	unpaid_user = User.objects.create(email='cat1@cat.com', username='paid_user')
	# 	BillingInfo(customer=unpaid_user, stripe_customer_id='cus_H1OgtZ5D2gRb32').save()
	#
	# 	request = self.factory.post(self.create_session)
	# 	force_authenticate(request, user=unpaid_user)
	# 	response = create_session(request)
	# 	response_content = response.content.decode("utf-8")
	# 	print(response_content)
	# 	self.assertEquals(response.status_code, status.HTTP_200_OK)
	# 	self.assertEquals(response_.get('client_reference_id'), unpaid_user.id)
	# 	self.assertEquals(response_content['customer'], 'cus_H1OgtZ5D2gRb32')


	# def test_create_session_no_billing_info(self):
	# 	pass

	# def test_create_session_no_customer_id(self):
	# 	pass

