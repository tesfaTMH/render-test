const Note = require("../models/note")
const asyncWrapper = require("../middleware/async-Wrapper")
const { createCustomError } = require("../errors/custom-Error")

const getAllNotes = asyncWrapper(async (req, res) => {
  await Note.find({}).then((notes) => {
    console.log(notes)
    res.status(200).json(notes)
  })
})

const getNote = asyncWrapper(async (req, res, next) => {
  //const id = Number(req.params.id)
  const { id: noteID } = req.params

  //const note = Note.find((note) => note.id === id)
  const note = await Note.findOne({ _id: noteID })

  if (!note) {
    return next(createCustomError(`No note with ID : ${noteID}`, 404))
  }
  res.status(200).json(note)
})

const updateNote = asyncWrapper(async (req, res, next) => {
  const { content, important } = req.body
  await Note.findByIdAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((note) => {
      res.status(200).json(note)
    })
    .catch((error) => {
      next(createCustomError(`No note with ID : ${req.params.id}`, 404))
    })
})

const deleteNote = asyncWrapper(async (req, res, next) => {
  await Note.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end()
    })
    .catch((error) => {
      next(createCustomError(`No note with ID : ${req.params.id}`, 404))
    })
})

const createNote = asyncWrapper(async (req, res, next) => {
  const body = req.body
  //can be defined using validation rule when defining schema
  {
    /*if (body.content === undefined) {
        return res.status(400).json({ error: 'Content missing' })
    }*/
  }
  console.log(body)
  const note = new Note(req.body)

  await note
    .save()
    .then((savedNote) => {
      res.status(200).json(savedNote)
    })
    .catch((error) => next(error))
})

module.exports = { getAllNotes, getNote, updateNote, deleteNote, createNote }
