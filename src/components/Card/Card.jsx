import React from 'react';
import './Card.css';

export const Card = ({ type = 'info', title, children }) => {
  return (
    <article className={`card card--${type}`} aria-label={title || 'Card'}>
      {title && <div className="card__title">{title}</div>}
      <div className="card__content">{children}</div>
    </article>
  );
};

export default Card;
