import React from 'react'

import { Mutation } from 'react-apollo'
import { LIKE_BOOK, DELETE_LIKE, GET_CURRENT_USER } from '../../queries'
import withSession from '../withSession'

class LikeBook extends React.Component {
  state = {
    liked: false,
    bookId: ''
  };

  componentDidMount() {
    if (this.props.session.getCurrentUser) {
      const { likes } = this.props.session.getCurrentUser
      const { bookId } = this.props
      let isLiked = false
      likes.forEach((like) => {
        console.log(`<${like.id}><${bookId}>`)
        if (like.id === bookId) {
          isLiked = true
        }
      })

      this.setState({
        liked: isLiked,
        bookId
      });
    }
  }

  handleClick = (likeRecipe, unlikeRecipe) => {
    this.setState(
      prevState => ({
        liked: !prevState.liked
      }),
      () => this.handleLike(likeRecipe, unlikeRecipe)
    );
  };

  handleLike = (likeBook, deleteLike) => {
    if (this.state.liked) {
      likeBook().then(async ({ data }) => {
        await this.props.refetch();
      });
    } else {
      deleteLike().then(async ({ data }) => {
        await this.props.refetch();
      });
    }
  };

  render() {
    const { liked, bookId } = this.state
    return (
      <Mutation
        mutation={DELETE_LIKE}
        variables={{ bookId }}
        refetchQueries={[{ query: GET_CURRENT_USER }]}
      >
        {deleteLike => (
          <Mutation
            mutation={LIKE_BOOK}
            variables={{ id: bookId }}
            refetchQueries={[{ query: GET_CURRENT_USER }]}
          >
            {likeBook => (
              <button
                className="like-button"
                onClick={() => this.handleClick(likeBook, deleteLike)}
              >
                {liked ? 'Unlike' : 'Like'}
              </button>
            )
            }
          </Mutation>
        )}
      </Mutation>
    );
  }
}

export default withSession(LikeBook);
