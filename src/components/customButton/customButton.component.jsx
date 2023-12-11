import React from 'react';

import './customButton.style.css';

export default function CustomButton(params) {
  const { title, active } = params;

  return (
    <>
      <div className={active ? 'buttonActiveContainer' : 'buttonContainer'}>
        <text className="buttonTitleStyle">{title}</text>
      </div>
    </>
  );
}
