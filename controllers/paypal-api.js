const { request, response } = require("express");
const axios = require("axios");
const createOrder = async (req = request, res = response) => {
	const order = {
		intent: "CAPTURE",
		purchase_units: [
			{
				amount: {
					currency_code: "MXN",
					value: "20",
				},
				description: "service example",
			},
		],
		application_context: {
			brand_name: "payschool",
			locale: "es-MX",
			user_action: "PAY_NOW",
			landing_page: "LOGIN",
			return_url: "http://localhost:8080/api/test-paypal/capture-order",
			cancel_url: "http://localhost:8080/api/test-paypal/cancel-order",
		},
	};
	const params = new URLSearchParams();
	params.append("grant_type", "client_credentials");
	const token = await axios.post(
		"https://api-m.sandbox.paypal.com/v1/oauth2/token",
		params,
		{
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			auth: {
				username: process.env.PAYPAL_CLIENT_ID,
				password: process.env.PAYPAL_CLIENT_SECRET,
			},
		},
	);
	console.log(token.data);
	const resp = await axios.post(
		`${process.env.PAYPAL_API_URI}/v2/checkout/orders`,
		order,
		{
			headers: {
				Authorization:
					"Bearer A21AAJOftvsjzU2z6O7352Pj3Y7iiEFgQHkIUmnoM4TEeKzdgP4iVHqspwWu6g95kWKhs2lTOion7EGc8UeqTvn9mDh3rjZ8w",
			},
		},
	);
	console.log(resp.data);
};
const cancelOrder = (req = request, res = response) => {
	res.send("create order");
};
const captureOrder = (req = request, res = response) => {
	res.send("create order");
};

module.exports = {
	createOrder,
	cancelOrder,
	captureOrder,
};
