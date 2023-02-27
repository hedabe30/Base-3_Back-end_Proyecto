const { Product } = require('../database/models')


//OBTENER CATEGORIAS (paginado y total)
const getProducts = async (req, res) => {
  
  const { limit = 5, page = 0 } = req.query
  const query = {status: true}

  const [ total, products] = await Promise.all([
    Product.countDocuments(query),

    Product.find(query)
    .populate('user', 'name')
    .populate('category', 'name')
    .skip(limit * (+page - 1))
    .limit(+limit),
  ]);

  res.json({
    total,
    products
  })
}

//OBTENER CATEGORIA
const getProduct = async (req, res) => {

  const { id } = req.params;
  const product = await Product.findById(id)
    .populate('user', 'name')
    .populate('category', 'name');

  res.json(product);
}

//CREAR CATEGORIA
const createProduct = async (req, res) => {

  let { name, user, status, ...body } = req.body

  //Verificar si no existe en db
  const productDB = await Product.findOne({ name });

  if ( productDB ) {
    return res.status(400).json({
      msg: `El producto ${name} ya existe`
    });
  }

  //Generar la data para guardar
  const data = {
    ...body,
    name: name.toUpperCase(),
    user: req.authenticatedUser._id
  }

  const product = new Product(data);

  //Guardar en db
  await product.save();

  return res.status(201).json({
    product
  });
}

//Actualizar Categoria
const updateProduct = async (req, res) => {

  const { id } = req.params;
  const { status, user, ...data} = req.body;

  if (data.name) data.name = data.name.toUpperCase();
  data.user = req.authenticatedUser._id;

  const product = await Product.findByIdAndUpdate( id, data, { new: true });

  res.json( product );
}

//Desactivar Categoria
const deleteProduct = async (req, res) => {

  const { id } = req.params;

  const product = await Product.findByIdAndUpdate( id, { status: false }, { new: true });

  res.json( product );
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
}