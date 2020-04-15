import React from "react";
import "./style/Header.css";
import { MdAccountCircle, MdSearch, MdCode } from "react-icons/md";

function Header() {
  return (
    <header className="main-header">
      <div className="icons">
        <MdSearch />
        <MdCode />
        <MdAccountCircle />
      </div>
    </header>
  );
}

export default Header;
