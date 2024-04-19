import React from 'react';
import './Modal.css';

const Modal = ({ children }) => {
  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal">
        <div className='modal-content'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;