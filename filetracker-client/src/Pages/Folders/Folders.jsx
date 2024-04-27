import axios from "axios";
import React, { useState, useEffect } from "react";
import LeftMenuBar from "../../Components/Dashboard/LeftMenuBar";
import TopNavigationBar from "../../Components/Dashboard/TopNavigationBar";
import FoldersTable from "../../Components/Tables/FoldersTable";
import { apiUrl } from "../../constant/base";
import CreateFolderModal from "./CreateFolderModal";
import { useNavigate } from "react-router-dom";

function Folders() {
  const [folders, setFolders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/folder`, {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setFolders(response.data.data);
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  };

  const handleUpdateFolder = async () => {
    try {
      await axios.put(`${apiUrl}/api/folder/${selectedFolderId}`, { name: newFolderName }, {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      // You may want to update the state here to reflect the change
      fetchFolders();
      setNewFolderName("");
      closeUpdateModal();
    } catch (error) {
      console.error("Error updating folder:", error);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    try {

      await axios.delete(`${apiUrl}/api/folder/${folderId}`, {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      // You may want to update the state here to reflect the change
      fetchFolders();
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const openUpdateModal = (folderId) => {
    setSelectedFolderId(folderId);
    setShowUpdateModal(true);
  }

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
  }

  const navigateToFolderDetails = (folderId) => {
    navigate(`/folders/${folderId}/files`);
  }

  const createFolder = async () => {
    try {
      await axios.post(
        `${apiUrl}/api/folder`,
        { name: newFolderName },
        {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      fetchFolders();
      setNewFolderName("");
      setShowModal(false);
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  const userRole = localStorage.getItem("role");

  return (
    <div className="flex bg-white">
      <div className="hidden sm:block w-2/12 h-screen">
        <LeftMenuBar />
      </div>
      <div className="w-full bg-background">
        <div className="p-0">
          <TopNavigationBar title={"Folders"} />
          <div className="w-full">
            <button
              onClick={openModal}
              className="btn btn-primary m-4 cursor-pointer"
              disabled={userRole !== "editor" ? true : false}
            >
              Create New Folder
            </button>
            {showModal && (
              <CreateFolderModal
                title={"Create New Folder"}
                closeModal={closeModal}
                createFolder={createFolder}
                newFolderName={newFolderName}
                setNewFolderName={setNewFolderName}
              />
            )}
            {showUpdateModal && (
              <CreateFolderModal
                title={"Update Folder"}
                closeModal={closeUpdateModal}
                createFolder={handleUpdateFolder}
                newFolderName={newFolderName}
                setNewFolderName={setNewFolderName}
              />
            )}
            <div>
              <FoldersTable
                folders={folders}
                handleUpdateFolder={openUpdateModal}
                handleDeleteFolder={handleDeleteFolder}
                navigateToFolderDetails={navigateToFolderDetails}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Folders;
