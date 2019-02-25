import React from 'react'
import { withRouter } from 'react-router-dom'

import { Mutation } from 'react-apollo'
import Error from '../Error'
import { SIGNUP_USER } from '../../queries'

const initialState = {
  name: '',
  email: '',
  password: '',
  passwordConfirmation: ''
};

class Signup extends React.Component {
  state = { ...initialState }

  clearState = () => {
    this.setState({ ...initialState })
  };

  handleChange = (event) => {
    const { name, value } = event.target
    this.setState({ [name]: value })
  };

  handleSubmit = (event, signupUser) => {
    // signupUser was the function passed from the mutation resolver
    event.preventDefault()
    signupUser().then(async ({ data }) => {
      // console.log(data)
      localStorage.setItem('token', data.createUser.token)
      await this.props.refetch()
      // set state back to defaults
      this.clearState()
      // go to home page
      this.props.history.push('/')
    })
  }

  validateForm = () => {
    const { name, email, password, passwordConfirmation } = this.state
    const isInvalid = !name || !email || !password || password !== passwordConfirmation
    return isInvalid
  }

  render() {
    const { name, email, password, passwordConfirmation } = this.state

    return (
      <div className="App">
        <h2 className="App">Signup</h2>
        <Mutation
          mutation={SIGNUP_USER}
          variables={{ name, email, password }}
        >
          {(createUser, { data, loading, error }) => {
            return (
              <form
                className="form"
                onSubmit={event => this.handleSubmit(event, createUser)}
              >
                <input
                  type="text"
                  name="name"
                  placeholder="name"
                  value={name}
                  onChange={this.handleChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={this.handleChange}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={this.handleChange}
                />
                <input
                  type="password"
                  name="passwordConfirmation"
                  placeholder="Confirm Password"
                  value={passwordConfirmation}
                  onChange={this.handleChange}
                />
                <button
                  type="submit"
                  disabled={loading || this.validateForm()}
                  className="button-primary"
                >
                  Submit
                </button>
                {error && <Error error={error} />}
              </form>
            );
          }}
        </Mutation>
      </div>
    );
  }
}

export default withRouter(Signup)
