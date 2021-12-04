const express = require('express')
const router = express.Router()
const path = require('path')
const multer = require('multer')
const fs = require('fs') // file system

const Author = require('../models/author.js')
const Book = require('../models/book.js')

const uploadPath = path.join('public', Book.coverImageBasePath) // file upload từ client sẽ được lưu vào thư mục này trong server
const imageMimeTypes = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

// all books route
router.get('/', async (req, res) => {
    let query = Book.find()

    if(req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if(req.query.publishAfter != null && req.query.publishAfter != '') {
        query = query.gte('publishDate', req.query.publishAfter)
    }
    if(req.query.publishBefore != null && req.query.publishBefore != '') {
        query = query.lte('publishDate', req.query.publishBefore)
    }

    try {
        const books = await query.exec()
        res.render('./books/index', {
            books: books,
            searchOptions: req.query
        })
    } catch(err) {
        console.log(err)
        res.redirect('/')
    }
})

// display form for creating new book
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book())
})

// actually creating new book
router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
    })

    try {
        const newBook = await book.save()
        // res.redirect(`/books/${newBook.id}`)
        res.redirect('/books')
    } catch (err) {
        console.log(err)
        removeBookCover(book.coverImageName)
        renderNewPage(res, book, true)
    }
})

function removeBookCover(coverName) {
    fs.unlink(path.join(uploadPath, coverName), err => {
        if(err) console.error(err)
    })
}

async function renderNewPage(res, book, hasError=false) {
    const params = {
        book: book, 
        authors : await Author.find({})
    }
    if(hasError) params.errorMessage = 'Error Creating Book'

    try {
        res.render('./books/new', params)
    } catch (err) {
        console.log(err)
        res.redirect('/books')
    }
}

module.exports = router