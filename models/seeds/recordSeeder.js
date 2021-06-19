const mongoose = require('mongoose')
const Record = require('../record.js')

const recArray = [
  { name: '午餐', category: '餐飲食品', date: '2019-04-23', amount: 60 },
  { name: '晚餐', category: '餐飲食品', date: '2019-04-23', amount: 60 },
  { name: '捷運', category: '交通出行', date: '2019-04-23', amount: 120 },
  { name: '電影：驚奇隊長', category: '休閒娛樂', date: '2019-04-23', amount: 220 },
  { name: '租金', category: '家居物業', date: '2019-04-01', amount: 25000 },
]

mongoose.connect('mongodb://localhost/Expense', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected.')
  Record.create(
    recArray
  ).then(() => {
    console.log('insert DB done.')
    return db.close()
  }).then(() => {
    console.log('close DB connection done.')
  })
})
