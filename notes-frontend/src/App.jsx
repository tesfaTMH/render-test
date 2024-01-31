import { useState, useEffect } from "react"
import { Note } from "./components/Note"
import { Notification } from "./components/Notification"
import noteService from "./services/notes"

const Footer = () => {
  const footerStyle = {
    color: "green",
    fontStyle: "italic",
    fontSize: 16,
  }

  return (
    <div style={footerStyle}>
      <em>
        Note app, Department of Computer Science, University of Helsinki 2023
      </em>
    </div>
  )
}

function App() {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("")
  const [showAll, setShowAll] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    console.log("useEffect")
    noteService.getAll().then((initialNotes) => {
      console.log(initialNotes)
      //console.log('promise fullfilled')
      setNotes(initialNotes)
    })
  }, [])

  console.log("render", notes.length, "notes")

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
    }

    noteService
      .create(noteObject)
      .then((returnedNote) => {
        console.log(returnedNote)
        setNotes(notes.concat(returnedNote))
        setNewNote("")
      })
      .catch((error) => {
        setErrorMessage(error.response.data.error)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const toggleImportanceOf = (id) => {
    console.log("importance of " + id + " needs to be toggled")
    //const url = `http://localhost:3001/app/notes/${id}`
    const note = notes.find((n) => n.id === id)
    const changeNote = { ...note, important: !note.important }

    noteService
      .update(id, changeNote)
      .then((returnedNote) => {
        setNotes(notes.map((n) => (n.id !== id ? n : returnedNote)))
      })
      .catch((error) => {
        setErrorMessage(
          `the note '${note.content}' was already deleted from the server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNewNote(notes.filter((n) => n.id !== id))
      })
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const notesToShow = showAll ? notes : notes.filter((note) => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote} name='noteForm'>
        <input name='newNote' value={newNote} onChange={handleNoteChange} />
        <button type='submit'>Save</button>
      </form>

      <Footer />
    </div>
  )
}

export default App
