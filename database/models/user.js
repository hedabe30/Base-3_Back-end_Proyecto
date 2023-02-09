const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio']
  },
  email: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    unique:true
  },
  password: {
    type: String,
    required: [true, 'El contraseña es obligatoria']
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    emun: ['ADMIN_ROLE', 'USER_ROLE']
  },
  status: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

UsuarioSchema.methods.toJSON = function() {
  const { __v, password, ...user} = this.toObject();
  return user;
}

module.exports = model('User', UsuarioSchema);