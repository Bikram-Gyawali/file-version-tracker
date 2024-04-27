import React from "react";

function VersionTable({
  files,
  handleUpdateFile,
  activeFileId,
}) {

  const userRole = localStorage.getItem("role");
  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          <th className="px-4 py-1 border border-gray-300">Title</th>
          <th className="px-4 py-1 border border-gray-300">Date</th>
          <th className="px-4 py-1 border border-gray-300">Options</th>
        </tr>
      </thead>
      <tbody>
        {files?.map((file) => (
          <tr key={file.id} className="bg-white">
            <td className="px-4 py-2 border border-gray-300 text-center">
              {file.title}
              {console.log("title", file.title)}
            </td>
            <td className="px-4 py-2 border border-gray-300 text-center">
              {file.createdAt}
            </td>
            <td className="px-4 py-2 border border-gray-300 text-center">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleUpdateFile(file._id, "New Name")}
                  className={
                    activeFileId === file._id
                      ? "btn btn-update cursor-pointer text-green-500"
                      : "btn btn-update cursor-pointer text-blue-500"
                  }
                  disabled={userRole !== "editor" ? true : false}
                >
                  {activeFileId === file._id ? "Active" : "Set Active"}
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default VersionTable;
