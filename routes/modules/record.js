const express = require('express')
const router = express.Router()

const Record = require('../../models/record.js')
const Category = require('../../models/category.js')

router.get('/new', (req, res) => {
  return Category.find()
    .lean()
    .then((categories) => res.render('new', { categories: categories }))
    .catch((error) => console.log(error))
})

router.post('/', (req, res) => {
  return Record.create(req.body)
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error))
})

router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .lean()
    .then((record) => res.render('edit', { record: record }))
    .catch((error) => console.log(error))
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .then((record) => {
      record.name = req.body.name
      record.date = req.body.date
      record.category = req.body.category
      record.amount = req.body.amount
      return record.save()
    })
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error))
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .then((record) => record.remove())
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error))
})

module.exports = router
