const { request,response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../database/models/user');

const getUsers = (req = request, res = response) => {
  res.json({
    msg: 'get API - Controlador'
  })
}

const getUser = (req = request, res = response) => {
  res.json({
    msg: 'get API - getUser'
  })
}

const putUser = (req = request, res = response) => {

  const { id } = req.params;

  res.json({
    msg: 'put API',
    id
  })
}

const createUser = async (req = request, res = response) => {
  const { name, email, password, role } = req.body;

  const usuario = new Usuario({name, email, password, role});

  //Verificar si el correo existe
  const mailValidation = await Usuario.findOne({ email });

  if ( mailValidation ) {
    return res.status(400).json({
      msg: 'El correo ya se encuentra registrado'
    })
  }

  //Encriptar contraseña
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);


  //Guardar en DB

  await usuario.save();

  res.status(201).json({
    usuario
  })
}

const deleteUser = (req = request, res = response) => {
  res.json({
    msg: 'delete API'
  })
}

module.exports = {
  getUsers,
  getUser,
  putUser,
  createUser,
  deleteUser
}