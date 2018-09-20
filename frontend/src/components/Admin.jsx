import React, { Component, Fragment } from 'react';
import {
  Button,
  TextField,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
//import { Redirect } from 'react-router-dom';

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

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      password: '',
      disableSubmit: false,
      open: false,
    };
  }
  handleChange = key => event => {
    this.setState({ [key]: event.target.value });
  };
  closeDialog = () => {
    this.setState({ open: false });
  };
  openDialog = () => {
    this.setState({ open: true });
  };
  //  renderRedirect = () => {
  //    if (this.state.redirectHome) {
  //      return <Redirect to="/" />;
  //    }
  //  };
  handleSubmit = () => {
    this.setState({
      disableSubmit: true,
    });

    fetch('/api/admins/login', {
      method: 'POST',
      body: JSON.stringify({
        name: this.state.name,
        password: this.state.password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(result => {
        result.json().then(data => {
          if (result.status === 200) {
            this.props.setToken(data.token);
            this.setState({
              name: '',
              password: '',
              open: false,
              disableSubmit: false,
            });
          } else {
            this.setState({
              disableSubmit: false,
            });
          }
        });
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
      <Fragment>
        <Button onClick={this.openDialog} color="inherit">
          Admin login
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.closeDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Pääkäyttäjän sisäänkirjaus
          </DialogTitle>
          <DialogContent>
            <Grid container>
              <DialogContentText id="alert-dialog-description">
                Kirjaudu sisään
              </DialogContentText>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  autoFocus
                  className={classes.textField}
                  id="name"
                  placeholder="Nimi"
                  value={this.state.name}
                  onChange={this.handleChange('name')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  type="password"
                  className={classes.textField}
                  id="password"
                  placeholder="Salasana"
                  value={this.state.bikeId}
                  onChange={this.handleChange('password')}
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
              onClick={this.handleSubmit}
              color="primary"
              disabled={this.state.disableSubmit}
            >
              Kirjaudu
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

export default withStyles(styles)(Admin);

// vim: et ts=2 sw=2 :
