import axios from "axios";
import React, { useState, useEffect } from "react";
import LeftMenuBar from "../../Components/Dashboard/LeftMenuBar";
import TopNavigationBar from "../../Components/Dashboard/TopNavigationBar";
import FilesTable from "../../Components/Tables/FilesTable";
import { apiUrl } from "../../constant/base";
import CreateFileModal from "./CreateFileModal";
import { useParams } from "react-router-dom";

function Files() {
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [newFileDetails, setNewFileDetails] = useState({
    title: "",
    tags: "",
    description: "",
    file: null,
  })
  const [showRevertModal, setShowRevertModal] = useState(false);

//   take folder id from pramas
  const { folderId: currentFolderId } = useParams();

  useEffect(() => {
    fetchFiles();
  }, []);

  const userRole = localStorage.getItem("role");

  const fetchFiles = async () => {
    try {
        console.log("currentFolderId", currentFolderId);
      const response = await axios.get(`${apiUrl}/api/file/${currentFolderId}`, {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log("response", response.data.data);
      setFiles(response.data.data);
    } catch (error) {
      console.error("Error fetching Files:", error);
    }
  };

  const handleSearch = async (event) => {
    const value = event.target.value;
    console.log("value", value);

    const response = await axios.get(
      `${apiUrl}/api/file/${currentFolderId}?q=${value}`,
      {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
   
    setFiles(response.data.data);
  };

  const handleUpdateFile = async () => {
    try {
      const formData = new FormData();
      console.log("title", newFileDetails);
      formData.append("title", newFileDetails.title);
      formData.append("files", newFileDetails.file);
      formData.append("tags", newFileDetails.tags);
      formData.append("description", newFileDetails.description);

      await axios.put(
        `${apiUrl}/api/file/${currentFolderId}/${selectedFileId}`,
        formData,
        {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      // You may want to update the state here to reflect the change
      fetchFiles();
      setNewFolderName("");
      closeUpdateModal();
    } catch (error) {
      console.error("Error updating folder:", error);
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      await axios.delete(`${apiUrl}/api/file/${currentFolderId}/${fileId}`, {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      // You may want to update the state here to reflect the change
      fetchFiles();
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

  const navigateToFileDetails = (fileId) => {
    console.log("folderId", fileId);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const openUpdateModal = (fileId) => {
    setSelectedFileId(fileId);
    setShowUpdateModal(true);
  }

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
  }

  const createFile = async () => {
    try {
        const formData = new FormData();
        console.log("title", newFileDetails);
        formData.append("title", newFileDetails.title);
        formData.append("files", newFileDetails.file);
        formData.append("tags", newFileDetails.tags);
        formData.append("description", newFileDetails.description);

      await axios.post(`${apiUrl}/api/file/${currentFolderId}`, formData, {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });
      fetchFiles();
      setNewFileDetails({
        title: "",
        tags: "",
        description: "",
        file: null,
      });

      setShowModal(false);
    } catch (error) {
      console.error("Error creating file:", error);
    }
  };

  const handleFileChange = (event) => {
    setNewFileDetails({
      ...newFileDetails,
      file: event.target.files[0]
    });
  };
  

  const handleDownloadFile = async (external_url) => {
    try {[]
      console.log("external_url", external_url);

      // Create a temporary link and trigger the download
      const link = document.createElement('a');
      link.href = external_url;
      link.download = 'file'; // You can specify a filename here
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div className="flex bg-white">
      <div className="hidden sm:block w-2/12 h-screen">
        <LeftMenuBar />
      </div>
      <div className="w-full bg-background">
        <div className="p-0">
          <TopNavigationBar title={"Files"} />
          <div className="w-full">
            <button
              onClick={openModal}
              className="btn btn-primary m-4 cursor-pointer"
              disabled={userRole !== "editor" ? true : false}
            >
              Create New File
            </button>
            <input
              type="text"
              placeholder="Search Files"
              className="input input-bordered w-full max-w-xs m-4"
              onChange={handleSearch}
            />
            {showModal && (
              <CreateFileModal
                modalTitle={"Create File"}
                closeModal={closeModal}
                createFile={createFile}
                newFileDetails={newFileDetails}
                setNewFileDetails={setNewFileDetails}
                handleFileChange={handleFileChange}
              />
            )}
            {showUpdateModal && (
              <CreateFileModal
                modalTitle={"Update File"}
                closeModal={closeUpdateModal}
                createFile={handleUpdateFile}
                newFileDetails={newFileDetails}
                setNewFileDetails={setNewFileDetails}
                handleFileChange={handleFileChange}
              />
            )}
            <div>
              <FilesTable
                files={files}
                handleUpdateFile={openUpdateModal}
                handleDeleteFile={handleDeleteFile}
                navigateToFileDetails={navigateToFileDetails}
                downloadFile={handleDownloadFile}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Files;
