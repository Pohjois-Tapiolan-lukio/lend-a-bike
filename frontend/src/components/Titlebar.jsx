import React, { Component } from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

const styles = {
  titlebar: {
    flexGrow: 1,
  },
};

class Titlebar extends Component {
  render() {
    return (
      <AppBar position='fixed'>
        <Toolbar>
          <Typography
            variant="headline"
            color="inherit"
            style={styles.titlebar}
          >
            Lend-a-Bike
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

//export default withContentRect('bounds')(measure =>
//  <Titlebar
//    measure={measure}
//  />);
export default Titlebar;

// vim: et ts=2 sw=2 :
