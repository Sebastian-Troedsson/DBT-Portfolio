import React, { useState } from "react";
import { MdDashboard, MdSettings, MdContacts } from "react-icons/md";
import { NavLink } from "react-router-dom";
import "./style/SideNav.css";

function SideNav() {
  const [current, setCurrent] = useState("Dashboard");

  return (
    <div className="side-nav-container">
      <Header current={current}/>
      <div className="side-nav-body-container">
        <div className="side-nav-body">
        {/* <div className="side-nav-body-title">
          <span>DBT</span>
        </div> */}
          <ul>
            <NavLink to="/" exact>
              <li onClick={() => setCurrent("Dashboard")}>
                <MdDashboard />
                <span>Dashboard</span>
              </li>
            </NavLink>
            <NavLink to="/settings">
              <li onClick={() => setCurrent("Settings")}>
                <MdSettings />
                <span>Settings</span>
              </li>
            </NavLink>
            <a>
              <li>
                <MdContacts />
                <span>Contact</span>
              </li>
            </a>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Header({ current }) {
  return (
    <div className="side-nav-header">
      <span key={current} class="side-nav-current">{current}</span>
    </div>
  );
}

export default SideNav;
