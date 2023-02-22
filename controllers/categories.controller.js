const { Category } = require('../database/models')


//OBTENER CATEGORIAS (paginado y total)
const getCategories = async (req, res) => {
  
  const { limit = 5, page = 0 } = req.query
  const query = {status: true}

  const [ total, categories] = await Promise.all([
    Category.countDocuments(query),

    Category.find(query)
    .populate('user', 'name')
    .skip(limit * (+page - 1))
    .limit(+limit),
  ]);

  res.json({
    total,
    categories
  })
}

//OBTENER CATEGORIA
const getCategory = async (req, res) => {

  const { id } = req.params;
  const category = await Category.findById(id)
    .populate('user', 'name');

  res.json(category);
}


//CREAR CATEGORIA
const createCategory = async (req, res) => {

  const name = req.body.name.toUpperCase();

  //Verificar si no existe en db
  const categoryDB = await Category.findOne({ name });

  if ( categoryDB ) {
    return res.status(400).json({
      msg: `La categoria ${name} ya existe`
    });
  }

  //Generar la data para guardar
  const data = {
    name,
    user: req.authenticatedUser._id,
  }

  const category = new Category(data);

  //Guardar en db
  await category.save();

  return res.status(201).json({
    category
  });
}

//Actualizar Categoria
const updateCategory = async (req, res) => {

  const { id } = req.params;
  const { status, user, ...data} = req.body;

  data.name = data.name.toUpperCase();
  data.user = req.authenticatedUser._id;

  const category = await Category.findByIdAndUpdate( id, data, { new: true });

  res.json( category );
}

//Desactivar Categoria
const deleteCategory = async (req, res) => {

  const { id } = req.params;

  const category = await Category.findByIdAndUpdate( id, { status: false }, { new: true });

  res.json( category );
}

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
}