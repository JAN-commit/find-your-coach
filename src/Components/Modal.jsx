import React, { useEffect } from 'react';

export default function Modal({ children, isVisible, handleClose }) {
    
    useEffect(() => {
        const modal = document.getElementById('my_modal_3');
        if (isVisible) {
            modal.showModal();
        } else {
            modal.close();
        }
    }, [isVisible]);
    

    return (
        <div id="parent">
            <dialog id="my_modal_3" className="modal">
                <div className="modal-box">
                    <button
                        type="button"
                        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        onClick={handleClose}
                    >
                        ✕
                    </button>
                    <div>{children}</div>
                </div>
            </dialog>
        </div>
    );
}
