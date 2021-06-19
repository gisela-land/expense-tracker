const mongoose = require('mongoose')
const Category = require('../category.js')

const cateArray = [
  { name: '家居物業', icon: '<i class="fas fa-home"></i>' },
  { name: '交通出行', icon: '<i class="fas fa-shuttle-van"></i>' },
  { name: '休閒娛樂', icon: '<i class="fas fa-grin-beam"></i>' },
  { name: '餐飲食品', icon: '<i class="fas fa-utensils"></i>' },
  { name: '其他 ', icon: '<i class="fas fa-pen"></i>' },
]

mongoose.connect('mongodb://localhost/Expense', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected.')
  Category.create(
    cateArray
  ).then(() => {
    console.log('insert DB done.')
    return db.close()
  }).then(() => {
    console.log('close DB connection done.')
  })
})
