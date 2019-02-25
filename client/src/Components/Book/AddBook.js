import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import CKEditor from 'react-ckeditor-component'

import { Mutation, Query } from 'react-apollo'
import { ADD_BOOK, GET_ALL_BOOKS, GET_ALL_PUBLISHERS } from '../../queries'
import Spinner from '../Spinner'
import Error from '../Error'
import withAuth from '../withAuth'

const initialState = {
  title: '',
  subtitle: '',
  isbn: '',
  description: '',
  author: '',
  publisherId: '1',
  pages: 0,
  imageUrl: '../../../../../assets/img/0.jpeg'
};

class AddBook extends React.Component {
  state = { ...initialState };

  clearState = () => {
    this.setState({ ...initialState });
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleEditorChange = (event) => {
    const newContent = event.editor.getData();
    this.setState({ description: newContent });
  };

  handleSubmit = (event, addBook) => {
    event.preventDefault();
    addBook().then(({ data }) => {
      // console.log(data);
      this.clearState();
      this.props.history.push('/');
    });
  };

  validateForm = () => {
    const { isbn, title, author, publisherId } = this.state;
    const isInvalid = !isbn || !title || !author || !publisherId
    return isInvalid;
  };

  updateCache = (cache, { data: { addBook } }) => {
    const { books } = cache.readQuery({ query: GET_ALL_BOOKS });

    cache.writeQuery({
      query: GET_ALL_BOOKS,
      data: {
        books: [addBook, ...books]
      }
    });
  };

  render() {
    const {
      title,
      subtitle,
      author,
      description,
      isbn,
      publisherId,
      pages,
      imageUrl
    } = this.state;

    return (
      <Mutation
        mutation={ADD_BOOK}
        variables={{
          title,
          subtitle,
          author,
          description,
          isbn,
          publisherId,
          pages,
          imageUrl
        }}
        update={this.updateCache}
      >
        {(addBook, { data, loading, error }) => {
          return (
            <div className="App form">
              <h2 className="form">Add Book</h2>
              <form
                className="form"
                onSubmit={event => this.handleSubmit(event, addBook)}
              >

                <div className="row">
                  <label htmlFor="title">Book Title</label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    placeholder="Add Title"
                    onChange={this.handleChange}
                    value={title}
                  />
                </div>
                <div className="u-full-width">
                  <label htmlFor="subtitle">
                    Book Subtitle
                  </label>
                  <input
                    id="subtitle"
                    type="text"
                    name="subtitle"
                    placeholder="Add Sub Title [optional]"
                    onChange={this.handleChange}
                    value={subtitle}
                  />
                </div>

                <label htmlFor="publisherId">
                  Publisher
                  <select
                    id="publisherId"
                    name="publisherId"
                    onChange={this.handleChange}
                    value={publisherId}
                  >
                    <Query query={GET_ALL_PUBLISHERS}>
                      {({ data, loading, error }) => {
                        if (loading) return null
                        if (error) return <p>ERROR: {error.message}</p>
                        return (
                          data.publishers.map((publisher) => {
                            return <option key={publisher.id} value={publisher.id}>{publisher.name}</option>
                          })
                        )
                      }}
                    </Query>
                  </select>
                </label>
                <label htmlFor="isbn">
                  ISBN
                  <input
                    type="text"
                    name="isbn"
                    placeholder="Add isbn"
                    onChange={this.handleChange}
                    value={isbn}
                  />
                </label>
                <label htmlFor="author">
                  Author
                  <input
                    type="text"
                    name="author"
                    placeholder="Add author"
                    onChange={this.handleChange}
                    value={author}
                  />
                </label>
                <label htmlFor="imageUrl">
                  Image URL
                  <input
                    type="text"
                    name="imageUrl"
                    placeholder="Add Image URL"
                    onChange={this.handleChange}
                    value={imageUrl}
                  />
                </label>
                <label htmlFor="description">
                  Book Description
                  <CKEditor
                    id="description"
                    name="description"
                    content={description}
                    events={{ change: this.handleEditorChange }}
                  />
                  {/* <textarea
                    name="description"
                    placeholder="Add description"
                    onChange={this.handleChange}
                    value={deswcription}
                  /> */}
                </label>

                <button
                  type="submit"
                  className="button-primary"
                >
                  Submit
                </button>
                {error && <Error error={error} />}
              </form>
            </div>
          );
        }}
      </Mutation>
    );
  }
}

export default withAuth(session => session && session.getCurrentUser)(
  withRouter(AddBook)
);
