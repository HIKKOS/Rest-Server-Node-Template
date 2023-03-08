const add = require("date-fns/add");
const calcularFechaExpiracion = ({VecesContratado, frecuencia = "MENSUAL" , initialDate = new Date()}) => {
	const dia = initialDate.getDate();
	const mes = initialDate.getMonth();
	const anio = initialDate.getFullYear();
	anio.toFixed()
	const added = {};
	switch (frecuencia) {
		case "SEMANAL":
			added.weeks = VecesContratado;
			break;
		case "MENSUAL":
			added.months = VecesContratado;
			break;
		case "BIMESTRAL":
			added.months = 2 * VecesContratado;
			break;
		case "SEMESTRAL":
			added.months = 6 * VecesContratado;
			break;
		case "ANUAL":
			added.years = VecesContratado;
			break;
		default:
			added.months = VecesContratado;
			break;
	}
	const FechaExpiracion = add(
		initialDate,
		added,
	) 
	console.log({FechaExpiracion});
	console.log({initialDate});
	const diasRestantes = Math.ceil((FechaExpiracion - initialDate) / (1000 * 60 * 60 * 24))
	return ({FechaExpiracion: FechaExpiracion, diasRestantes})
};
const getDiasRestantes = ({initialDate = new Date(), lastDate}) => {
	const diasRestantes = Math.ceil((lastDate - initialDate) / (1000 * 60 * 60 * 24))
	return diasRestantes
} 
module.exports = {
	calcularFechaExpiracion,
	getDiasRestantes
};
