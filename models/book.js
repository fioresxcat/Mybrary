const mongoose = require('mongoose')
const path = require('path')
const coverImageBasePath = 'uploads/bookCovers'

const bookSchema = mongoose.Schema({
    title: {
        type: String,
        requires: true
    },
    description: {
        type: String
    },
    publishDate: {
        type: Date,
        required:true
    },
    pageCount: {
        type: Number,
        required:true
    },
    createdAt: {
        type: Date,
        required:true,
        default: Date.now()
    },
    coverImageName: { // we dont want to store image in our database. We stored it in our server instead
        type: String, 
        required:true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, // indicate that this field is referencing to another object in our database
        required: true,
        re: 'Author' // we're referencing to the Author object
    }
})

bookSchema.virtual('coverImagePath').get(function() {
    if(this.coverImageName != null) {
        return path.join('/', coverImageBasePath, this.coverImageName)
    }
})

module.exports = mongoose.model('book', bookSchema)
module.exports.coverImageBasePath = coverImageBasePath