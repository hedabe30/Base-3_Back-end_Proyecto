const { request,response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../database/models/user');

const getUsers = async (req = request, res = response) => {

  const { limit = 5, page = 0 } = req.query
  const query = {status: true}

  // const users = await Usuario.find(query)
  //   .skip(limit * (+page - 1))
  //   .limit(+limit);

  // const total = await Usuario.countDocuments(query)

  //Ejecuta las promesas anteriores en paralelo
  const [ total, users] = await Promise.all([
    Usuario.countDocuments(query),

    Usuario.find(query)
    .skip(limit * (+page - 1))
    .limit(+limit),
  ]);

  res.json({
    total,
    users
  })
}

const getUser = (req = request, res = response) => {
  res.json({
    users
  })
}

const putUser = async (req = request, res = response) => {

  const { id } = req.params;
  const { _id, password, google, email, ...info } = req.body;

  //Valdiar id con base de datos

  if (password) {
    const salt = bcryptjs.genSaltSync();
    info.password = bcryptjs.hashSync(password, salt);
  }

  const user = await Usuario.findByIdAndUpdate( id, info);

  res.json({
    msg: 'Actualización de usuario',
    user
  })
}

const createUser = async (req = request, res = response) => {
  const { name, email, password, role } = req.body;

  const user = new Usuario({name, email, password, role});

  //Encriptar contraseña
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);


  //Guardar en DB
  await user.save();

  res.status(201).json({
    user
  })
}

const deleteUser = async (req = request, res = response) => {
  const { id } = req.params;

  //Borrado total
  // const user = await Usuario.findByIdAndRemove( id );

  //Inactivar usuario
  const user = await Usuario.findByIdAndUpdate( id, { status: false } );



  res.json({
    user
  })
}

module.exports = {
  getUsers,
  getUser,
  putUser,
  createUser,
  deleteUser
}