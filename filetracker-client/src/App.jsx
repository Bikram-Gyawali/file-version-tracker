import "./App.css";
import { Routes, Route } from "react-router-dom";
import Registration from "./Pages/Auth/Registration";
import Login from "./Pages/Auth/Login";
import HomePage from "./Pages/Dashboard/HomePage";
import Folders from "./Pages/Folders/Folders";
import Files from "./Pages/Files/File";
import FileVersion from "./Pages/FileVersions/FileVersion";
function App() {
 
  const userRole = localStorage.getItem("role");

  return (
    <div>
      <Routes>
        {/* <Route element={<ProtectedRoute />}> */}
        {userRole === "admin" && <Route path="/home" element={<HomePage />} />}
        <Route path="/folders" element={<Folders />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/folders/:folderId/files" element={<Files />} />
        <Route
          path="/folders/:folderId/files/:fileId/versions"
          element={<FileVersion />}
        />
      </Routes>{" "}
    </div>
  );
}

export default App;
