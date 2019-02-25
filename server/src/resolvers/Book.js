import axios from 'axios'

const Book = {
    publisher({publisherId}) {return axios.get(`http://localhost:3000/publishers/${publisherId}`).then(res => res.data)}
}

export { Book as default }