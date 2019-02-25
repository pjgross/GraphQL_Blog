import axios from 'axios'

const Publisher = {
  books({id}){ return axios.get(`http://localhost:3000/publishers/${id}/books`).then(res => res.data) }
}

export { Publisher as default }