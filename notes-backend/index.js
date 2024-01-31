const express = require("express")
const cors = require("cors")
require("dotenv").config()

const app = express()
app.use(express.json())
app.use(cors())

const Note = require("./models/note")
//use builtin static middleware to make express show static content of the frontend
app.use(express.static("dist"))

const requestLogger = (request, response, next) => {
  console.log("Method: ", request.method)
  console.log("path: ", request.path)
  console.log("Body: ", request.body)
  console.log("---")
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

//middleware for error handlng
const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(requestLogger)

{
  /*let notes = [
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
*/
}

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>")
})

app.get("/api/notes", (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes)
  })
})

{
  /*
app.get('/app/notes/:id', (req, res) => {
    const id = Number(req.params.id)

    const note = notes.find(note => note.id === id)

    if(note){
        res.json(note)
    } else {
        res.status(404).end()
    }
})
*/
}

// fetching note from mongo using findById
app.get("/api/notes/:id", (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) {
        res.json(note)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

// update data on MongoDB
app.put("/api/notes/:id", (req, res, next) => {
  const { content, important } = req.body

  Note.findByIdAndUpdate(
    req.params.id,
    { content, important },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedNote) => {
      res.json(updatedNote)
    })
    .catch((error) => next(error))
})

{
  /*app.delete('/app/notes/:id', (req, res) => {
    const id = Number(req.params.id)

    notes = notes.filter(note => note.id !== id)

    res.status(204).end()
})
*/
}

// delete operation on MongoDB data
app.delete("/app/notes/:id", (req, res, next) => {
  Note.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

{
  /*const generateId = () => {
    const maxId = notes.length > 0
                    ? Math.max(...notes.map(n => n.id))
                    : 0
    return maxId + 1
}

app.post('/app/notes', (req, res) => {
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
*/
}
// post using mongodb for the data rendering
app.post("/api/notes", (req, res, next) => {
  const body = req.body
  //can be defined using validation rule when defining schema
  {
    /*if (body.content === undefined) {
        return res.status(400).json({ error: 'Content missing' })
    }*/
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note
    .save()
    .then((savedNote) => {
      res.json(savedNote)
    })
    .catch((error) => next(error))
})

app.use(unknownEndpoint)

//call error handler middleware at last of the code
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
