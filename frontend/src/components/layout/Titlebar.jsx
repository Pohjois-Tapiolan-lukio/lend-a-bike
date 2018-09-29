import React from 'react';
import { AppBar, Toolbar } from '@material-ui/core';

export const TitlebarBase = props => (
  <AppBar position="fixed">
    <Toolbar>{props.children}</Toolbar>
  </AppBar>
);

// vim: et ts=2 sw=2 :
