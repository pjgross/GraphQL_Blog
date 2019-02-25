import axios from 'axios'
import bcrypt from 'bcryptjs'
import getUserId from '../utils/getUserId'
import generateToken from '../utils/generateToken'
import hashPassword from '../utils/hashPassword'

const Mutation = {
  addBook(parent, {data}, ctx, info) {return axios.post('http://localhost:3000/books', {...data}).then(res => res.data)},

  // always use patch to update the record and check for failure to find record to update
  updateBook(parent, {data}, ctx, info) {return axios.patch(`http://localhost:3000/books/${data.id}`, {...data}).then(res => {
    return res.data}).catch((e)=> {throw new Error('Unable to update record')})},

  // json-server does not return any data from a delete so return a status code and catch the promise error for failed deletions
  deleteBook(parent, {id}, ctx, info) {return axios.delete(`http://localhost:3000/books/${id}`).then((res) => { 
    return {statuscode: res.status}}).catch((e) => { return {statuscode: e.response.status}})},

  async likeBook(parent, {id}, {prisma, request}, info) {
    // get the user from the http header of the request
    const userId = getUserId(request)
    // call the prisma api to create the like record
    return prisma.mutation.createBooklike({
        data: {
          bookId: id,
          user: {
            connect: {id: userId}  // indicates we want to connect to an existing user
          }
        }
    },info)
  },
  async deleteLike(parent, { bookId }, {prisma, request}, info) {
    // get the user from the http header of the request
    const userId = getUserId(request)
    console.log(userId)
    //find the record for the user and bookid to get the record id
    const record = await prisma.query.booklikes({
      where: {bookId: bookId, user: { id: userId }}
    }) 
    console.log(record)
    return prisma.mutation.deleteBooklike({where: {id: record[0].id}},info)
  },
  async createUser(parent, args, {prisma}, info) {

    const emailtaken = await prisma.exists.User({ email: args.data.email })
    if (emailtaken) {
      throw new Error('Email taken')
    }
    // hash the plain password into the one to be stored in the database
    const password = await hashPassword(args.data.password)
    // call prisma and create the user in the database returning the user
    // overide the plain text password with the hashed one
    const user = await prisma.mutation.createUser({ 
      data: {
        ...args.data,
        password
      }
    })
    // now generate the token from the returned userid
    const token = generateToken(user.id)
    // return user object and jwt token
    return {
      user,
      token
    }
  },
  async login(parent, {email, password}, {prisma}, info) {
    // find the user in the database
    const user = await prisma.query.user({ where: { email } })
    // if user not found then throw error
    if (!user) {
      throw new Error('User not found')
    }
    // check that the plain text password matches the hashed one
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      throw new Error ('password does not match')
    }
    // generate a jwt token
    const token = generateToken(user.id)
    // return user object and jwt
    return {
      user,
      token
    }
  },
  async deleteUser(parent, args, {prisma, request}, info){
    const userId = getUserId(request)
    const userExists = await prisma.exists.User({ id: userId })
    if (!userExists) {
      throw new Error('User not found')
    }
    return prisma.mutation.deleteUser({ where: { id: userId}, info})
  },
  async updateUser(parent, args, { prisma, request }, info) {
    // get the user record or throw an error if not signed in
    const userId = getUserId(request)
    // if the user updates their password we need to hash it first before saving
    if (typeof args.data.password === 'string'){
      args.data.password = await hashPassword(args.data.password)
    }
    return prisma.mutation.updateUser({
      where: { id: userId }, data: args.data}, info)
  }
}

export { Mutation as default }