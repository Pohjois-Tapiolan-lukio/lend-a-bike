import React, { Component } from 'react';
import {
  Button,
  TextField,
  Grid,
  Paper,
  Snackbar,
  IconButton,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Close } from '@material-ui/icons';
import { Redirect } from 'react-router-dom';

const styles = theme => ({
  Button: {
    margin: 10,
  },
  center: {
    top: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  root: {
    marginTop: 20,
    flexGrow: 1,
    //maxWidth: 600,
    padding: theme.spacing.unit * 2,
  },
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
});

class Login extends Component {
  constructor(props) {
    super(props);
    const hasToken = props.cookies.get('memoserverjwt') !== undefined;
    this.state = {
      email: '',
      password: '',
      disableSubmit: false,
      signedIn: hasToken,
      redirectHome: false,
      snackOpen: hasToken,
    };
  }

  handleChange = key => event => {
    this.setState({
      [key]: event.target.value,
    });
  };

  handleClose = event => {
    this.setState({
      snackOpen: false,
    });
  };

  renderRedirect = () => {
    if (this.state.redirectHome) {
      return <Redirect to="/" />;
    }
  };

  handleSubmit = component => {
    this.setState({
      disableSubmit: true,
    });

    fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(body => {
        console.log(body);
        if (body.token) {
          this.props.cookies.set('memoserverjwt', body.token);
          this.setState({
            disableSubmit: false,
            signedIn: true,
            snackOpen: true,
          });
        } else {
          this.setState({
            disableSubmit: false,
            signedIn: false,
          });
        }
      })
      .catch(err => {
        console.error(err);
        this.setState({
          disableSubmit: false,
        });
      });
  };

  render() {
    const { classes } = this.props;
    return (
      <Grid container direction="row" justify="center">
        <Grid item xs={12} sm={8}>
          <Paper className={`${classes.root} ${classes.center}`}>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="flex-start"
            >
              <Grid item xs={12}>
                <TextField
                  id="email"
                  label="Email"
                  value={this.state.name}
                  onChange={this.handleChange('email')}
                  margin="normal"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="password"
                  label="Password"
                  type="password"
                  value={this.state.password}
                  onChange={this.handleChange('password')}
                  margin="normal"
                  fullWidth
                />
              </Grid>
              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={this.handleSubmit}
                  className={classes.Button}
                  disabled={this.state.disableSubmit}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>

            <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              open={this.state.snackOpen}
              autoHideDuration={6000}
              onClose={this.handleClose}
              ContentProps={{
                'aria-describedby': 'message-id',
              }}
              message={<span id="message-id">You are signed in</span>}
              action={[
                <Button
                  key="undo"
                  color="secondary"
                  size="small"
                  onClick={() => this.setState({ redirectHome: true })}
                >
                  HOME
                </Button>,
                <IconButton
                  key="close"
                  aria-label="Close"
                  color="inherit"
                  className={classes.close}
                  onClick={this.handleClose}
                >
                  <Close />
                </IconButton>,
              ]}
            />

            {this.renderRedirect()}
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Login);

// vim: et ts=2 sw=2 :
