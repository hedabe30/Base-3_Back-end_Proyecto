const { request,response } = require('express');

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

const createUser = (req = request, res = response) => {
  const { nombre, edad } = req.body;

  res.status(201).json({
    msg: 'post API',
    nombre,
    edad
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