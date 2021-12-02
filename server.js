if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')

const indexRouter = require('./routes/index.js')
mongoose.connect(process.env.DATABASE_URL)
const connection = mongoose.connection
connection.on('error', error => console.error(error))
connection.once('open', () => console.log('Connected to MongoDB!'))

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views') // mọi view sẽ ở trong thư mục này
app.set('layout', 'layouts/layout') // mọi layout sẽ ở trong file này
app.use(expressLayouts)
app.use(express.static('public')) // các file tĩnh được public trong project
app.use('/', indexRouter)

app.listen(process.env.PORT || 3000)