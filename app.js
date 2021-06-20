const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')

const Record = require('./models/record.js')
const Category = require('./models/category.js')

require('handlebars-helpers')()

const app = express()
const port = 3000
let hasPulledCategory = false
let pulledCategory = []

function compareCategory(records) {
  console.log('@@@ hasPulledCategory = ', hasPulledCategory)
  if (!hasPulledCategory) {
    return Category.find()
      .lean()
      .then((categories) => {
        pulledCategory = categories
        // console.log('*** pulledCategory = ', pulledCategory)
        for (let i = 0; i < records.length; i++) {
          for (let j = 0; j < categories.length; j++) {
            if (records[i].category === categories[j].name) {
              records[i].category = categories[j].icon
            }
          }
        }
        hasPulledCategory = true
        return records
      })
      .catch((error) => console.log(error))
  } else {
    for (let i = 0; i < records.length; i++) {
      for (let j = 0; j < pulledCategory.length; j++) {
        if (records[i].category === pulledCategory[j].name) {
          records[i].category = pulledCategory[j].icon
        }
      }
    }
    return records
  }
}

mongoose.connect('mongodb://localhost/Expense', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
  let totalAmount = 0
  const filterBy = req.query.filterBy || ''

  return Record.find({ category: { $regex: filterBy } })
    .lean()
    .sort({ date: 'desc' })
    .then((records) => {
      // console.log('records[0] = ', records[0])
      for (let i = 0; i < records.length; i++) {
        totalAmount += records[i].amount
      }
      return compareCategory(records)
    }).then((records) => {
      return res.render('index', { records: records, totalAmount: totalAmount, filterBy: filterBy })
    })
    .catch((error) => console.log(error))
})

app.get('/records/new', (req, res) => {
  return res.render('new')
})

app.post('/records', (req, res) => {
  // console.log('*** req.body = ', req.body)
  return Record.create(req.body)
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error))
})

app.get('/records/:id/edit', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .lean()
    .then((record) => res.render('edit', { record: record }))
    .catch((error) => console.log(error))
})

app.put('/records/:id', (req, res) => {
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

app.delete('/records/:id', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .then((record) => record.remove())
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error))
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})
