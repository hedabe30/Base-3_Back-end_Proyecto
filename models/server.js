const express = require('express')
const cors = require('cors');
const morgan = require('morgan')
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/socket.controller');

class Server {

  constructor () {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.server = require('http').createServer( this.app );
    this.io = require('socket.io')(this.server);

    this.paths = {
      auth:   '/api/auth',
      categories: '/api/categories',
      products: '/api/products',
      search: '/api/search',
      users:  '/api/users',
      uploads:  '/api/uploads',
    }

    //Conectar a base de datos
    this.connectDB();

    //Middlewares
    this.middlewares();

    //Rutas de la App
    this.routes();

    //Sockets
    this.sockets();
  }

  async connectDB () {
    await dbConnection();
  }

  middlewares() {

    //Mostrar peticiones
    this.app.use(morgan('tiny'));

    //cors
    this.app.use(cors());

    //Lectura y parseo del body
    this.app.use(express.json());

    //Directorio publico
    this.app.use(express.static('public'));

    //Uploads y carga de archivos
    this.app.use(fileUpload({
      useTempFiles : true,
      tempFileDir : '/tmp/',
      createParentPath : true,  //puede crear carpetas para guardar los archivos
    }));

  }

  routes () {

    this.app.use(this.paths.auth, require('../routes/auth.routes'));
    this.app.use(this.paths.categories, require('../routes/categories.routes'));
    this.app.use(this.paths.products, require('../routes/products.routes'));
    this.app.use(this.paths.search, require('../routes/search.routes'));
    this.app.use(this.paths.users, require('../routes/users.routes'));
    this.app.use(this.paths.uploads, require('../routes/uploads.routes'));

  }

  sockets() {
    this.io.on("connection", (socket) => socketController(socket, this.io));
  }

  listen () {
    this.server.listen(this.port, () => {
      console.log(`App listening on port ${this.port}`)
    })
  }

}

module.exports = Server;