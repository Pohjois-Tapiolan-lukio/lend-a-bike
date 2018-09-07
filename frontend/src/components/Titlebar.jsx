import React, { Component } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core';

const styles = {
  titlebar: {
    flexGrow: 1,
  },
}

export default class Titlebar extends Component {
  render() {
    return (
      <AppBar position='static'>
        <Toolbar>
          <Typography
            variant='headline'
            color='inherit'
            style={styles.titlebar}
          >
            Lend-a-Bike
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

// vim: et ts=2 sw=2 :
