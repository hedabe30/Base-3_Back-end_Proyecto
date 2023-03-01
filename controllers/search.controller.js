

const collectionsAllowed = [
  'products',
  'categories',
  'users',
  'roles'
]

const search = (req, res) => {

  const { collection, term } = req.params;

  if ( !collectionsAllowed.includes(collection) ){
    return res.status(400).json({
      msg:`Las colecciones permitidas son: ${collectionsAllowed}`
    });
  }


  return res.json({
    msg: 'Buscar...',
    collection,
    term
  });
}

module.exports = {
  search
}