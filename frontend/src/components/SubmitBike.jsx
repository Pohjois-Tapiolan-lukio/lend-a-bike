import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Grid,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Add } from '@material-ui/icons';

import { withContext } from './DataContext';

const styles = theme => ({
  textField: {
    marginTop: theme.spacing.unit,
  },
});

class SubmitBike extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      disableSubmit: false,
      submitStatus: '',
      name: '',
      bikeNumber: '',
    };
  }
  static propTypes = {
    adminToken: PropTypes.string.isRequired,
    reloadBikes: PropTypes.func.isRequired,
  };

  closeDialog = () => this.setState({ open: false });
  openDialog = () => this.setState({ open: true });
  handleChange = key => event => this.setState({ [key]: event.target.value });
  submitBike = event => {
    event.preventDefault();
    this.setState({
      disableSubmit: true,
      submitStatus: -1,
    });

    // TODO useless ternary
    const Authorization = this.props.adminToken
      ? `Bearer ${this.props.adminToken}`
      : undefined;
    fetch('/api/bikes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization,
      },
      body: JSON.stringify({
        name: this.state.name,
        bikeNumber: this.state.bikeNumber,
      }),
    })
      .then(response => {
        if (response.ok) {
          response.json().then(data => {
            this.setState({
              name: '',
              bikeNumber: '',
              open: false,
              disableSubmit: false,
              submitStatus: -1,
            });
            this.props.reloadBikes();
          });
        } else {
          this.setState({
            disableSubmit: false,
            submitStatus: response.status.toString(),
          });
        }
      })
      .catch(console.error);
  };

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <ListItem button onClick={this.openDialog}>
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          <ListItemText primary="Lisää pyörä" />
        </ListItem>
        <Dialog
          open={this.state.open}
          onClose={this.closeDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Lisää uusi pyörä</DialogTitle>
          <DialogContent>
            <Grid container>
              <DialogContentText id="alert-dialog-description">
                Kirjoita pyörän tiedot
                <br />
                {
                  {
                    '201': 'Pyörä luotu',
                    '400': 'Lomake ei vastaa vaatimuksia (400)',
                    '403': 'Ei oikeutta (403)',
                    '409': 'Pyörä on jo lisätty (409)',
                  }[this.state.submitStatus]
                }
              </DialogContentText>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  autoFocus={this.state.name ? false : true}
                  className={classes.textField}
                  id="name"
                  placeholder="Pyörän nimi"
                  value={this.state.name}
                  onChange={this.handleChange('name')}
                />
              </Grid>
              <Grid item xs={12}>
                <form onSubmit={this.submitBike}>
                  <TextField
                    required
                    fullWidth
                    autoFocus={this.state.name ? true : false}
                    className={classes.textField}
                    id="bikeNumber"
                    placeholder="Pyörän ID"
                    value={this.state.bikeNumber}
                    onChange={this.handleChange('bikeNumber')}
                  />
                </form>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.closeDialog}
              variant="contained"
              color="secondary"
            >
              Kumoa
            </Button>
            <Button
              onClick={this.submitBike}
              color="primary"
              disabled={this.state.disableSubmit}
            >
              Lisää
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

export default withStyles(styles)(withContext(SubmitBike));

// vim: et ts=2 sw=2 :
