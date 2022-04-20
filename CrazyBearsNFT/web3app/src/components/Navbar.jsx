import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Marketplace from "./Marketplace";

const Navbar = () => {
  const [isOpen, setOpen] = useState(false);
  return (
    <nav className="navbar navbar-expand-sm bg-light navbar-light mg">
      <div className={` container-fluid navbar-menu ${isOpen && "is-active"}`}>
        <ul className="navbar-nav ">
          <li className="nav-item ml-auto">
            <NavLink
              className="nav-link logo"
              activeclassname="is-active"
              to="/"
              exact="true"
            >
              CrazyBearzz
            </NavLink>
          </li>
          <li className="nav-item float-right">
            <NavLink
              className="nav-link"
              activeclassname="is-active"
              to="collection"
              exact="true"
            >
              Your collection
            </NavLink>
          </li>
          <li className="nav-item nav-start">
            <NavLink
              className="nav-link"
              activeclassname="is-active"
              to="marketplace"
              exact="true"
            >
              Market
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className="nav-link"
              activeclassname="is-active"
              to="mint"
              exact="true"
            >
              Other
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
