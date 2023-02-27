const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

  constructor () {
    this.app = express();
    this.port = process.env.PORT || 3000;

    this.paths = {
      auth:   '/api/auth',
      categories: '/api/categories',
      products: '/api/products',
      users:  '/api/users',
    }

    //Conectar a base de datos
    this.connectDB();

    //Middlewares
    this.middlewares();

    //Rutas de la App
    this.routes();
  }

  async connectDB () {
    await dbConnection();
  }

  middlewares() {

    //cors
    this.app.use(cors());

    //Lectura y parseo del body
    this.app.use(express.json());

    //Directorio publico
    this.app.use(express.static('public'));

  }

  routes () {

    this.app.use(this.paths.auth, require('../routes/auth.routes'));
    this.app.use(this.paths.categories, require('../routes/categories.routes'));
    this.app.use(this.paths.products, require('../routes/products.routes'));
    this.app.use(this.paths.users, require('../routes/users.routes'));

  }

  listen () {
    this.app.listen(this.port, () => {
      console.log(`App listening on port ${this.port}`)
    })
  }

}

module.exports = Server;