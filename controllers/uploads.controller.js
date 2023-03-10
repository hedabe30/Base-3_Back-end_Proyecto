const path = require('path');
const fs = require('fs');

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
    const pathImage = path.join(__dirname, '../uploads', collection, model.img);
    if (fs.existsSync(pathImage)) {
      fs.unlinkSync( pathImage ); 
    }
  }

  const name = await uploadFile(req.files, undefined, collection);
  model.img = name

  await model.save();

  res.json(model)
}

const showImage = async (req, res) => {
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

  //Verificar si la imagen existe
  if (model.img) {
    const pathImage = path.join(__dirname, '../uploads', collection, model.img);
    if (fs.existsSync(pathImage)) {
      return res.sendFile(pathImage); 
    }
  }

  const pathImage = path.join(__dirname, '../assets/no-image.jpg');
  
  res.sendFile(pathImage)
}

module.exports = {
  uploadFiles,
  updateImage,
  showImage
}