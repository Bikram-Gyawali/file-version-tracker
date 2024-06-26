import React from "react";
import Home from "../../assets/icons/home.svg";

import Employees from "../../assets/icons/employees.svg";
import Candidates from "../../assets/icons/candidates.svg";
import Jobs from "../../assets/icons/jobs.svg";
import Report from "../../assets/icons/reports.svg";
import Settings from "../../assets/icons/settings.svg";
import { Link, useNavigate } from "react-router-dom";

function LeftMenuBar() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");
  return (
    <div className="flex flex-col">
      <div className="flex flex-col justify-center items-center mt-14">
        <div className="m-auto w-full  flex-col  flex  items-center justify-center ">
          {/* HOME */}
          {userRole === "admin" && (
          <div className=" w-full bg-white hover:bg-blue-100 transition-all duration-[850ms] hover:rounded-lg ease-out py-2  ml-8 mb-2 flex items-center">
            <div className="w-1/5">
              <svg
                className="m-auto"
                width="23"
                height="21"
                viewBox="0 0 23 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.5 16.1948V13.3409M8.371 1.78253L2.7115 5.77801C1.7665 6.44392 1 7.86136 1 8.93633V15.9855C1 18.1925 2.9845 20 5.4205 20H17.5795C20.0155 20 22 18.1925 22 15.995V9.06952C22 7.91844 21.1495 6.44392 20.11 5.78752L13.621 1.66837C12.151 0.736093 9.7885 0.783659 8.371 1.78253Z"
                  //Chane stroke value to make a change in color
                  stroke="#0162B2"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>{" "}
            </div>
            
              <Link to={"/"}>
                <div className="inline ml-2 mt-1">
                  <button className="inline navMenuFont">Users</button>
                </div>
              </Link>
          </div>
            )}
          {userRole !== "admin" && (
            <div className="w-full bg-white hover:bg-blue-100 transition-all duration-[850ms] hover:rounded-lg ease-out py-2  ml-8 mb-2 flex items-center">
              <div className="w-1/5">
                <svg
                  className="m-auto"
                  width="33"
                  height="32"
                  viewBox="0 0 33 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24.2403 19.6577C26.3675 20.0026 28.7121 19.6427 30.358 18.5778C32.5473 17.168 32.5473 14.8583 30.358 13.4484C28.6966 12.3836 26.3209 12.0236 24.1937 12.3836M8.75971 19.6577C6.63248 20.0026 4.28788 19.6427 2.642 18.5778C0.452667 17.168 0.452667 14.8583 2.642 13.4484C4.30341 12.3836 6.67906 12.0236 8.80629 12.3836M25.8396 8.73903C25.7419 8.72402 25.6423 8.72402 25.5446 8.73903C24.5083 8.70284 23.5273 8.2789 22.8087 7.55682C22.0901 6.83474 21.6903 5.87109 21.6938 4.86952C21.6938 2.72478 23.4795 1 25.6999 1C26.7623 1 27.7813 1.40768 28.5325 2.13336C29.2838 2.85903 29.7059 3.84326 29.7059 4.86952C29.703 5.8718 29.299 6.8342 28.5785 7.5554C27.8579 8.27659 26.8765 8.70071 25.8396 8.73903ZM7.16041 8.73903C7.25357 8.72403 7.36226 8.72403 7.45542 8.73903C8.49166 8.70284 9.47273 8.2789 10.1913 7.55682C10.9099 6.83474 11.3097 5.87109 11.3062 4.86952C11.3062 2.72478 9.52054 1 7.30015 1C6.23769 1 5.21875 1.40768 4.46747 2.13336C3.7162 2.85903 3.29414 3.84326 3.29414 4.86952C3.30967 6.96925 5.01766 8.66404 7.16041 8.73903ZM16.5233 19.9426C16.4256 19.9276 16.326 19.9276 16.2283 19.9426C15.192 19.9064 14.211 19.4825 13.4924 18.7604C12.7738 18.0383 12.374 17.0747 12.3775 16.0731C12.3775 13.9284 14.1632 12.2036 16.3835 12.2036C17.446 12.2036 18.465 12.6113 19.2162 13.337C19.9675 14.0626 20.3896 15.0469 20.3896 16.0731C20.374 18.1729 18.666 19.8826 16.5233 19.9426ZM12.0049 24.667C9.81555 26.0769 9.81555 28.3866 12.0049 29.7964C14.4892 31.4012 18.5574 31.4012 21.0417 29.7964C23.231 28.3866 23.231 26.0769 21.0417 24.667C18.5729 23.0772 14.4892 23.0772 12.0049 24.667Z"
                    stroke="#333232"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <Link to={"/folders"}>
                <div className="inline ml-2 mt-1">
                  <button className="inline navMenuFont">USER FOLDERS</button>
                </div>
              </Link>
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LeftMenuBar;
