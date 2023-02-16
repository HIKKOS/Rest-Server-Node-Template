/**
 * @swagger
 * components:
 *  securitySchemes:
 *    JWT:    
 *      type: apiKey
 *      in: header
 *      name: x-token
 *  security:
 *     - JWT: [] 
 *  schemas:
 *    Alumno:
 *      type: object
 *      properties:
 *        Id:
 *          type: string
 *          description: id del alumno
 *        TutorId:
 *          type: string
 *          description: id del tutor
 *        Nombres:
 *          type: string
 *          description: nombre del alumno
 *        ApellidoMaterno:
 *          type: string
 *          description: apellido materno del alumno
 *        ApellidoPaterno:
 *          type: string
 *          description: apellido paterno del alumno
 *        Grado:
 *          type: string
 *          description: grado del alumno
 *        Grupo:
 *          type: string
 *          description: grupo del alumno
 *        Genero:
 *          type: string
 *          description: Genero del alumno
 *      required: 
 *        - Nombres
 *        - ApellidoMaterno
 *        - Grado
 *        - Grupo
 *        - Genero
 *      example:
 *        TutorId: "0cc4d2d1-9375-4292-94ad-e08954aeaa5e"
 *        Nombres: "Jhoan"
 *        ApellidoMaterno: "Aguilar"
 *        ApellidoPaterno: "Perez"
 *        Grado: "5"
 *        Grupo: "A"
 *    Servicio:
 *      type: object
 *      properties:
 *        Nombre:
 *          type: string
 *          description: nombre del servicio
 *        Prioritario:
 *          type: boolean
 *          description: bandera para saber si un servicio se puede cancelar
 *        Descripcion:
 *          type: string
 *          description: descripcion del servicio
 *        FechaPago:
 *          type: integer
 *          format: int64
 *          description: fecha del mes cuando se cobrará
 *        Precio:
 *          type: number
 *          format: float
 *          description: costo del serivicio
 *    Tutor:
 *      type: object
 *      properties:
 *        Id:
 *          type: string
 *          description: id del tutor
 *        Nombres:
 *          type: string
 *          description: nombre del tutor
 *        ApellidoMaterno:
 *          type: string
 *          description: apellido materno del tutor
 *        ApellidoPaterno:
 *          type: string
 *          description: apellido paterno del tutor
 *        Correo:
 *          type: string
 *          description: correo del tutor
 *        Telefono:
 *          type: string
 *          description: telefono del tutor
 *        RFC:
 *          type: string
 *          description: RFC del tutor
 *        PasswordTutor:
 *          type: string
 *          description: contraseña del tutor
 *        Direccion:
 *          type: string
 *          description: direccion del tutor
 *        Activo:
 *          type: boolean
 *          description: estado del tutor
 *        MetodoPago:
 *          type: string
 *          description: metodo de pago del tutor
 *      required: 
 *        - Id	
 *        - Nombres
 *        - ApellidoMaterno
 *        - ApellidoPaterno
 *        - Correo
 *        - Telefono
 *        - PasswordTutorrequired: 
 *        - Id	
 *        - Nombres
 *        - ApellidoMaterno
 *        - ApellidoPaterno
 *        - Correo
 *        - Telefono
 *        - PasswordTutor
 *      example:
 *        Id: abc12
 *        Nombres: "Juan"
 *        ApellidoMaterno: "Perez"
 *        ApellidoPaterno: "Perez"
 *        Correo: "juan@gmail.com"
 *        Telefono: "1234567890"
 *        PasswordTutor: "abc12345"
 * /api/tutores:
 *   post:
 *     security:
 *       - JWT: [] 
 *     summary: crear tutor
 *     tags: [Tutor]
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/Tutor'
 *     responses:
 *       200:
 *          description: tutor creado
 *       400:
 *         description: tutor no creado
 *   put:
 *     tags: [Tutor]
 *     summary: Actualiza un tutor
 *     description: Actualiza un tutor con su id
 *     operationId: ActualizarTutor
 *     requestBody:
 *       description: Actualiza un tutor con su id
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/Tutor'
 *       required: true
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *             type: object
 *             $ref: '#/components/schemas/Tutor'
 *       '400':
 *         description: Error de id
 *       '404':
 *         description: Tutor no econtrado
 *     security:
 *       - JWT: [] 
 *   delete:
 *     tags: [Tutor]
 *     security:
 *       - JWT: [] 
 *     summary: Elimina un tutor 
 *     description: Elimina un tutor 
 *   get:
 *     tags:
 *       - Tutor
 *     summary: Busca tutor por Id o trae todos
 *     description: Returna un tutor
 *     operationId: getTutorById
 *     parameters:
 *       - name: Id
 *         in: query
 *         description: ID del tutor
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tutor'          
 *       '400':
 *         description: ID no valido
 *       '404':
 *         description: Tutor no encontrado
 *     security:
 *       - JWT: [] 
 * /api/alumnos:
 *   post:
 *     security:
 *       - JWT: [] 
 *     summary: crear alumno
 *     tags: [alumno]
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/Alumno'
 *     responses:
 *       200:
 *          description: alumno creado
 *       400:
 *         description: alumno no creado
 *   put:
 *     tags: [alumno]
 *     summary: Edita un alumno 
 *     description: Edita un alumno 
 *     requestBody:
 *       description: Actualiza un alumno con su id
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/Alumno'
 *       responses:
 *         '200':
 *           description: Successful operation
 *           content:
 *             application/json:
 *               schema:
 *               type: object
 *               $ref: '#/components/schemas/Tutor'
 *         '400':
 *           description: Error de id
 *         '404':
 *           description: Tutor no econtrado
 *     security:
 *       - JWT: [] 
 *   delete:
 *     securrity:
 *       - JWT: []
 *     tags: [alumno]
 *     summary: Elimina un  alumno 
 *     description: Elimina un  alumno 
 *   get:
 *     tags:
 *       - alumno
 *     summary: Busca alumno por Id o trae todos
 *     description: Returna un alumno
 *     operationId: getTutorById
 *     parameters:
 *       - name: Id
 *         in: query
 *         description: ID del alumno
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/alumno'          
 *       '400':
 *         description: ID no valido
 *       '404':
 *         description: alumno no encontrado
 *     security:
 *       - JWT: []
 * /api/servicios:
 *   post:
 *     security:
 *       - JWT: [] 
 *     summary: crear servicio
 *     tags: [servicio]
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/Servicio'
 *     responses:
 *       200:
 *          description: servicios creado
 *       400:
 *         description: servicios no creado
 *   put:
 *     tags: [servicio]
 *     summary: Edita un servicio
 *     description: Edita un servicio 
 *     requestBody:
 *       description: Actualiza un servicios con su id
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/Servicio'
 *       responses:
 *         '200':
 *           description: Successful operation
 *           content:
 *             application/json:
 *               schema:
 *               type: object
 *               $ref: '#/components/schemas/Servicio'
 *         '400':
 *           description: Error de id
 *         '404':
 *           description: Tutor no econtrado
 *     security:
 *       - JWT: [] 
 *   delete:
 *     securrity:
 *       - JWT: []
 *     tags: [servicio]
 *     summary: Elimina un  servicio 
 *     description: Elimina un  servicio 
 *   get:
 *     tags: [servicio]
 *     summary: Busca servicio por Id o trae todos
 *     description: Returna un servicio
 *     operationId: getTutorById
 *     parameters:
 *       - name: Id
 *         in: query
 *         description: ID del servicio
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Servicio'          
 *       '400':
 *         description: ID no valido
 *       '404':
 *         description: servicio no encontrado
 *     security:
 *       - JWT: []
*/