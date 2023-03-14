const VerificarHorario = (horario = []) => {
    const stackHorario = []
    for (const date of horario) {
        if(stackHorario.includes(date.Dia)){
            throw new Error('No puede haber dos horarios en el mismo dia')
        }
        if((!((date.Dia && date.Fin ) && date.Inicio))){
            throw new Error('El horario debe contener Dia, Inicio y Fin')
        }
        if( !["LUNES", "MARTES", "MIERCOLES","JUEVES","VIERNES"].includes(date.Dia) ){
            throw new Error('El dia debe ser LUNES, MARTES, MIERCOLES, JUEVES o VIERNES')
        }
        if (date.Inicio >= date.Fin) {
            throw new Error ('la hora de inicio debe ser menor a la final');
        }
        if (date.Inicio < 7 || date.Inicio > 16) {
            throw new Error ('la hora de inicio debe ser mayor a 7 y menor a 16');
        }
        stackHorario.push(date.Dia)
    }
	return true
};
module.exports = {
    VerificarHorario,
}