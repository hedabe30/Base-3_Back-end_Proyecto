const { request,response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../database/models/user')
const { generateJWT } = require('../utils/generate-jwt')

const login = async (req = request, res = response) => {

  const { email, password } = req.body;

  try {

    //Verificar si el Email existe
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        status: 'fail',
        msg: 'Usuario/password incorrectos - email'
      })
    }

    //Verificar si el usuario esta activo
    if (!user.status) {
      return res.status(400).json({
        status: 'fail',
        msg: 'Usuario/password incorrectos - status: false'
      })
    }

    // Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        status: 'fail',
        msg: 'Usuario/password incorrectos - password'
      })
    }

    //Generar JWT
    const token =  await generateJWT(user.id);

    res.json({
      user,
      token
    })
    
  } catch (error) {
    console.log(error);
    
    res.status(500).json({
      status: 'fail',
      msg: 'Fallo'
    })
  }
}

module.exports = {
  login
}