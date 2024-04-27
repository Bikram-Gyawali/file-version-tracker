import React from "react";

function FoldersTable({ folders, handleUpdateFolder, handleDeleteFolder, navigateToFolderDetails }) {
  // Define columns for the table
  const userRole = localStorage.getItem("role");
  const columns = [
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Options",
      Cell: ({ row }) => (
        <div className="flex space-x-2 " >
          <button
            onClick={() => navigateToFolderDetails(row._id)}
            className="btn btn-view"
          >
            View Files
          </button>
          <button
            onClick={() => handleUpdateFolder(row._id, "New Name")}
            className="btn btn-update cursor-pointer text-blue-500 "
            disabled={userRole !== "editor" ? true : false}
          >
            Update
          </button>
          <button
            onClick={() => handleDeleteFolder(row._id)}
            className="btn btn-delete cursor-pointer text-red-500 "
            disabled={userRole !== "editor" ? true : false}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          {columns.map((column, index) => (
            <th key={index} className="px-4 py-2 border border-gray-300">
              {column.Header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {folders.map((folder) => (
          <tr key={folder.id} className="bg-white">
            {columns.map((column, index) => (
              <td key={index} className="px-4 py-2 border border-gray-300 text-center ">
                {column.Cell ? column.Cell({ row: folder }) : folder[column.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default FoldersTable;
