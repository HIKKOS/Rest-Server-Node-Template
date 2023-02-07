const genderCheck = (...genders) => {
	return (req, res, next) => {
		if (req.body === undefined) {
			throw new Error("el campo genero es obligatorio");
		}
		let { Genero } = req.body;
		if (!Genero) {
			throw new Error("el campo genero es obligatorio");
		}
		Genero = Genero.toUpperCase();
		if (!genders.includes(Genero)) {
			throw new Error(`${Genero} no pertenece a los generos: ${genders}`);
		}
		next();
	};
};
module.exports = {
	genderCheck,
};
