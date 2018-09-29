import React from 'react';
import { AppBar } from '@material-ui/core';

export const TitlebarBase = props => (
  <AppBar position="fixed">{props.children}</AppBar>
);

// vim: et ts=2 sw=2 :
