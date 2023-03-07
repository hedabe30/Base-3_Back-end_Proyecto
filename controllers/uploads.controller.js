const path = require('path');

const uploadFiles = (req, res) => {

  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).json({msg: 'No hay archivos para subir.'});
    return;
  }

  if (!req.files.file) {
    res.status(400).json({msg: 'No hay archivos para subir.'});
    return;
  }



  const { file } = req.files;

  uploadPath = path.join( __dirname, '../uploads/', file.name);

  file.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).json({ err });
    }

    res.json({msg: 'File uploaded to ' + uploadPath});
  });

}

module.exports = {
  uploadFiles
}