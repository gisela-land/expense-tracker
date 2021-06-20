const mongoose = require('mongoose')
const Category = require('../category.js')

const cateArray = [
  { name: '家居物業', icon: '<i class="fas fa-home" style="color: lightskyblue;"></i>' },
  { name: '交通出行', icon: '<i class="fas fa-shuttle-van" style="color: lightskyblue;"></i>' },
  { name: '休閒娛樂', icon: '<i class="fas fa-grin-beam" style="color: lightskyblue;"></i>' },
  { name: '餐飲食品', icon: '<i class="fas fa-utensils" style="color: lightskyblue;"></i>' },
  { name: '其他 ', icon: '<i class="fas fa-pen" style="color: lightskyblue;"></i>' },
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
