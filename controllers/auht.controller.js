const { request,response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../database/models/user')
const { generateJWT } = require('../utils/generate-jwt');
const { googleVerify } = require('../utils/google-verify');

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

const googleSignIn = async (req, res) => {
  const { id_token } = req.body;

  try {

    const { name, img, email } = await googleVerify(id_token);

    let user = await User.findOne({ email });

    if (!user) {
      //Crear usuario
      const data = {
        name,
        email,
        img,
        password: ':P',
        google: true,
        role: 'USER_ROLE'
      }
      
      user = new User(data);
      await user.save();
      
    }

    //Si el usuario esta deshabilitado
    if (!user.status) {
      return res.status(401).json({
        msg: "Hablar con el administrador, usuario bloqueado",
      });
    }

    //Generar JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token
    });

  } catch (error) {
    res.status(400).json({
      status: false,
      msg: 'El token no se pudo verificar',
    });
  }

}

const validateToken = async (req, res) => {

  const { authenticatedUser } = req

  const token = await generateJWT(authenticatedUser.id);

  res.json({
    user: authenticatedUser,
    token
  });
}

module.exports = {
  login,
  googleSignIn,
  validateToken
}