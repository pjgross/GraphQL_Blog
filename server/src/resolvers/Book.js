import axios from 'axios'

const Book = {
    publisher({publisherId}) {return axios.get(`http://localhost:3000/publishers/${publisherId}`).then(res => res.data)},
    likedBy: {
        async resolve(parent, args, {prisma}, info) {
            const query = `
                query ($id: String) {
                    booklikes(where: {bookId: $id}){
                    id
                    bookId
                    user {
                        id
                        name
                        email
                    }
                    }
                }
            `
            let Users = []
            const variables = { id: parent.id }
            const likes = await prisma.request(query, variables)
            if (likes.data.booklikes.length > 0){
                likes.data.booklikes.map((like)=> {
                    const user = like.user
                    Users.push( user )
                })
            }
            return Users
        }
    }
}

export { Book as default }
