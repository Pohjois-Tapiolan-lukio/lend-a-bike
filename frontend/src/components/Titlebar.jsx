import React, { Component } from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

import Admin from './Admin';

const styles = {
  titlebar: {
    flexGrow: 1,
  },
};

const Titlebar = props => (
  <AppBar position="fixed">
    <Toolbar>
      <Typography variant="headline" color="inherit" style={styles.titlebar}>
        Lend-a-Bike
      </Typography>
      <Admin setToken={props.setToken}/>
    </Toolbar>
  </AppBar>
);

//export default withContentRect('bounds')(measure =>
//  <Titlebar
//    measure={measure}
//  />);
export default Titlebar;

// vim: et ts=2 sw=2 :
