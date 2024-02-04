const express = require("express")
const router = express.Router()

const {
  getAllNotes,
  getNote,
  updateNote,
  deleteNote,
  createNote,
} = require("../controller/notes")

router.route("/").get(getAllNotes).post(createNote)
router.route("/:id").get(getNote).put(updateNote).delete(deleteNote)

module.exports = router
