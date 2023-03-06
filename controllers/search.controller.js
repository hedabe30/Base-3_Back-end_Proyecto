const { ObjectId } = require('mongoose').Types
const { User, Category, Product } = require('../database/models');

const collectionsAllowed = [
  'products',
  'categories',
  'users',
  'roles'
]

const searchUser = async (term = '', res) => {
  const isMongoId = ObjectId.isValid(term); //True

  if (isMongoId) {
    const user = await User.findById(term);
    return res.json({
      results: (user) ? [ user ] : []
    })
  }

  const regex = new RegExp(term, 'i');  //expresión regular que vuelve insensible a mayusculas y minusculas

  const users = await User.find({
    $or: [ {name: regex}, {email: regex} ],
    $and: [ {status: true} ]
  })
  
  const total = await User.count({
    $or: [ {name: regex}, {email: regex} ],
    $and: [ {status: true} ]
  })
  
  res.json({
    total,
    results: users
  })
}

const searchCategories = async (term = '', res) => {
  const isMongoId = ObjectId.isValid(term); //True

  if (isMongoId) {
    const category = await Category.findById(term);
    return res.json({
      results: (category) ? [ category ] : []
    })
  }

  const regex = new RegExp(term, 'i');  //expresión regular que vuelve insensible a mayusculas y minusculas

  const categories = await Category.find({ name: regex, status:true })
  
  const total = await Category.count({ name: regex, status:true })
  
  res.json({
    total,
    results: categories
  })
}

const searchProducts = async (term = '', res) => {
  const isMongoId = ObjectId.isValid(term); //True

  if (isMongoId) {
    const product = await Product.findById(term).populate('category', 'name');
    return res.json({
      results: (product) ? [ product ] : []
    })
  }

  const regex = new RegExp(term, 'i');  //expresión regular que vuelve insensible a mayusculas y minusculas

  const products = await Product.find({ name: regex, status:true })
                                .populate('category', 'name')
  
  const total = await Product.count({ name: regex, status:true })
  
  res.json({
    total,
    results: products
  })
}

const search = (req, res) => {

  const { collection, term } = req.params;

  if ( !collectionsAllowed.includes(collection) ){
    return res.status(400).json({
      msg:`Las colecciones permitidas son: ${collectionsAllowed}`
    });
  }

  switch (collection) {
    case 'categories':
      searchCategories(term, res);
      break;
    case 'products':
      searchProducts(term, res);
      break;
    case 'users':
      searchUser(term, res);
      break;

    default:
      res.status(500).json({
        msg: 'Aun no implementado'
      })
      break;
  }

}

module.exports = {
  search
}