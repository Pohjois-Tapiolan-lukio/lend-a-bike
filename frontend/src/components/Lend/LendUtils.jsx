import React, { Component, Fragment } from 'react';
// import PropTypes from 'prop-types';
import {
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { DirectionsBike, Refresh } from '@material-ui/icons';

import { withContext } from '../DataContext';
import { bikeType } from '../../utils';

const styles = theme => ({
  fab: {
    marginLeft: theme.spacing.unit,
    background: 'linear-gradient(45deg, #c51162 30%, #f4701d 90%)',
    color: 'white',
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
  refreshIcon: {
    transform: 'scaleX(-1)',
  },
});

export const LendBike = withStyles(styles)(
  withContext(
    class extends Component {
      constructor(props) {
        super(props);
        this.state = {
          lender: '',
          disableSubmit: false,
          dialogOpen: false,
          submitStatus: -1,
        };
      }
      static propTypes = {
        selectedBike: bikeType,
      };

      handleChange = key => event => {
        this.setState({
          [key]: event.target.value,
        });
      };
      submit = event => {
        event.preventDefault();
        this.setState({
          disableSubmit: true,
          submitStatus: -1,
        });

        fetch('/api/lendings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lender: this.state.lender,
            bikeNumber: this.props.selectedBike.bikeNumber,
            bike_id: this.props.selectedBike._id,
          }),
        })
          .then(response => {
            if (response.ok) {
              this.setState({
                disableSubmit: false,
                lender: '',
                selectedBike: null,
                submitStatus: -1,
                dialogOpen: false,
              });
            } else {
              this.setState({
                disableSubmit: false,
                submitStatus: response.status.toString(),
              });
            }
          })
          .then(this.props.reloadLendings)
          .catch(error => {
            console.log(error);
          });
      };
      openDialog = () =>
        this.setState({
          dialogOpen: true,
        });
      closeDialog = () =>
        this.setState({
          dialogOpen: false,
        });
      render() {
        const { classes } = this.props;
        return (
          <Fragment>
            <Button
              className={classes.fab}
              variant="extendedFab"
              disabled={this.props.selectedBike === null}
              onClick={this.openDialog}
            >
              <DirectionsBike className={classes.extendedIcon} />
              Lainaa
            </Button>
            <Dialog
              open={this.state.dialogOpen}
              onClose={this.closeDialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">Lainaa pyörä</DialogTitle>
              <DialogContent>
                <Grid container>
                  <DialogContentText id="alert-dialog-description">
                    Kirjoita tietosi
                    <br />
                    {
                      {
                        // The dialog will actually never show the 200 code
                        '200': 'Lainaus luotu',
                        '403': 'Ei oikeutta (403)',
                        '409': 'Pyörä on käytössä (409)',
                      }[this.state.submitStatus]
                    }
                  </DialogContentText>
                  <Grid item xs={12}>
                    <form onSubmit={this.submit}>
                      <TextField
                        required
                        fullWidth
                        autoFocus
                        className={classes.textField}
                        id="lender"
                        placeholder="Nimi"
                        value={this.state.lender}
                        onChange={this.handleChange('lender')}
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
                  Sulje
                </Button>
                <Button
                  onClick={this.submit}
                  color="primary"
                  disabled={this.disableSubmit}
                >
                  Lainaa
                </Button>
              </DialogActions>
            </Dialog>
          </Fragment>
        );
      }
    }
  )
);

export const ReturnBike = withStyles(styles)(
  withContext(
    class extends Component {
      constructor(props) {
        super(props);
        this.state = {
          dialogOpen: false,
          lender: '',
          submitStatus: -1,
          disableSubmit: false,
        };
      }
      static propTypes = {
        selectedBike: bikeType.isRequired,
      };

      openDialog = () => this.setState({ dialogOpen: true });
      closeDialog = () => this.setState({ dialogOpen: false });
      handleChange = key => event =>
        this.setState({ [key]: event.target.value });

      returnBike = event => {
        event.preventDefault();
        this.setState({
          disableSubmit: true,
          submitStatus: -1,
        });

        fetch(`/api/lendings/return/${this.props.selectedBike._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lender: this.state.lender,
          }),
        })
          .then(response => {
            if (response.ok) {
              response.json().then(data => {
                this.setState({
                  lender: '',
                  dialogOpen: false,
                  disableSubmit: false,
                  submitStatus: -1,
                });
              });
            } else {
              this.setState({
                disableSubmit: false,
                submitStatus: response.status.toString(),
              });
            }
          })
          .then(this.props.reloadLendings)
          .catch(console.error);
      };

      render() {
        const { classes } = this.props;
        return (
          <Fragment>
            <Button
              className={classes.fab}
              variant="extendedFab"
              onClick={this.openDialog}
            >
              <Refresh
                className={`${classes.extendedIcon} ${classes.refreshIcon}`}
              />
              Palauta
            </Button>
            <Dialog
              open={this.state.dialogOpen}
              onClose={this.closeDialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">Palauta pyörä</DialogTitle>
              <DialogContent>
                <Grid container>
                  <DialogContentText id="alert-dialog-description">
                    Kirjoita nimesi
                    <br />
                    {
                      {
                        '200': 'Pyörä palautettu',
                        '400': 'Huono pyyntö (400)',
                      }[this.state.submitStatus]
                    }
                  </DialogContentText>
                  <Grid item xs={12}>
                    <form onSubmit={this.returnBike}>
                      <TextField
                        required
                        fullWidth
                        autoFocus
                        className={classes.textField}
                        id="lender"
                        placeholder="Nimi"
                        value={this.state.lender}
                        onChange={this.handleChange('lender')}
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
                  Sulje
                </Button>
                <Button
                  onClick={this.returnBike}
                  color="primary"
                  disabled={this.disableSubmit}
                >
                  Palauta
                </Button>
              </DialogActions>
            </Dialog>
          </Fragment>
        );
      }
    }
  )
);

// vim: et ts=2 sw=2 :
