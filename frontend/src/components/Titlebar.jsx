import React from 'react';
import { Typography } from '@material-ui/core';

import AdminLogin from './Admin';
import AdminDrawer from './AdminDrawer';
import { withContext } from './DataContext';
import { TitlebarBase } from './layout';

const styles = {
  titlebar: {
    flexGrow: 1,
  },
};

const Titlebar = props => (
  <TitlebarBase>
    {props.adminToken ? <AdminDrawer /> : ''}
    <Typography variant="headline" color="inherit" style={styles.titlebar}>
      Kampuspyörät
    </Typography>
    <AdminLogin />
  </TitlebarBase>
);

export default withContext(Titlebar);

// vim: et ts=2 sw=2 :
