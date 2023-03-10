const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL)

const { uploadFile } = require("../utils");

const { User, Product } = require('../database/models')


const uploadFiles = async (req, res) => {

  if (!req.files.file) {
    res.status(400).json({msg: 'No hay archivos para subir.'});
    return;
  }

  try {
    // const name = await uploadFile(req.files, ['txt', 'md'], 'textos');
    const name = await uploadFile(req.files);
    res.json({name});
  } catch (msg) {
    res.status(400).json({msg})
  }

}

const updateImage = async (req, res) => {

  const { id, collection } = req.params

  let model;

  switch (collection) {
    case 'users':
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe el usuario con id: ${id}`
        });
      } 

      break;

    case 'products':
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe el producto con id: ${id}`
        });
      } 

      break;
  
    default:
      return res.status(500).json({msg: 'Sin desarrollar'})
  }

  //Limpiar imagenes existentes
  if (model.img) {
    //Hay que borrar la imagen del servidor
    const arrName = model.img.split('/');
    const name = arrName[arrName.length - 1];
    const [ public_id ] = name.split('.');
    cloudinary.uploader.destroy( public_id );
  }

  const { tempFilePath } = req.files.file;

  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
  
  // const name = await uploadFile(req.files, undefined, collection);
  model.img = secure_url

  await model.save();

  res.json(model)
}

module.exports = {
  uploadFiles,
  updateImage
}