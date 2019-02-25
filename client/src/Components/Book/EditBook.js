import React, { Fragment } from 'react'
import gql from 'graphql-tag'
import { withRouter } from 'react-router-dom'
import { Mutation, Query } from 'react-apollo'

import { DELETE_BOOK, GET_ALL_BOOKS } from '../../queries/index'
import BookForm from './BookForm'
import withAuth from '../withAuth'

export const GET_BOOK = gql`
  query Book($id: ID!){
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
    likedBy {
      id
      email
      name
    }
  }
  publishers {
    name
    id
  }
}
`
class EditBook extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...props.match.params }
  }

  // need to remove the record from the cache if deleted
  updateCache = (cache) => {
    const { books } = cache.readQuery({ query: GET_ALL_BOOKS })

    cache.writeQuery({
      query: GET_ALL_BOOKS,
      data: {
        books: books.filter(book => book.id !== this.state.id)
      }
    })
    this.props.history.push('/')
  }

  render() {
    console.log(this.state.id)
    return (
      <Query query={GET_BOOK} variables={{ id: this.state.id }}>
        {({ data, loading, error }) => {
          if (loading) return null
          if (error) return <p>ERROR: {error.message}</p>
          return (
            <div className="form">
              <BookForm {...data} />
              <Mutation
                mutation={DELETE_BOOK}
                variables={{ id: this.state.id }}
                update={this.updateCache}
              >
                {(deleteBook, { data, loading, error }) => {
                  return (
                    <button className="delete-button" onClick={deleteBook}>Remove Book</button>
                  )
                }
                }
              </Mutation>
            </div>
          )
        }}
      </Query>

    );
  }
}

export default withAuth(session => session && session.getCurrentUser)(
  withRouter(EditBook)
);
