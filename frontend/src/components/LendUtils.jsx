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
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { DirectionsBike, Refresh } from '@material-ui/icons';

import { withContext } from './DataContext';

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

// TODO make this a component, like ReturnBike
export const LendBike = withStyles(styles)(
  withContext(props => (
    <Fragment>
      <Button
        className={props.classes.fab}
        variant="extendedFab"
        disabled={props.selectedBike === ''}
        onClick={props.openDialog}
      >
        <DirectionsBike className={props.classes.extendedIcon} />
        Lainaa
      </Button>
      <Dialog
        open={props.dialogOpen}
        onClose={props.closeDialog}
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
                  '200': 'Lainaus luotu',
                  '403': 'Ei oikeutta (403)',
                  '409': 'Pyörä on käytössä (409)',
                }[props.submitStatus]
              }
            </DialogContentText>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                autoFocus
                className={props.classes.textField}
                id="lender"
                placeholder="Nimi"
                value={props.lender}
                onChange={props.handleChange('lender')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={props.closeDialog}
            variant="contained"
            color="secondary"
          >
            Sulje
          </Button>
          <Button
            onClick={props.submit}
            color="primary"
            disabled={props.disableSubmit}
          >
            Lainaa
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  ))
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
        selectedBike: PropTypes.shape({
          lender: PropTypes.string,
          _id: PropTypes.string.isRequired,
        }),
        onReturn: PropTypes.func,
      };
      static defaultProps = {
        onReturn: () => {},
      };

      openDialog = () => this.setState({ dialogOpen: true });
      closeDialog = () => this.setState({ dialogOpen: false });
      handleChange = key => event =>
        this.setState({ [key]: event.target.value });

      returnBike = () => {
        this.setState({ disableSubmit: true });

        fetch(`/api/lendings/return/${this.props.selectedBike._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lender: this.state.lender,
          }),
        })
          .then(result => {
            if (result.ok) {
              result
                .json()
                .then(data => {
                  if (result.status === 200) {
                    this.setState({
                      lender: '',
                      dialogOpen: false,
                      disableSubmit: false,
                      submitStatus: result.status.toString(),
                    });
                  }
                })
                .then(this.props.onReturn);
            } else {
              this.setState({
                disableSubmit: false,
                submitStatus: result.status.toString(),
              });
            }
          })
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
