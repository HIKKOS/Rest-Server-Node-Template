const VerificarHorario = (horario = []) => {
	const stackHorario = [];
	for (const date of horario) {
		if (stackHorario.includes(date.Dia)) {
			return false;
		}
		if (!(date.Dia && date.Fin && date.Inicio)) {
			return false;
		}
		if (
			!["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES"].includes(
				date.Dia.toUpperCase(),
			)
		) {
			return false;
		}
		if (date.Inicio >= date.Fin) {
			return false;
		}
		if (date.Inicio < 7 || date.Inicio > 16) {
			return false;
		}
		stackHorario.push(date.Dia);
	}
	return true;
};
module.exports = {
	VerificarHorario,
};
