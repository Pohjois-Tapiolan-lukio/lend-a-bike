import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {} from '@material-ui/core';

const styles = {};
export const Headsup = withStyles(styles)(
  class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        open: false,
      };
    }
    static propTypes = {
      classes: PropTypes.object.isRequired,
      message: PropTypes.string,
      action: PropTypes.node,
      withClose: PropTypes.bool,
      open: PropTypes.bool,
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
      const { classes, message, action } = this.props;
      const open = this.props.open ? this.props.open : this.state.open;
      return (
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={this.state.open}
          autoHideDuration={6000}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{message}</span>}
          action={
            action
              ? action
              : [
                  <Button
                    key="primaryAction"
                    color="secondary"
                    size="small"
                    onClick={this.handleClose}
                  >
                    {primaryAction}
                  </Button>,
                  withClose ? (
                    <IconButton
                      key="close"
                      aria-label="Close"
                      color="inherit"
                      className={classes.close}
                      onClick={this.handleClose}
                    >
                      <CloseIcon />
                    </IconButton>
                  ) : (
                    undefined
                  ),
                ]
          }
        />
      );
    }
  }
);

// vim: et ts=2 sw=2 :
