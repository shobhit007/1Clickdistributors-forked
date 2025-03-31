import React from "react";
import PropTypes from "prop-types";

const ConfirmationModal = ({
  heading,
  subHeading,
  confirmationText,
  cancelText,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{heading}</h2>
        {subHeading && (
          <p className="text-sm text-gray-600 mt-2">{subHeading}</p>
        )}
      </div>
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          onClick={onConfirm}
        >
          {confirmationText}
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
          onClick={onCancel}
        >
          {cancelText}
        </button>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  heading: PropTypes.string.isRequired,
  subHeading: PropTypes.string,
  confirmationText: PropTypes.string.isRequired,
  cancelText: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmationModal;
