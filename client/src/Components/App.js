import './App.css'
import React, { Component } from 'react'
import posed from 'react-pose'
import { Query } from 'react-apollo'
import { GET_ALL_BOOKS } from '../queries'
import Spinner from './Spinner'
import BookItem from './Book/BookItem'

const BookList = posed.ul({
  shown: {
    x: '0%',
    staggerChildren: 100
  },
  hidden: {
    x: '-100%'
  }
});

export default class App extends Component {
  state = { on: false }

  componentDidMount() {
    setTimeout(this.slideIn, 200)
  }

  slideIn = () => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    this.setState({ on: !this.state.on })
  }

  render() {
    const { books } = this.state;

    return (
      <div className="App">
        <h1 className="main-title">
          Find Books You <strong>Love</strong>
        </h1>
        <Query query={GET_ALL_BOOKS}>
          {({ data, loading, error }) => {
            if (loading) return <Spinner />;
            if (error) return <div>Error</div>;
            // console.log(data);
            const { on } = this.state;
            return (
              <BookList pose={on ? 'shown' : 'hidden'} className="cards">
                {data.books.map(book => (
                  <BookItem key={book.id} {...book} />
                ))}
              </BookList>
            );
          }}
        </Query>
      </div>
    );
  }
}
