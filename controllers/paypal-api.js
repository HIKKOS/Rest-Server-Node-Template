const { request, response } = require("express");
const axios = require("axios")
const createOrder = async(req = request, res = response) => {
	const order = {
		intent: "CAPTURE",
		purchase_units: [
			{
				amount: {
					currency_code: "MXN",
					value: "2700",
				},
				description: "service example",
			},
		],
		application_context: {
            brand_name:'payschool',
            locale: "es-MX",
            user_action: "PAY_NOW",
            landing_page: "LOGIN",
			return_url: "http://localhost:8080/api/test-paypal/capture-order",
			cancel_url: "http://localhost:8080/api/test-paypal/cancel-order",
		},
	};
    const resp = await axios.post(`${process.env.PAYPAL_API_URI}/v2/checkout/orders`, order, 
    {
        auth:{
            username: process.env.PAYPAL_API_CLIENT,
            password: process.env.PAYPAL_API_SECRET,
        }}
    )
    console.log(resp.data);
}
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
