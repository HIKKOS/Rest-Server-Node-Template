const checkSubscription = (req, res, next) => {
    // Obtener el usuario de la base de datos
    const user = getUserFromDatabase(req.userId);
    
    // Obtener la fecha actual
    const currentDate = new Date();
    
    // Comprobar si la suscripción ha expirado
    if (currentDate > user.subscriptionEndDate) {
      // La suscripción ha expirado, enviar una respuesta con un estado 402 Payment Required
      return res.status(402).json({ error: 'Payment Required' });
    }
    
    // La suscripción está activa, continuar con la solicitud
    next();
  };
  