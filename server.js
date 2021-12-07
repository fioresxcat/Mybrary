if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override') 
const indexRouter = require('./routes/index.js')
const authorRouter = require('./routes/authors.js')
const bookRouter = require('./routes/books.js')

// for mongodb connection
mongoose.connect(process.env.DATABASE_URL)
const connection = mongoose.connection
connection.on('error', error => console.error(error))
connection.once('open', () => console.log('Connected to MongoDB!'))

app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views') // mọi view sẽ ở trong thư mục này
app.set('layout', 'layouts/layout') // mọi layout sẽ ở trong file này
app.use(expressLayouts)
app.use(express.static('public')) // các file tĩnh được public trong project
app.use(methodOverride('_method'))
app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/books', bookRouter)

app.listen(process.env.PORT || 3000)