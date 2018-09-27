import React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

import Admin from './Admin';
import AdminDrawer from './AdminDrawer';

const styles = {
  titlebar: {
    flexGrow: 1,
  },
};

const Titlebar = props => (
  <AppBar position="fixed">
    <Toolbar>
      {props.adminToken ? <AdminDrawer adminToken={props.adminToken} /> : ''}
      <Typography variant="headline" color="inherit" style={styles.titlebar}>
        Kampuspyörät
      </Typography>
      <Admin setToken={props.setToken} adminToken={props.adminToken} />
    </Toolbar>
  </AppBar>
);

export default Titlebar;

// vim: et ts=2 sw=2 :
