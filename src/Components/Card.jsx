import { useState } from "react";
import Modal from "./Modal";
import ContactForm from "./ContactForm";

export default function Card() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <div className='cursor-pointer'>
            <div className="card bg-base-100 shadow-xl dark:bg-base-900">
                <figure>
                    <img src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" />
                </figure>
                <div className="card-body pt-5">
                    <h2 className="card-title">Andrei Nicolas</h2>
                    <p>1,000/hr</p>

                    <div className="flex space-x-2 mb-4 justify-center">
                        <button className="border px-2 py-1 rounded-md">Frontend</button>
                        <button className="border px-2 py-1 rounded-md">Backend</button>
                    </div>

                    <div className="card-actions flex justify-center">
                        <div className="flex space-x-2 mb justify-center">
                            <button
                                className="bg-primary px-3 py-1 rounded-md text-base-400 font-semibold"
                                onClick={toggleModal}
                            >
                                Contact
                            </button>
                            <button className="bg-primary px-3 py-1 rounded-md text-base-400 font-semibold">Details</button>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <Modal isVisible={isModalOpen} handleClose={toggleModal}>
                    <ContactForm />
                </Modal>
            )}
        </div>
    );
}
