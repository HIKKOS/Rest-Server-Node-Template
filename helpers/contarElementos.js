const contarRepeticiones = (arreglo) => {
	const resultado = {};
	arreglo.forEach((elemento) => {
		resultado[elemento] = (resultado[elemento] || 0) + 1;
	});
	const arregloObjetos = Object.entries(resultado).map(([clave, valor]) => ({
		[clave]: valor,
	}));    
    return arregloObjetos.sort((a, b) => Object.values(a) - Object.values(b))

};
module.exports = {
	contarRepeticiones,
};
