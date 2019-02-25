import axios from 'axios'

const Query = {
  // all query function receive parent, argument, context and info parameters, we need to use the argument field for some
  books(parent, args, ctx, info) {return axios.get('http://localhost:3000/books').then(res => res.data)},
  book(parent, { id }, ctx, info) {return axios.get(`http://localhost:3000/books/${id}`).then(res => res.data)},
  publishers(parent, args, ctx, info) {return axios.get('http://localhost:3000/publishers').then(res => res.data)},
  publisher(parent, { id }, ctx, info) {return axios.get(`http://localhost:3000/publishers/${id}`).then(res => res.data)}
}

export { Query as default }