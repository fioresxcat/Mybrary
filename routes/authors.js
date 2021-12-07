const express = require('express')
const author = require('../models/author.js')
const router = express.Router()
const Author = require('../models/author.js')
const Book = require('../models/book.js')

// all authors route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if(req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }

    try {
        const authors = await Author.find(searchOptions)
        res.render('./authors/index', { authors: authors, searchOptions: req.query})
    } catch(err) {
        res.redirect('/')
    }
})

// display form for creating new author
// this must be put before the get 'authors/:id' method, because the server will look for valid url from top to bottom
router.get('/new', (req, res) => {
    res.render('./authors/new', { author: new Author() })
})

// actually creating new author
router.post('/', async (req, res) => {
    let author = new Author({
        name: req.body.name
    })

    try {
        author = await author.save()
        res.redirect('/authors')
        // res.redirect(`/authors/${author.id}`)
    } catch (err) {
        console.log(err)
        res.render('./authors/new', { author: author, errorMessage: err })
    }
    // author.save((error, newAuthor) => {
    //     if(error) {
    //         res.render('./authors/new', {author: new Author, errorMessage: error})
    //     } else {
    //         // res.redirect(`/authors/${newAuthor.id}`)
    //         res.redirect('/authors')
    //     }
    // })
})

router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        const books =  await Book.find({author: author.id}).limit(6)
        res.render('./authors/show', {author: author, books: books})
    } catch(err) {
        console.log(err)
        res.redirect('/')
    }

})

router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        console.log(author.name)
        res.render('./authors/edit', {author: author})
    } catch(err) {
        console.log(err)
        res.redirect('/authors')
    }
})

router.put('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        author = await author.save()
        res.redirect(`/authors/${author.id}`)
    } catch (err) {
        if (author==null) {
            res.redirect('/')
        } else {
            console.log(err)
            res.render('./authors/new', { author: author, errorMessage: err })
        }   
    }
})

router.delete('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        await author.remove()
        res.redirect('/authors')
    } catch(err) {
        console.log(err)
        if (author==null) {
            res.redirect('/')
        } else {
            res.redirect(`/authors/${author.id}`)
        }
    }
})

module.exports = router