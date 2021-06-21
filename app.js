const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const routes = require('./routes')

require('./config/mongoose.js')
require('handlebars-helpers')()

const app = express()
const port = 3000

// Set handlebars
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
// as body-parser
app.use(express.urlencoded({ extended: true }))
// method-override
app.use(methodOverride('_method'))
// routes
app.use(routes)

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})
