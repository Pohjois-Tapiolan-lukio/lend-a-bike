import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  //  Typography,
  Button,
  //  Grid,
  //  Card,
  //  CardContent,
  //  CardActions,
  //  ButtonBase,
  //  Dialog,
  //  DialogActions,
  //  DialogContent,
  //  DialogContentText,
  //  DialogTitle,
  //  TextField,
  //  List,
  //  ListItem,
  //  ListItemText,
  //  ListItemSecondaryAction,
  //  IconButton,
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
});

export const BikeCardButtons = withStyles(styles)(props => (
  <Fragment>
    <DeleteButton {...props} />
    <Button>
      <Edit />
    </Button>
    <Button>
      <ViewList />
    </Button>
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

// vim: et ts=2 sw=2 :
