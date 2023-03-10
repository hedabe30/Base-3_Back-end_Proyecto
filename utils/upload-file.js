const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFile = (files, validExtension = [ 'png', 'jpg', 'jpeg', 'gif' ], folder = '') => {

  return new Promise((resolve, reject) => {

    const { file } = files;
  
    const cutName = file.name.split('.');
    const extension = cutName[cutName.length - 1];
  
    //Validar extension, extensiones permitidas
  
    if (!validExtension.includes(extension)) {
      return reject(`La extension ${extension} no es permitida - ${validExtension}`)
    }
  
    const tempName = uuidv4() + '.' + extension; 
    const uploadPath = path.join( __dirname, '../uploads/', folder, tempName);
  
    file.mv(uploadPath, (err) => {
      if (err) {
        return reject(err)
      }
  
      resolve(tempName);
    });
  })
};

module.exports = {
  uploadFile
}