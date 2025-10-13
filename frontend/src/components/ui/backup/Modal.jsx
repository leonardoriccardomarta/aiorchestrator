const Modal = ({ isOpen, closeModal, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500">
          X
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
