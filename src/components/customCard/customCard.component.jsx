import React from 'react';
import './customCard.style.css';
export default function CustomCard(params) {
  const { image, url, title, description } = params;

  return (
    <div>
      <a href={url} target="_blank" rel="noreferrer" className="cardContainer">
        <img className="cardImage" src={image} alt="Discover" />
        <div className="cardTitleStyle">{title}</div>
        <text className="subTextStyle">{description}</text>
      </a>
    </div>
  );
}
