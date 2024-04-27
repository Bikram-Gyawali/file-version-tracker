import axios from "axios";
import React, { useState, useEffect } from "react";
import LeftMenuBar from "../../Components/Dashboard/LeftMenuBar";
import TopNavigationBar from "../../Components/Dashboard/TopNavigationBar";

import { apiUrl } from "../../constant/base";
// import { Table } from "@chakra-ui/react";
import Table from "../../Components/Tables/Table";
import RoleModal from "./RoleModal";
function HomePage() {

  const [selectedUserId, setSelectedUserId] = React.useState(null);
  const [selectedRole, setSelectedRole] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [users, setUsers] = useState([]);
  const getUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/user`, {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
  
      if (response.data) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    getUsers();
  }, []);

  const handleUpdateRole = (userId) => {
    console.log("selectedUserId", userId);
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const handleRoleSelect = async (role) => {
    // Call your API here to update the user role
    await axios.put(`${apiUrl}/api/user/${selectedUserId}`, { role }, {
      headers: {
        authorization: "Bearer " + localStorage.getItem("token"),
      },
    })

    await getUsers();

    setIsModalOpen(false);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Role',
        accessor: 'role',
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => (
          <button
            className="btn btn-primary"
            disabled={row.original.role === 'admin'}
            onClick={() => handleUpdateRole(row.original?._id)}
          >
            Update Role
          </button>
        ),
      },
    ],
    []
  );

  const userRole = localStorage.getItem("role");
  return (
    <div className="flex bg-white">
      <div className="hidden sm:block w-2/12  h-screen">
        <LeftMenuBar />
      </div>

      {userRole === "admin" && (
        <div className="w-full bg-background">
          <div className="p-0">
            <TopNavigationBar title={"Users"} />

            {/* ## USING CONDITIONAL RENDERING HERE TO DIFFRENTIATE 1ST TIME USER AND WELL SETUP USER */}
            {/* keep table in center of screen */}
            <div className="">
              <Table columns={columns} data={users} className="w-full" />
            </div>
            <RoleModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSelectRole={handleRoleSelect}
            />
          </div>
        </div>
      )}
    </div>
  );
  
}

export default HomePage;
