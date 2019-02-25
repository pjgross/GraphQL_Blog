import '../../assets/css/style.css'
import React, { Component } from 'react';

const posts = [{
  id: 2,
  text: 'Lorem ipsum',
  user: {
    username: 'Test User'
  }
},
{
  id: 1,
  text: 'Lorem ipsum',
  user: {
    username: 'Test User 2'
  }
}]

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { posts };
  }

  render() {
    const { posts } = this.state;

    return (
      <div className="container">
        <div className="feed">
          {posts.map(post => (
            <div key={post.id} className="post">
              <div className="header">
                <h2>{post.user.username}</h2>
              </div>
              <p className="content">
                {post.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }
}
