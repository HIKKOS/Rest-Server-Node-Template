const { Router } = require("express");
const { check } = require("express-validator");
const {
	createOrder,
	cancelOrder,
	captureOrder,
} = require("../controllers/paypal-api");
const {
	ExisteServicio,
	estaExpiradoServicioAlumno,
} = require("../helpers/DataBaseValidator");

const router = Router();

router.post(
	"/create-order",
	createOrder,
);
router.get("/cancel-order", cancelOrder);
router.get("/capture-order", captureOrder);

module.exports = router;
