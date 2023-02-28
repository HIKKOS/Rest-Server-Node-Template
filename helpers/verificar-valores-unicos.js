const tieneDuplicados = (data = []) => {
	data = data.map((h) => h.dia.toUpperCase());
	return new Set(data).size !== data.length;
};

module.exports = {
	tieneDuplicados,
};
