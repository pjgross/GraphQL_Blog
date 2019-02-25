import gql from 'graphql-tag'

/* User Queries */

export const GET_CURRENT_USER = gql`
  query {
    getCurrentUser {
      id
      email
      name
      likes {
        id
        title
        author
        imageUrl
      }
    }
  }
`

export const GET_ALL_BOOKS = gql`
  query {
    books {
      id
      title
      subtitle
      imageUrl
      description
      isbn
      publisher {
        name
        id
      }
      likedBy {
        id
        name
      }      
    }    
  }
`

export const GET_ALL_PUBLISHERS = gql`
  query {
    publishers {
      id
      name
  }
}
`

export const GET_USER_BOOKS = gql`
  query($email: String!) {
    booklikes(query: $email) {
      id
      title
      imageUrl
      category
      description
    }
  }
`


/* User Mutations */

export const SIGNIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user { 
        id
        name
      }
    }
  }
`

export const SIGNUP_USER = gql`
  mutation($name: String!, $email: String!, $password: String!) {
    createUser(data: {name: $name, email: $email, password: $password}) {
      token
      user {
        id
        name
        email
      }
    }
  }
`

export const ADD_BOOK = gql`
mutation($isbn: String!, $title: String!, $subtitle: String, $author: String!, $publisherId: ID!, $pages: Int, $description: String, $imageUrl: String) {
  addBook(data: {isbn: $isbn, title: $title, subtitle: $subtitle, author: $author, publisherId: $publisherId, pages: $pages, description: $description, imageUrl: $imageUrl}) {
    id
    isbn
    title
    author
    publisher {
      id
      name
    }
    pages
    description
  }
}
`

export const UPDATE_BOOK = gql`
mutation($id: ID!, $isbn: String!, $title: String!, $subtitle: String, $author: String!, $publisherId: ID, $pages: Int, $description: String, $imageUrl: String) {
  updateBook(data: {id: $id, isbn: $isbn, title: $title, subtitle: $subtitle, author: $author, publisherId: $publisherId, pages: $pages, description: $description, imageUrl: $imageUrl}) {
    id
    isbn
    title
    author
    publisher {
      id
      name
    }
    pages
    description
  }
}
`

export const DELETE_BOOK = gql`
mutation($id: ID!) {
  deleteBook(id: $id) {
    statuscode
  }
}
`
export const LIKE_BOOK = gql`
mutation($id: ID!) {
  likeBook(id: $id) {
    id
    bookId
    user {
      id
      name
    }
  }
}
`
export const DELETE_LIKE = gql`
mutation($bookId: ID!) {
  deleteLike(bookId: $bookId) {
    id
    bookId
  }
}
`
export const GET_BOOK = gql`
  query Book($id: ID!) {
    book(id: $id) {
      id
      title
      subtitle
      isbn
      author
      publisher {
        id
        name
      }
      imageUrl
      pages
      description
    }
  }
`
