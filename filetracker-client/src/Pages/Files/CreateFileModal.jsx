import React, { useState } from "react";

function CreateFileModal({
  modalTitle,
  closeModal,
  createFile,
  newFileDetails,
  setNewFileDetails,
  handleFileChange,
}) {
  const { title, tags, description, file } = newFileDetails;

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("tags", tags);
    formData.append("description", description);
    formData.append("file", file);
    createFile(formData);
    closeModal();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-lg font-bold mb-4">{modalTitle}</h2>
        <input
          type="text"
          value={title}
          onChange={(e) =>
            setNewFileDetails({ ...newFileDetails, title: e.target.value })
          }
          className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
          placeholder="Enter file title"
        />
        <input
          type="text"
          value={tags}
          onChange={(e) =>
            setNewFileDetails({ ...newFileDetails, tags: e.target.value })
          }
          className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
          placeholder="Enter tags (comma separated)"
        />
        <textarea
          value={description}
          onChange={(e) =>
            setNewFileDetails({
              ...newFileDetails,
              description: e.target.value,
            })
          }
          className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
          placeholder="Enter file description"
          rows="3"
        ></textarea>
        <input type="file" onChange={handleFileChange} className="mb-4" />
        {file && <p>Selected File: {file.name}</p>}
        <div className="flex justify-end">
          <button onClick={closeModal} className="btn btn-secondary mr-2">
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn btn-primary">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateFileModal;
