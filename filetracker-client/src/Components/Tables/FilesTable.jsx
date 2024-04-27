import React from "react";
import { FaFilePdf, FaFileImage, FaFileAlt } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";

function FilesTable({ files, handleUpdateFile, handleDeleteFile, navigateToFileDetails, downloadFile }) {
  const { folderId: currentFolderId } = useParams();
  const handleViewFile = (fileUrl) => {
    window.open(fileUrl, "_blank"); // Open the file in a new tab
  };

  const userRole = localStorage.getItem("role");

  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          <th className="px-4 py-2 border border-gray-300">Title</th>
          <th className="px-4 py-2 border border-gray-300">Type</th>
          <th className="px-4 py-2 border border-gray-300">Tags</th>
          <th className="px-4 py-2 border border-gray-300">Description</th>
          <th className="px-4 py-2 border border-gray-300">Options</th>
        </tr>
      </thead>
      <tbody>
        {files.map((file) => (
          <tr key={file.id} className="bg-white">
            <td className="px-4 py-2 border border-gray-300 text-center">
              {file.title}
            </td>
            <td className="px-4 py-2 border border-gray-300 text-center">
              <div className="w-full flex items-center space-x-10">
                <span>{file.external_url?.split(".").pop().toLowerCase()}</span>
                {file.external_url && (
                  <button
                    onClick={() => handleViewFile(file.external_url)}
                    className="btn btn-view"
                  >
                    View
                  </button>
                )}
              </div>
            </td>
            <td className="px-4 py-2 border border-gray-300 text-center">
              {console.log("filetags", file.tags)}
              {file.tags.map((tag, index) => (
                <span key={tag}>
                  {index > 0 ? ", " : ""}
                  {tag}
                </span>
              ))}
            </td>
            <td className="px-4 py-2 border border-gray-300 text-center">
              {file.description}
            </td>
            <td className="px-4 py-2 border border-gray-300 text-center">
              <div className="flex space-x-2">
                <Link
                  to={`/folders/${currentFolderId}/files/${file._id}/versions`}
                >
                  <button
                    onClick={() => navigateToFileDetails(file._id)}
                    className="btn btn-view cursor-pointer text-blue-500"
                  >
                    View Versions
                  </button>
                </Link>
                <button
                  onClick={() => handleUpdateFile(file._id, "New Name")}
                  className="btn btn-update cursor-pointer text-blue-500"
                  disabled={userRole !== "editor" ? true : false}
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteFile(file._id)}
                  className="btn btn-delete cursor-pointer text-red-500"
                  disabled={userRole !== "editor" ? true : false}
                >
                  Delete
                </button>
                <button
                  className="btn btn-download cursor-pointer text-green-500"
                  onClick={() => downloadFile(file.external_url)}
                  disabled={userRole !== "editor" ? true : false}
                >
                  Download
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const getFileExtension = (filename) => {
  return filename?.split(".").pop().toLowerCase();
};

export default FilesTable;
