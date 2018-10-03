import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Snackbar, Button, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';

const styles = theme => ({
  close: {
    padding: theme.spacing.unit / 2,
  },
});

export const Headsup = withStyles(styles)(
  class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        open: props.startOpen ? true : false,
      };
    }
    static propTypes = {
      classes: PropTypes.object.isRequired,
      message: PropTypes.string,
      action: PropTypes.node,
      primaryAction: PropTypes.node,
      withClose: PropTypes.bool,
      open: PropTypes.bool,
      startOpen: PropTypes.bool,
    };
    static defaultProps = {
      withClose: true,
      primaryAction: 'primary',
    };

    handleClick = () => {
      this.setState({ open: true });
    };
    handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      this.setState({ open: false });
    };
    render() {
      const { classes, message, action, primaryAction, withClose } = this.props;
      const open = this.props.open ? this.props.open : this.state.open;

      return (
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={open}
          autoHideDuration={6000}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{message}</span>}
          action={[
            action || action === '' ? (
              action
            ) : (
              <Button
                key="primaryAction"
                color="secondary"
                size="small"
                onClick={this.handleClose}
              >
                {primaryAction}
              </Button>
            ),
            withClose ? (
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                className={classes.close}
                onClick={this.handleClose}
              >
                <Close />
              </IconButton>
            ) : null,
          ]}
        />
      );
    }
  }
);

// vim: et ts=2 sw=2 :
