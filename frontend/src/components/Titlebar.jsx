import React from 'react';
import { Typography, Tab, Toolbar } from '@material-ui/core';

import { AdminDrawer, AdminLogin } from './Admin';
import { withContext } from './DataContext';
import { TitlebarBase, BikeTabs } from './layouts';

const styles = {
  titlebar: {
    flexGrow: 1,
  },
};

const Titlebar = props => (
  <TitlebarBase>
    <Toolbar>
      {props.adminToken ? <AdminDrawer /> : ''}
      <Typography variant="headline" color="inherit" style={styles.titlebar}>
        Kampuspyörät
      </Typography>
      <AdminLogin />
    </Toolbar>
    <BikeTabs
      value={props.bikeViewIndex}
      onChange={(event, value) => props.changeBikeViewIndex(value)}
    >
      <Tab label="Lainaa pyörä" />
      <Tab label="Palauta pyörä" />
    </BikeTabs>
  </TitlebarBase>
);

export default withContext(Titlebar);

// vim: et ts=2 sw=2 :
