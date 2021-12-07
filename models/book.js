const mongoose = require('mongoose')

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
    coverImage: { 
        type: Buffer, 
        required:true
    },
    coverImageType: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, // indicate that this field is referencing to another object in our database
        required: true,
        ref: 'Author' // we're referencing to the Author object
    }
})

bookSchema.virtual('coverImagePath').get(function() {
    if(this.coverImage != null && this.coverImageType != null) {
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})

module.exports = mongoose.model('book', bookSchema)