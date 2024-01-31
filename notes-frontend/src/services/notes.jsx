import axios from "axios"
//const baseUrl = 'http://localhost:3001/api/notes'
const baseUrl = "api/notes"
//const baseUrl = 'https://render-test1-6fek.onrender.com/api/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  const nonExisting = {
    id: 10000,
    content: "This is not saved to server",
    important: true,
  }
  return request.then((response) => response.data.concat(nonExisting))
}

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject)
  return request.then((response) => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then((response) => response.data)
}

export default { getAll, create, update }
