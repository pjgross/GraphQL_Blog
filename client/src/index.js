import '@babel/polyfill/noConflict'
import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import './index.css'

import Navbar from './Components/Navbar'
import withSession from './Components/withSession'
import Signin from './Components/Auth/Signin'
import Signup from './Components/Auth/Signup'
import BookPage from './Components/Book/BookPage'
import AddBook from './Components/Book/AddBook'

import App from './Components/App'
import client from './apollo/index';
import EditBook from './Components/Book/EditBook';

const Root = ({ refetch, session }) => (
  <Router>
    <Fragment>
      <Navbar session={session} />
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/signin" render={() => <Signin refetch={refetch} />} />
        <Route path="/signup" render={() => <Signup refetch={refetch} />} />
        <Route path="/books/:id" component={BookPage} />
        <Route
          path="/book/add"
          render={() => <AddBook session={session} />}
        />
        <Route path="/book/:id" component={EditBook} />
        <Redirect to="/" />
      </Switch>
    </Fragment>
  </Router>
)
const RootWithSession = withSession(Root);

ReactDOM.render(
  <ApolloProvider client={client}>
    <RootWithSession />
  </ApolloProvider>,
  document.getElementById('root')
)
