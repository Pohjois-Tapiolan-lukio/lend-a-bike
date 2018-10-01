import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  TextField,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Slide,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { withContext } from '../DataContext';
import { Build, Close } from '@material-ui/icons';
import { grey as gray } from '@material-ui/core/colors';

import { lendingType, bikeType, breakdownType } from '../../utils';

const styles = theme => ({
  flex: {
    flexGrow: 1,
  },
  title: {
    position: 'relative',
  },
  listList: {
    '&>li:nth-child(odd)': {
      background: gray[100],
    },
  },
});

const Transition = props => <Slide direction="up" {...props} />;

export const Breakdowns = withStyles(styles)(
  withContext(
    class extends Component {
      constructor(props) {
        super(props);
        this.state = {
          dialogOpen: false,
        };
      }
      static propTypes = {
        classes: PropTypes.object.isRequired,
        bikes: PropTypes.arrayOf(bikeType).isRequired,
        breakdowns: PropTypes.arrayOf(breakdownType).isRequired,
        adminToken: PropTypes.string.isRequired,
      };
      closeDialog = () => {
        this.setState({ dialogOpen: false });
      };
      openDialog = () => {
        this.setState({ dialogOpen: true });
      };
      render() {
        const { classes, bikes, breakdowns } = this.props;

        return (
          <Fragment>
            <ListItem button onClick={this.openDialog}>
              <ListItemIcon>
                <Build />
              </ListItemIcon>
              <ListItemText primary="Pyörät huollossa" />
            </ListItem>
            <Dialog
              fullScreen
              open={this.state.dialogOpen}
              onClose={this.closeDialog}
              TransitionComponent={Transition}
            >
              <AppBar className={classes.title}>
                <Toolbar>
                  <Typography
                    variant="title"
                    color="inherit"
                    className={classes.flex}
                  >
                    Huollossa olevat pyörät
                  </Typography>
                  <IconButton
                    color="inherit"
                    onClick={this.closeDialog}
                    aria-label="Close"
                  >
                    <Close />
                  </IconButton>
                </Toolbar>
              </AppBar>
              <List className={classes.listList}>
                {breakdowns.map(breakdown => {
                  const bikeByNumber = bikes.filter(
                    bike => bike.bikeNumber === breakdown.bikeNumber
                  )[0];
                  return bikeByNumber !== undefined ? (
                    <ListItem key={breakdown.bikeNumber}>
                      <ListItemText
                        primary={bikeByNumber.name}
                        secondary={breakdown.bikeNumber}
                      />
                    </ListItem>
                  ) : (
                    <ListItem>
                      <ListItemText
                        primary="unknown bike"
                        secondary={breakdown.bikeNumber}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Dialog>
          </Fragment>
        );
      }
    }
  )
);

// vim: et ts=2 sw=2 :
