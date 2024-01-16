const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(cors())

const Note = require('./models/note')
//use builtin static middleware to make express show static content of the frontend
app.use(express.static('dist'))

const requestLogger = (request, response, next) => {
    console.log('Method: ', request.method)
    console.log('path: ', request.path)
    console.log('Body: ', request.body)
    console.log('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(requestLogger)

{/*let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]
*/}

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (req, res) => {
    Note.find({}).then(notes => {
        res.json(notes)
    })
})

{/*
app.get('/app/notes/:id', (req, res) => {
    const id = Number(req.params.id)

    const note = notes.find(note => note.id === id)

    if(note){
        res.json(note)
    } else {
        res.status(404).end()
    }
})
*/}

// fetching note from mongo using findById
app.get('api/notes/:id', (req, res) => {
    Note.findById(req.params.id).then(note => {
        res.json(note)
    })
})

app.delete('/app/notes/:id', (req, res) => {
    const id = Number(req.params.id)

    notes = notes.filter(note => note.id !== id)

    res.status(204).end()
})

const generateId = () => {
    const maxId = notes.length > 0
                    ? Math.max(...notes.map(n => n.id))
                    : 0
    return maxId + 1
}

{/*app.post('/app/notes', (req, res) => {
    const body = req.body

    if(!body.content){
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId()
    }

    notes = notes.concat(note)

    res.json(note)
})
*/}
// post using mongodb for the data rendering 
app.post('/api/notes', (req, res) => {
    const body = req.body

    if (body.content === undefined) {
        return res.status(400).json({ error: 'Content missing' })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false
    })

    note.save().then(savedNote => {
        res.json(savedNote)
    })
})

app.use(unknownEndpoint)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})