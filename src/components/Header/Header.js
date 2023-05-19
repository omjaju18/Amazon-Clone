import React from "react";

import SearchIcon from "@mui/icons-material/Search";
import { ShoppingBasket } from "@mui/icons-material";

import { Link } from "react-router-dom";
import { useStateValue } from "../../StateProvider";
import { auth } from "../../firebase";

import "../Header/Header.css";

function Header() {
  const [{ basket, user }, dispatch] = useStateValue();

  const handleAuthentication = () => {
    if (user) {
      auth.signOut();
    }
  };

  return (
    <div className="header">
      <Link to="/">
        <img
          className="header-logo"
          src="http://pngimg.com/uploads/amazon/amazon_PNG11.png"
          alt="amazon-logo"
        />
      </Link>
      {/* logo on the left
            search box
            3 links
            basket icon with number */}

      <div className="header-search">
        <input className="header-searchInput" type="text" />
        <SearchIcon className="header-searchIcon" color="primary" />
      </div>

      <div className="header-nav">
        <Link to={!user && "/login"} className="option-hover">
          <div onClick={handleAuthentication} className="header-option">
            <span className="header-optionLineOne">
              Hello {!user ? "Guest" : user.email}
            </span>
            <span className="header-optionLineTwo">
              {" "}
              {user ? "Sign Out" : "Sign in"}
            </span>
          </div>
        </Link>

        <Link to="/orders">
          <div className="header-option">
            <span className="header-optionLineOne">Returns</span>
            <span className="header-optionLineTwo"> & Orders</span>
          </div>
        </Link>

        <div className="header-option">
          <span className="header-optionLineOne"> Your</span>
          <span className="header-optionLineTwo"> Prime</span>
        </div>

        <Link to="/checkout">
          <div className="header-optionBasket">
            {/* Shopping basket icon */}
            <ShoppingBasket />
            {/* Number of items in the basket */}
            <span className="header-optionLineTwo header-basketCount">
              {basket.length}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Header;
