const getCorrectDateTime = () => {
	const fechaActual = new Date();
	const diferencia = fechaActual.getTimezoneOffset();
	fechaActual.setMinutes(fechaActual.getMinutes() - diferencia - 360);
	return fechaActual;
};
module.exports = {
	getCorrectDateTime,
};
