const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')

const Record = require('./models/record.js')
const Category = require('./models/category.js')

const app = express()
const port = 3000

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

app.get('/', (req, res) => {
  let totalAmount = 0
  return Record.find()
    .lean()
    .then((records) => {
      // console.log('records[0] = ', records[0])
      for (let i = 0; i < records.length; i++) {
        totalAmount += records[i].amount
      }

      return Category.find()
        .then((categories) => {
          for (let i = 0; i < records.length; i++) {
            for (let j = 0; j < categories.length; j++) {
              if (records[i].category === categories[j].name) {
                records[i].category = categories[j].icon
              }
            }
          }
          return records
        })
    }).then((records) => {
      // console.log('*** records[0] = ', records[0])
      res.render('index', { records: records, totalAmount: totalAmount })
    })
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})
