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
});

export const BikeCardButtons = withStyles(styles)(props => (
  <Fragment>
    <DeleteButton />
    <Button>
      <Edit />
    </Button>
    <Button>
      <ViewList />
    </Button>
  </Fragment>
));

class DeleteButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pressedOnce: false,
    };
  }
  handleClick = () => {
    if (this.state.pressedOnce) {
      this.delete();
      return;
    }
    this.setState({
      pressedOnce: true,
    });
    setTimeout(
      () =>
        this.setState({
          pressedOnce: false,
        }),
      this.props.delay
    );
  };
  delete = () => {
    fetch(`/api/bikes/${this.props.bike._id}`, {
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
    return (
      <Button onClick={this.handleClick}>
        <Delete />
      </Button>
    );
  }
}

DeleteButton.propTypes = {
  delay: PropTypes.number,
  bike: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    bikeId: PropTypes.string.isRequired,
    lender: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func,
};

// vim: et ts=2 sw=2 :
