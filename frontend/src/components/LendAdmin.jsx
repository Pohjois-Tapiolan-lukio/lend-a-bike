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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Delete, Edit, ViewList } from '@material-ui/icons';
import red from '@material-ui/core/colors/red';

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
});

export const BikeCardButtons = withStyles(styles)(props => (
  <Fragment>
    <DeleteButton {...props} />
    <EditButton {...props} />
    <ListButton {...props} />
  </Fragment>
));

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
      delay: PropTypes.number,
      bike: PropTypes.shape({
        _id: PropTypes.string.isRequired,
      }).isRequired,
      onDelete: PropTypes.func,
      adminToken: PropTypes.string.isRequired,
    };
    static defaultProps = {
      delay: 2000,
      onDelete: () => {},
    };
    handleClick = () => {
      if (this.state.pressedOnce) {
        if (this.state.timeoutId !== -1) {
          clearTimeout(this.state.timeoutId);
        }
        this.delete().then(this.onDelete);
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
      return fetch(`/api/bikes/${this.props.bike._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.props.adminToken}`,
        },
      })
        .then(() => {
          if (this.state.timeoutId !== -1) {
            clearTimeout(this.state.timeoutId);
          }
        })
        .then(this.props.onDelete())
        .catch(error => {
          console.log(error);
        });
    };

    render() {
      const { classes } = this.props;
      return (
        <Button onClick={this.handleClick}>
          {this.state.pressedOnce ? (
            <Delete className={`${classes.deleteConfirm} ${classes.delete}`} />
          ) : (
            <Delete className={`${classes.delete}`} />
          )}
        </Button>
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
        bikeId: props.bike.bikeId,
      };
    }
    static propTypes = {
      bike: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        bikeId: PropTypes.string.isRequired,
      }).isRequired,
      adminToken: PropTypes.string.isRequired,
      onEdit: PropTypes.func,
    };
    static defaultProps = {
      onEdit: () => {},
    };
    closeDialog = () => this.setState({ dialogOpen: false });
    openDialog = () =>
      this.setState({
        dialogOpen: true,
        name: this.props.bike.name,
        bikeId: this.props.bike.bikeId,
      });
    handleChange = key => event => this.setState({ [key]: event.target.value });

    submitBike = () => {
      this.setState({ disableSubmit: true });

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
          bikeId: this.state.bikeId,
        }),
      })
        .then(result => {
          if (result.ok) {
            result.json().then(data => {
              if (result.status === 200) {
                this.setState({
                  name: '',
                  bikeId: '',
                  dialogOpen: false,
                  disableSubmit: false,
                  submitStatus: result.status.toString(),
                });
                this.props.onEdit();
              }
            });
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
          <Button onClick={this.openDialog}>
            <Edit />
          </Button>
          <Dialog
            open={this.state.dialogOpen}
            onClose={this.closeDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Muokkaa pyörää</DialogTitle>
            <DialogContent>
              <Grid container>
                <DialogContentText id="alert-dialog-description">
                  Kirjoita pyörän tiedot
                  <br />
                  {
                    {
                      '200': 'Pyörä muokattu',
                      '403': 'Ei oikeutta (403)',
                    }[this.state.submitStatus]
                  }
                </DialogContentText>
                <Grid item xs={12}>
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
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    className={classes.textField}
                    id="bikeId"
                    placeholder="Pyörän ID"
                    value={this.state.bikeId}
                    onChange={this.handleChange('bikeId')}
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
                Kumoa
              </Button>
              <Button
                onClick={this.submitBike}
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
        lendings: [],
      };
    }
    static propTypes = {
      bike: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        bikeId: PropTypes.string.isRequired,
      }).isRequired,
      adminToken: PropTypes.string.isRequired,
    };
    static defaultProps = {};
    closeDialog = () => this.setState({ dialogOpen: false });
    openDialog = () => this.setState({ dialogOpen: true });
    reloadLendings = () => {
      fetch('/api/lendings?filter=unreturned', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(result => result.json())
        .then(result => {
          this.setState({
            lendings: result,
          });
        })
        .catch(error => console.log);
    };

    render() {
      return (
        <Fragment>
          <Button onClick={this.openDialog}>
            <ViewList />
          </Button>
          <Dialog open={this.state.dialogOpen} onClose={this.closeDialog}>
            <DialogTitle id="alert-dialog-title">Pyörän lainaukset</DialogTitle>
            <DialogContent>
              <List>
                {this.state.lendings.map(lendings => (
                  <ListItem>
                    <ListItemText
                      primary=''
                      secondary=''
                    />
                    <ListItemSecondaryAction>
                      <IconButton aria-label="Delete">
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </DialogContent>
          </Dialog>
        </Fragment>
      );
    }
  }
);
// vim: et ts=2 sw=2 :
