const express = require('express')
const author = require('../models/author.js')
const router = express.Router()
const Author = require('../models/author.js')

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

module.exports = router