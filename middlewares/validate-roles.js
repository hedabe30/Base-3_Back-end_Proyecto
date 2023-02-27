

const sadminRole = (req, res, next) => {
  // console.log(req.authenticatedUser)

  if (!req.authenticatedUser) {
    return res.status(500).json({
      msg: 'Se quiere verificar el rol sin validar el token primero'
    }); 
  }

  const { role, name} = req.authenticatedUser;

  if (role !== 'SADMIN_ROLE') {
    return res.status(500).json({
      msg: `${name} no es un usuario super-administrador`
    }); 
  }

  next();
}

const validateRole = ( ...roles ) => {


  
  return (req, res ,next) => {

    if (!req.authenticatedUser) {
      return res.status(500).json({
        msg: 'Se quiere verificar el rol sin validar el token primero'
      }); 
    }

    const { role } = req.authenticatedUser;

    if ( !roles.includes( role )) {
      return res.status(401).json({
        msg: `El servicio requiere uno de los siguientes roles ${ roles }`
      });
    }

    next();
  }

}

module.exports = {
  sadminRole,
  validateRole
}