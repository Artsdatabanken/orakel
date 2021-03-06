import React from "react";
import "../App.css";
import CloseIcon from "@material-ui/icons/Close";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import AppleIcon from "@material-ui/icons/Apple";
import ShopOutlinedIcon from "@material-ui/icons/ShopOutlined";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import ReplayIcon from "@material-ui/icons/Replay";

function Menu({ resetImages, toggleDarkMode, darkMode, toggleAbout, toggleManual}) {

  const openAbout = () => {
    toggleAbout(true);
  };

  const openManual = () => {
    toggleManual(true);
  };

  return (
    <div className="content">
      <CloseIcon />
      <div className="menuItem" onClick={toggleDarkMode}>
        <div>Slå {darkMode ? "av": "på"} nattmodus</div>
        <Brightness4Icon />
      </div>

      <div className="menuItem" onClick={resetImages}>
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

      <div className="menuItem" onClick={openManual}>
        <div>Bruksanvisning</div>
        <MenuBookIcon />
      </div>

      <div className="menuItem" onClick={openAbout}>
        <div>Om Artsorakelet</div>
        <InfoOutlinedIcon />
      </div>
    </div>
  );
}

export default Menu;
