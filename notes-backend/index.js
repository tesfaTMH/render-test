const express = require("express")
const cors = require("cors")
require("dotenv").config()

const app = express()
const notes = require("./routes/notes")

// middleware to read body, parse it and place results in req.body
app.use(express.json()) // for application/json
//app.use(express.urlencoded()) // for application/x-www-form-urlencoded

//routes
app.use("/api/notes", notes)

app.use(cors())
const connectDB = require("./db/connect")

const Note = require("./models/note")
//use builtin static middleware to make express show static content of the frontend
app.use(express.static("dist"))
const requestLogger = require("./middleware/request-Logger")
const unknownEndpoint = require("./middleware/unknown-Endpoint")
//middleware for error handlng
const errorHandler = require("./middleware/error-Handler")

app.use(requestLogger)
app.use(unknownEndpoint)

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

app.use(unknownEndpoint)

//call error handler middleware at last of the code
app.use(errorHandler)

const PORT = process.env.PORT
const url = process.env.MONGODB_URI

const startServer = async () => {
  try {
    console.log("Connecting to-> DB")
    await connectDB(url)
    console.log("Connected to MongoDB")
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.log("error connecting to MongoDB: ", error.message)
  }
}

startServer()
