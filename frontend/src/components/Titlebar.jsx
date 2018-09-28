import React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

import AdminLogin from './Admin';
import AdminDrawer from './AdminDrawer';
import { withContext } from './DataContext';

const styles = {
  titlebar: {
    flexGrow: 1,
  },
};

const Titlebar = props => (
  <AppBar position="fixed">
    <Toolbar>
      {props.adminToken ? <AdminDrawer /> : ''}
      <Typography variant="headline" color="inherit" style={styles.titlebar}>
        Kampuspyörät
      </Typography>
      <AdminLogin />
    </Toolbar>
  </AppBar>
);

export default withContext(Titlebar);

// vim: et ts=2 sw=2 :
