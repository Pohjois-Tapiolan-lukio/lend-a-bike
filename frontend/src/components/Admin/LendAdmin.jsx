import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Grid,
  List,
  ListItem,
  ListItemText,
  // ListItemSecondaryAction,
  // IconButton,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Delete, Edit, ViewList } from '@material-ui/icons';
import { red, grey as gray } from '@material-ui/core/colors';

import { withContext } from '../DataContext';

const styles = theme => ({
  cardAction: {
    display: 'block',
    textAlign: 'initial',
    width: '100%',
    height: '100%',
  },
  deleteConfirm: {
    color: red[400],
  },
  delete: {
    transition: 'color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  },
  textField: {
    marginTop: theme.spacing.unit,
  },
  listText: {
    marginRight: 2 * theme.spacing.unit,
  },
  listDialogContent: {
    padding: 0,
  },
  listList: {
    '&>li:nth-child(odd)': {
      background: gray[100],
    },
  },
});

export const BikeCardButtons = withStyles(styles)(
  withContext(props => (
    <Fragment>
      <DeleteButton {...props} />
      <EditButton {...props} />
      <ListButton {...{ ...props, styles }} />
    </Fragment>
  ))
);

const DeleteButton = withStyles(styles)(
  class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        pressedOnce: false,
        timeoutId: -1,
      };
    }
    static propTypes = {
      classes: PropTypes.object.isRequired,
      delay: PropTypes.number,
      bike: PropTypes.shape({
        _id: PropTypes.string.isRequired,
      }).isRequired,
      adminToken: PropTypes.string.isRequired,
    };
    static defaultProps = {
      delay: 2000,
    };
    handleClick = () => {
      if (this.state.pressedOnce) {
        if (this.state.timeoutId !== -1) {
          clearTimeout(this.state.timeoutId);
        }
        this.delete();
        this.setState({
          pressedOnce: false,
        });
        return;
      }
      this.setState({
        pressedOnce: true,
      });
      if (this.state.timeoutId !== -1) {
        clearTimeout(this.state.timeoutId);
      }
      this.setState({
        timeoutId: setTimeout(
          () =>
            this.setState({
              pressedOnce: false,
              timeoutId: -1,
            }),
          this.props.delay
        ),
      });
    };
    delete = () => {
      return (
        fetch(`/api/bikes/${this.props.bike._id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.props.adminToken}`,
          },
        })
          // TODO Headsup
          .then(() => {
            if (this.state.timeoutId !== -1) {
              clearTimeout(this.state.timeoutId);
            }
          })
          .then(this.props.reloadBikes)
          .catch(error => {
            console.log(error);
          })
      );
    };

    render() {
      const { classes } = this.props;
      return (
        <IconButton onClick={this.handleClick}>
          <Delete
            className={`${classes.delete} ${
              this.state.pressedOnce ? classes.deleteConfirm : ''
            }`}
          />
        </IconButton>
      );
    }
  }
);

const EditButton = withStyles(styles)(
  class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        dialogOpen: false,
        disableSubmit: false,
        submitStatus: '',
        name: props.bike.name,
        bikeNumber: props.bike.bikeNumber,
      };
    }
    static propTypes = {
      classes: PropTypes.object.isRequired,
      bike: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        bikeNumber: PropTypes.number.isRequired,
      }).isRequired,
      adminToken: PropTypes.string.isRequired,
    };
    closeDialog = () => this.setState({ dialogOpen: false });
    openDialog = () =>
      this.setState({
        dialogOpen: true,
        name: this.props.bike.name,
        bikeNumber: this.props.bike.bikeNumber,
      });
    handleChange = key => event => this.setState({ [key]: event.target.value });

    patchBike = event => {
      event.preventDefault();
      this.setState({
        disableSubmit: true,
        submitStatus: -1,
      });

      const Authorization = this.props.adminToken
        ? `Bearer ${this.props.adminToken}`
        : undefined;
      fetch(`/api/bikes/${this.props.bike._id}`, {
        method: 'PATCH',
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
                dialogOpen: false,
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
          <IconButton onClick={this.openDialog}>
            <Edit />
          </IconButton>
          <Dialog
            open={this.state.dialogOpen}
            onClose={this.closeDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
          >
            <DialogTitle id="alert-dialog-title">Muokkaa pyörää</DialogTitle>
            <DialogContent>
              <Grid container>
                <DialogContentText id="alert-dialog-description">
                  {
                    {
                      '200': 'Pyörä muokattu',
                      '403': 'Ei oikeutta (403)',
                    }[this.state.submitStatus]
                  }
                </DialogContentText>
                <Grid item xs={12}>
                  <form onSubmit={this.patchBike}>
                    <TextField
                      required
                      fullWidth
                      autoFocus
                      className={classes.textField}
                      id="name"
                      placeholder="Pyörän nimi"
                      value={this.state.name}
                      onChange={this.handleChange('name')}
                    />
                  </form>
                </Grid>
                <Grid item xs={12}>
                  <form onSubmit={this.patchBike}>
                    <TextField
                      required
                      fullWidth
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
                onClick={this.patchBike}
                color="primary"
                disabled={this.state.disableSubmit}
              >
                Muokkaa
              </Button>
            </DialogActions>
          </Dialog>
        </Fragment>
      );
    }
  }
);

const ListButton = withStyles(styles)(
  class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        dialogOpen: false,
      };
    }
    static propTypes = {
      classes: PropTypes.object.isRequired,
      bike: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        bikeNumber: PropTypes.number.isRequired,
      }).isRequired,
      adminToken: PropTypes.string.isRequired,
      bikes: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          bikeNumber: PropTypes.number.isRequired,
        })
      ),
      lendings: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          lender: PropTypes.string.isRequired,
          bike_id: PropTypes.string.isRequired,
          bikeNumber: PropTypes.number.isRequired,
          time: PropTypes.shape({
            lent: PropTypes.string.isRequired,
            returned: PropTypes.string.isRequired,
          }),
        })
      ),
    };
    static defaultProps = {};
    closeDialog = () => this.setState({ dialogOpen: false });
    openDialog = () => this.setState({ dialogOpen: true });

    render() {
      const { bike, lendings, classes } = this.props;
      const bikeLendings = lendings.filter(
        lending => lending.bikeNumber === bike.bikeNumber
      );
      return (
        <Fragment>
          <IconButton onClick={this.openDialog}>
            <ViewList />
          </IconButton>
          <Dialog
            open={this.state.dialogOpen}
            onClose={this.closeDialog}
            fullWidth
          >
            <DialogTitle id="alert-dialog-title">Pyörän lainaukset</DialogTitle>
            <DialogContent className={classes.listDialogContent}>
              <List className={classes.listList}>
                {bikeLendings.length ? (
                  bikeLendings.reverse().map(lending => (
                    <ListItem key={lending._id}>
                      <ListItemText
                        className={classes.listText}
                        primary={lending.lender}
                        secondary={new Date(lending.time.lent).toLocaleString(
                          'fi-FI'
                        )}
                      />
                      {/*
                          <ListItemSecondaryAction>
                            <IconButton aria-label="Delete">
                              <Delete />
                            </IconButton>
                          </ListItemSecondaryAction>
                        */}
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    {console.log()}
                    <ListItemText
                      className={classes.listText}
                      primary="Ei lainauksia"
                    />
                  </ListItem>
                )}
              </List>
            </DialogContent>
          </Dialog>
        </Fragment>
      );
    }
  }
);
// vim: et ts=2 sw=2 :