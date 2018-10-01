import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Zoom,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { DirectionsBike, Refresh } from '@material-ui/icons';

import { withContext } from '../DataContext';
import {
  getLentBikes,
  getAvailableBikes,
  bikeType,
  lendingType,
} from '../../utils';

const styles = theme => ({
  //fab: {
  //  marginLeft: theme.spacing.unit,
  //  background: 'linear-gradient(45deg, #c51162 30%, #f4701d 90%)',
  //  color: 'white',
  //},
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
  refreshIcon: {
    transform: 'scaleX(-1)',
  },
});

const FabZoom = withStyles(styles, { withTheme: true })(
  withContext(props => {
    const { index, theme } = props;
    const transitionDuration = {
      enter: theme.transitions.duration.enteringScreen,
      exit: theme.transitions.duration.leavingScreen,
    };

    return (
      <Zoom
        in={props.bikeViewIndex === index}
        timeout={transitionDuration}
        style={{
          transitionDelay: `${
            props.bikeViewIndex === index ? transitionDuration.exit : 0
          }ms`,
        }}
        unmountOnExit
      >
        {props.children}
      </Zoom>
    );
  })
);

// TODO create class fabs with subclasses
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
        bikes: PropTypes.arrayOf(bikeType).isRequired,
        lendings: PropTypes.arrayOf(lendingType).isRequired,
        clearSelection: PropTypes.func.isRequired,
      };

      handleChange = key => event => {
        this.setState({
          [key]: event.target.value,
        });
      };
      submit = event => {
        if (this.props.selectedBike === null) return;
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
                submitStatus: -1,
                dialogOpen: false,
              });
              this.props.reloadLendings();
              this.props.clearSelection();
            } else {
              // If you try to lend a bike that is already in use
              this.setState({
                disableSubmit: false,
                dialogOpen: false,
                lender: '',
                submitStatus: response.status.toString(),
              });
              this.props.reloadLendings();
              this.props.clearSelection();
            }
          })
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
        const availableBikes = getAvailableBikes(
          this.props.bikes,
          this.props.lendings
        );
        const disabled = !(
          availableBikes.length &&
          this.props.selectedBike &&
          availableBikes.some(
            availableBike => availableBike._id === this.props.selectedBike._id
          )
        );

        return (
          <Fragment>
            {/*
              <Button
                className={classes.fab}
                variant="extendedFab"
                disabled={this.props.selectedBike === null}
                onClick={this.openDialog}
              >
                <DirectionsBike className={classes.extendedIcon} />
                Lainaa
              </Button>
              */}

            <FabZoom index={0}>
              <Button
                className={classes.fab}
                color="primary"
                variant="fab"
                disabled={disabled}
                onClick={this.openDialog}
              >
                <DirectionsBike />
              </Button>
            </FabZoom>
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
        selectedBike: bikeType,
        bikes: PropTypes.arrayOf(bikeType).isRequired,
        lendings: PropTypes.arrayOf(lendingType).isRequired,
        clearSelection: PropTypes.func.isRequired,
      };

      openDialog = () => this.setState({ dialogOpen: true });
      closeDialog = () => this.setState({ dialogOpen: false });
      handleChange = key => event =>
        this.setState({ [key]: event.target.value });

      returnBike = event => {
        if (this.props.selectedBike === null) return;
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
              this.props.reloadLendings();
              this.props.clearSelection();
            } else {
              if (response.status === 400) {
                // The bike is not lent
                this.setState({
                  lender: '',
                  dialogOpen: false,
                  disableSubmit: false,
                  submitStatus: -1,
                });
                this.props.reloadLendings();
                this.props.clearSelection();
                return;
              }
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
        const lentBikes = getLentBikes(this.props.bikes, this.props.lendings);
        const disabled = !(
          lentBikes.length &&
          this.props.selectedBike &&
          lentBikes.some(
            lentBike => lentBike._id === this.props.selectedBike._id
          )
        );

        return (
          <Fragment>
            {/*
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
              */}
            <FabZoom index={1}>
              <Button
                className={classes.fab}
                color="secondary"
                variant="fab"
                disabled={disabled}
                onClick={this.openDialog}
              >
                <Refresh className={classes.refreshIcon} />
              </Button>
            </FabZoom>
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
                        '401': 'Väärä nimi (401)',
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
