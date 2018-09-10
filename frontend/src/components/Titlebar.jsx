import React, { Component } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core';
import Measure, { withContentRect } from 'react-measure';

const styles = {
  titlebar: {
    flexGrow: 1,
  },
}

class Titlebar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Measure
        bounds
        onResize={this.props.handleResize}
      >
        {({ measureRef }) =>
          <AppBar positionAbsolute>
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
        }
      </Measure>
    );
  }
}

//export default withContentRect('bounds')(measure =>
//  <Titlebar
//    measure={measure}
//  />);
export default Titlebar;

// vim: et ts=2 sw=2 :
