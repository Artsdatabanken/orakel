import React from "react";
import "../App.css";
import CloseIcon from "@material-ui/icons/Close";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import AppleIcon from "@material-ui/icons/Apple";
import ShopOutlinedIcon from "@material-ui/icons/ShopOutlined";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import ReplayIcon from "@material-ui/icons/Replay";

function Menu({resetImages}) {

  const reset = () => {
    resetImages();
  }


  return (
    <div className="content">
      <CloseIcon />
      <div className="menuItem">
        <div>Slå på nattmodus</div>
        <Brightness4Icon />
      </div>

      <div
        className="menuItem"
        onClick={reset} 
      >
        <div>Restart appen</div>
        <ReplayIcon />
      </div>

      {!window.cordova && (
        <a
          href="https://play.google.com/store/apps/details?id=no.artsdatabanken.orakel"
          target="_blank"
          rel="noopener noreferrer"
          className="menuItem"
        >
          <div>Artsorakelet på Google Play</div>
          <ShopOutlinedIcon />
        </a>
      )}
      {!window.cordova && (
        <a
          href="https://apps.apple.com/no/app/id1522271415"
          target="_blank"
          rel="noopener noreferrer"
          className="menuItem"
        >
          <div>Artsorakelet i App Store</div>
          <AppleIcon />
        </a>
      )}

      <div className="menuItem">
        <div>Bruksanvisning</div>
        <MenuBookIcon />
      </div>

      <div className="menuItem">
        <div>Om Artsorakelet</div>
        <InfoOutlinedIcon />
      </div>
    </div>
  );
}

export default Menu;
