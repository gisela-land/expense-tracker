const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')

const Record = require('./models/record.js')
const Category = require('./models/category.js')

const app = express()
const port = 3000
let hasPulledCategory = false
let pulledCategory = []

function compareCategory(records) {
  // console.log('@@@ hasPulledCategory = ', hasPulledCategory)
  if (!hasPulledCategory) {
    return Category.find()
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

app.get('/', (req, res) => {
  let totalAmount = 0
  return Record.find()
    .lean()
    .then((records) => {
      // console.log('records[0] = ', records[0])
      for (let i = 0; i < records.length; i++) {
        totalAmount += records[i].amount
        records[i].date = records[i].date.toDateString()
      }
      return compareCategory(records)
    }).then((records) => {
      // console.log('*** records[0] = ', records[0])
      res.render('index', { records: records, totalAmount: totalAmount })
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

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})
