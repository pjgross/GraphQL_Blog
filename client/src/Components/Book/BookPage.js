import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import Spinner from '../Spinner'
import LikeBook from './LikeBook'
import withSession from '../withSession'

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
const BookPage = ({ match }) => {
  const { id } = match.params
  return (
    <Query query={GET_BOOK} variables={{ id }}>
      {({ data, loading, error }) => {
        if (loading) return <Spinner />
        if (error) return <div>{error.message}</div>
        if (!data) return <Spinner />
        return (
          <div>
            <div
              style={{
                background: `url(${data.book.imageUrl}) center center / cover no-repeat`
              }}
              className="book-image"
            />
            <div className="book">
              <div className="book-header">
                <h2 className="book-title">
                  <strong>{data.book.title}</strong>
                </h2>
                <h5>
                  <strong>{data.book.subtitle}</strong>
                </h5>
                <p>
                  Created by <strong>{data.book.author}</strong>
                </p>
              </div>
              <div
                className="book-description"
                dangerouslySetInnerHTML={{
                  __html: data.book.description
                }}
              />
              <LikeBook bookId={id} />
            </div>
          </div>
        );
      }}
    </Query>
  );
};

export default withSession(BookPage)
