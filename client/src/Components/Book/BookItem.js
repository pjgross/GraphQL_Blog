import React from 'react'
import { Link } from 'react-router-dom'
import posed from 'react-pose'

const BookItem = posed.li({
  shown: { opacity: 1 },
  hidden: { opacity: 0 }
});

export default ({ id, imageUrl, author, title, publisher, subtitle, description, isbn, likedBy }) => (
  <BookItem
    style={{ background: `url(${imageUrl}) center center / cover no-repeat` }}
    className="card"
  >
    <span className="publisher">{publisher.name}</span>
    <div className="card-text">
      <Link to={`/books/${id}`}>
        <h5>{title}</h5>
      </Link>
      <Link to={`/book/${id}`}>Edit</Link>
    </div>
  </BookItem>
);
