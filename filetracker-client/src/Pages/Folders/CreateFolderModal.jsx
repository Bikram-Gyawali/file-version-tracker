import React from "react";

function CreateFolderModal({
  title,
  closeModal,
  createFolder,
  newFolderName,
  setNewFolderName,
}) {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <input
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
          placeholder="Enter folder name"
        />
        <div className="flex justify-end">
          <button onClick={closeModal} className="btn btn-secondary mr-2">
            Cancel
          </button>
          <button onClick={createFolder} className="btn btn-primary">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateFolderModal;
