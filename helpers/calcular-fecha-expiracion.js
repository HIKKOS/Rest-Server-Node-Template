const add = require("date-fns/add");
const calcularFechaExpiracion = (TiempoContratado, frecuencia = "MENSUAL") => {
	const fechaActual = new Date();
	const dia = fechaActual.getDate();
	const mes = fechaActual.getMonth();
	const anio = fechaActual.getFullYear();
	const added = {};
	switch (frecuencia) {
		case "SEMANAL":
			added.weeks = TiempoContratado;
			break;
		case "MENSUAL":
			added.months = TiempoContratado;
			break;
		case "BIMESTRAL":
			added.months = 2 * TiempoContratado;
			break;
		case "SEMESTRAL":
			added.months = 6 * TiempoContratado;
			break;
		case "ANUAL":
			added.years = TiempoContratado;
			break;
		default:
			added.months = TiempoContratado;
			break;
	}
	return (FechaExpiracion = add(
		new Date(anio, mes, dia),
		added,
	)).toLocaleDateString();
};
module.exports = {
	calcularFechaExpiracion,
};
