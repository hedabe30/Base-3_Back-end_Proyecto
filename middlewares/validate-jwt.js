const jwt = require('jsonwebtoken');

const Usuario = require('../database/models/user');

const validateJWT = async (req, res, next) => {

  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      msg: 'No hay token en la petición'
    })
  }

  try {
    
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    // console.log(result);
    const authenticatedUser = await Usuario.findById(uid);
    
    //Verifica si el usuario existe
    if (!authenticatedUser) {
      return res.status(401).json({
        msg: 'token no válido'
      }); 
    }
    
    //Verificar si el usuario esta activo
    if (!authenticatedUser.status) {
      return res.status(401).json({
        msg: 'token no válido'
      }); 
    }


    req.authenticatedUser = authenticatedUser;

    next();

  } catch (error) {
    console.log(error)
    res.status(401).json({
      msg: 'token no válido'
    }); 
  }
}

module.exports = {
  validateJWT
}