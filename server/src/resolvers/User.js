import axios from 'axios'
import getUserId from '../utils/getUserId'

const User = {  // create the linked field lookups in the user object
  // you can overide a field so you can determine whether it should be shown or not
  // here we are only showning your own email not other peoples
  email: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, {request}, info) {
      const userId = getUserId(request, false)
      if (userId && userId === parent.id) {
        return parent.email
      } else {
        return null
      }
    }
  },
  likes: {
    fragment: 'fragment userId on User { id }',
    async resolve(parent, args, {prisma}, info) {
        let booksLiked = []
        const likes = await prisma.query.booklikes({
          where: {user: {id: parent.id}}      
        })
        likes.map((like)=> {
          booksLiked.push( axios.get(`http://localhost:3000/books/${like.bookId}`).then(res => res.data))
        })
        return booksLiked
    }
  }
}

export { User as default }