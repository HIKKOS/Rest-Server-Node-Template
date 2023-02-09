const gradeCheck = ( grade = 0  ) => {
	return (req, res, next) => {
		if (req.body === undefined) {
			throw new Error("el campo grado es obligatorio");
		}
		let { grade } = req.body;
		if ( !grade ) {
			throw new Error("el campo grado es obligatorio");
		}
		
		if( grade <= 0 ){
            throw new Error('debe ser mayor o igual a 1')
        }
		next();
	};
};
module.exports = {
	gradeCheck,
};