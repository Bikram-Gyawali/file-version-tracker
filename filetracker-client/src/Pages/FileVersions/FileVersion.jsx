import React, { useEffect, useState } from "react";
import VersionTable from "../../Components/Tables/VersionTable";
import LeftMenuBar from "../../Components/Dashboard/LeftMenuBar";
import TopNavigationBar from "../../Components/Dashboard/TopNavigationBar";
import axios from "axios";
import { useParams } from "react-router-dom";
import { apiUrl } from "../../constant/base";

function FileVersion() {
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [activeFileId, setActiveFileId] = useState(null);
  const { folderId: currentFolderId, fileId: currentFileId } = useParams();
  const fetchFiles = async () => {
    try {
        console.log("currentFolderId", currentFolderId);
      const response = await axios.get(
        `${apiUrl}/api/file/${currentFolderId}/${currentFileId}/versions`,
        {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      console.log("response", response.data.data);
      setFiles(response.data.data.allFileVersionsDetail);
      setActiveFile(response.data.data.activeFile);
    } catch (error) {
      console.error("Error fetching Files:", error);
    }
  };

  useEffect(() => {     
    fetchFiles();
  }, [currentFolderId, currentFileId]);

  const handleRevertFile = async (revertFileId) => {

    await axios.put(
      `${apiUrl}/api/file/${currentFolderId}/${currentFileId}/revert`,
      { revertVersionId: revertFileId },
      {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    setActiveFileId(revertFileId);
    await fetchFiles();
  };
  console.log("diles", files);
  console.log("activeFile", activeFile);
  return (
    <div className="flex bg-white">
      <div className="hidden sm:block w-2/12 h-screen">
        <LeftMenuBar />
      </div>
      <div className="w-full bg-background">
        <div className="p-0">
          <TopNavigationBar title={"File Versions"} />
        </div>
        {files && (
          <div>
            <VersionTable
              files={files}
              handleUpdateFile={handleRevertFile}
              activeFileId={activeFile}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default FileVersion;
