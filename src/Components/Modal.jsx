import React from 'react';

export default function Modal({ children, isVisible, handleClose }) {
    const modalRef = React.useRef(null);

    React.useEffect(() => {
        const modal = modalRef.current;
        if (isVisible) {
            modal.showModal();
        } else {
            modal.close();
        }
    }, [isVisible]);

    const close = () => {
        handleClose();
        const modal = modalRef.current;
        if (modal) {
            modal.close();
        }
    };

    return (
        <div id="parent">
            <dialog id="my_modal_3" className="modal" ref={modalRef}>
                <div className="modal-box">
                    <button
                        type="button"
                        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        onClick={close}
                    >
                        ✕
                    </button>
                    <div>{children}</div>
                </div>
            </dialog>
        </div>
    );
}
