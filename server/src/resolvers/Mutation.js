import axios from 'axios'

const Mutation = {
  addBook(parent, {data}, ctx, info) {return axios.post('http://localhost:3000/books', {...data}).then(res => res.data)},
  // always use patch to update the record and check for failure to find record to update
  updateBook(parent, {data}, ctx, info) {return axios.patch(`http://localhost:3000/books/${data.id}`, {...data}).then(res => {
    return res.data}).catch((e)=> {throw new Error('Unable to update record')})},
  // json-server does not return any data from a delete so return a status code and catch the promise error for failed deletions
  deleteBook(parent, {id}, ctx, info) {return axios.delete(`http://localhost:3000/books/${id}`).then((res) => { 
    return {statuscode: res.status}}).catch((e) => { return {statuscode: e.response.status}})}
}

export { Mutation as default }