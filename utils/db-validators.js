const { Category, Product, Usuario, Role } = require('../database/models');

/**
 * Roles
*/
const roleIsValid = async (role = '') => {
  const roleExist = await Role.findOne({ role });
  if (!roleExist) {
    throw new Error(`El ${role} no esta registrado en base de datos`);
  }
}

/**
 * Usuarios
*/
//Verificar si el correo existe
const mailVerification = async (email = '') => {
  const mailValidation = await Usuario.findOne({ email });

  if ( mailValidation ) {
    throw new Error(`El ${email} ya se encuentra registrado`);
  }
}

const idMongoVerification = async (id) => {
  const idValidation = await Usuario.findById(id);

  if ( !idValidation ) {
    throw new Error(`El id: ${id} no existe`);
  }
}


/**
 * Categorias
*/
const categoryExist = async (id) => {
  const idValidation = await Category.findById(id);

  if ( !idValidation ) {
    throw new Error(`El id: ${id} no existe`);
  }
}

/**
 * Productos
*/
const productExist = async (id) => {
  const idValidation = await Product.findById(id);

  if ( !idValidation ) {
    throw new Error(`El id: ${id} no existe`);
  }
}

module.exports = {
  roleIsValid,
  mailVerification,
  idMongoVerification,
  categoryExist,
  productExist
}