import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Divider,
  IconButton,
} from '@material-ui/core';
import { Menu, Security } from '@material-ui/icons';

import { AdminLogout, Breakdowns, SubmitBike, ImageSubmit } from '.';
import { withContext } from '../DataContext';

const styles = theme => ({
  list: {
    width: 250,
  },
  hide: {
    display: 'none',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  spacer: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -theme.spacing.unit,
    marginRight: 2 * theme.spacing.unit,
  },
  disableSelect: {
    userSelect: 'none',
  },
});

const AdminDrawer = withStyles(styles)(
  withContext(
    class extends Component {
      constructor(props) {
        super(props);
        this.state = {
          open: false,
        };
      }
      static propTypes = {
        classes: PropTypes.object.isRequired,
        adminToken: PropTypes.string.isRequired,
        reloadBikes: PropTypes.func.isRequired,
      };
      openDrawer = () => {
        this.setState({ open: true });
      };

      closeDrawer = () => {
        this.setState({ open: false });
      };

      render() {
        const { classes } = this.props;

        return (
          <Fragment>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.openDrawer}
              className={classNames(classes.menuButton)}
            >
              <Menu />
            </IconButton>
            <SwipeableDrawer
              open={this.state.open}
              onClose={this.closeDrawer}
              onOpen={this.openDrawer}
            >
              <List>
                <div className={classes.container}>
                  <ListItem className={classes.disableSelect}>
                    <ListItemIcon>
                      <Security />
                    </ListItemIcon>
                    <ListItemText primary="Admin valikko" />
                  </ListItem>
                  <Divider />
                  <SubmitBike
                    reloadBikes={this.props.reloadBikes}
                    adminToken={this.props.adminToken}
                  />
                  <Divider />
                  <Breakdowns />
                  <Divider />
                  <ImageSubmit />

                  <div className={classes.spacer} />
                  <Divider />
                  <AdminLogout />
                </div>
              </List>
            </SwipeableDrawer>
          </Fragment>
        );
      }
    }
  )
);

export default AdminDrawer;

// vim: et ts=2 sw=2 :
