import React from 'react'
import { withRouter } from 'react-router-dom'

import { Mutation } from 'react-apollo'
import Error from '../Error'
import { SIGNIN_USER } from '../../queries'

const initialState = {
  email: '',
  password: ''
}

// the signin react component
class Signin extends React.Component {
  state = { ...initialState }

  handleChange = (event) => {
    const { name, value } = event.target
    this.setState({ [name]: value })
  }

  validateForm = () => {
    const { email, password } = this.state;
    const isInvalid = !email || !password;
    return isInvalid;
  };

  render() {
    const { email, password } = this.state;

    return (
      <div className="App">
        <h2 className="App">Signin</h2>
        <Mutation mutation={SIGNIN_USER} variables={{ email, password }}>
          {(login, { data, loading, error }) => {
            return (
              <form
                className="form"
                onSubmit={(event) => {
                  event.preventDefault()
                  login().then(async ({ data }) => {
                    localStorage.setItem('token', data.login.token);
                    await this.props.refetch();
                    this.props.history.push('/');
                  })
                }}
              >
                <input
                  type="text"
                  name="email"
                  placeholder="email"
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
// withrouter allows this.props.history to be used
export default withRouter(Signin);
