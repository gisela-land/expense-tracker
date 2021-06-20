const express = require('express')
const router = express.Router()

const Record = require('../../models/record.js')
const Category = require('../../models/category.js')

function compareCategory(records) {
  return Category.find()
    .lean()
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
    .catch((error) => console.log(error))
}

router.get('/', (req, res) => {
  let totalAmount = 0
  const filterBy = req.query.filterBy || ''

  return Record.find({ category: { $regex: filterBy } })
    .lean()
    .sort({ date: 'desc' })
    .then((records) => {
      for (let i = 0; i < records.length; i++) {
        totalAmount += records[i].amount
      }
      return compareCategory(records)
    }).then((records) => {
      return res.render('index', { records: records, totalAmount: totalAmount, filterBy: filterBy })
    })
    .catch((error) => console.log(error))
})

module.exports = router
