import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  Inbox,
  Drafts,
  Star,
  Send,
  Mail,
  Delete,
  Report,
} from '@material-ui/icons';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  appFrame: {
    height: 430,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  appBar: {
    position: 'absolute',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'appBarShift-left': {
    marginLeft: drawerWidth,
  },
  'appBarShift-right': {
    marginRight: drawerWidth,
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  'content-left': {
    marginLeft: -drawerWidth,
  },
  'content-right': {
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'contentShift-left': {
    marginLeft: 0,
  },
  'contentShift-right': {
    marginRight: 0,
  },
});

const AdminDrawer = withStyles(styles)(
  class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        open: false,
      };
    }
    static propTypes = {
      classes: PropTypes.object.isRequired,
      theme: PropTypes.object.isRequired,
    };
    handleDrawerOpen = () => {
      this.setState({ open: true });
    };

    handleDrawerClose = () => {
      this.setState({ open: false });
    };

    render() {
      const { classes } = this.props;
      const { open } = this.state;

      return (
        <div className={classes.root}>
          <div className={classes.appFrame}>
            <AppBar
              className={classNames(classes.appBar, {
                [classes.appBarShift]: open,
                [classes['appBarShift-left']]: open,
              })}
              position="fixed"
            >
              <Toolbar disableGutters={!open}>
                <IconButton
                  color="inherit"
                  aria-label="Open drawer"
                  onClick={this.handleDrawerOpen}
                  className={classNames(
                    classes.menuButton,
                    open && classes.hide
                  )}
                >
                  <Menu />
                </IconButton>
                <Typography variant="title" color="inherit" noWrap>
                  Persistent drawer
                </Typography>
              </Toolbar>
            </AppBar>
            <Drawer
              variant="persistent"
              anchor="left"
              open={open}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              <div className={classes.drawerHeader}>
                <IconButton onClick={this.handleDrawerClose}>
                  <ChevronRight />
                </IconButton>
              </div>
              <Divider />
              <List>
                <ListItem button>
                  <ListItemIcon>
                    <Inbox />
                  </ListItemIcon>
                  <ListItemText primary="Inbox" />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <Star />
                  </ListItemIcon>
                  <ListItemText primary="Starred" />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <Send />
                  </ListItemIcon>
                  <ListItemText primary="Send mail" />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <Drafts />
                  </ListItemIcon>
                  <ListItemText primary="Drafts" />
                </ListItem>
              </List>
            </Drawer>
            {this.props.children}
          </div>
        </div>
      );
    }
  }
);

export default AdminDrawer;

// vim: et ts=2 sw=2 :
