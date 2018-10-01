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
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { withContext } from '../DataContext';
import { PowerSettingsNew, Security } from '@material-ui/icons';

const styles = theme => ({
  Button: {
    margin: 10,
  },
  center: {
    top: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
  textField: {
    marginTop: theme.spacing.unit,
  },
});

export const AdminLogin = withStyles(styles)(
  withContext(
    class extends Component {
      constructor(props) {
        super(props);
        this.state = {
          name: '',
          password: '',
          disableSubmit: false,
          open: false,
          submitStatus: -1,
        };
      }
      // TODO missing proptypes
      handleChange = key => event => {
        this.setState({ [key]: event.target.value });
      };
      closeDialog = () => {
        this.setState({ open: false });
      };
      openDialog = () => {
        this.setState({ open: true });
      };
      handleSubmit = event => {
        event.preventDefault();
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
          .then(response => {
            if (response.ok) {
              response.json().then(data => {
                this.props.setToken(data.token);
                this.setState({
                  name: '',
                  password: '',
                  open: false,
                  disableSubmit: false,
                  submitStatus: -1,
                });
              });
            } else {
              this.setState({
                disableSubmit: false,
                submitStatus: response.status.toString(),
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
          <Fragment>
            <Button onClick={this.openDialog} color="inherit">
              {this.props.adminToken ? <Security /> : 'Kirjaudu'}
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
                      autoFocus={this.state.name ? false : true}
                      className={classes.textField}
                      id="name"
                      placeholder="Nimi"
                      value={this.state.name}
                      onChange={this.handleChange('name')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <form onSubmit={this.handleSubmit}>
                      <TextField
                        required
                        fullWidth
                        autoFocus={this.state.name ? true : false}
                        type="password"
                        className={classes.textField}
                        id="password"
                        placeholder="Salasana"
                        value={this.state.bikeNumber}
                        onChange={this.handleChange('password')}
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
  )
);

export const AdminLogout = withContext(props => (
  <ListItem button onClick={() => props.setToken('')}>
    <ListItemIcon>
      <PowerSettingsNew />
    </ListItemIcon>
    <ListItemText primary="Kirjaudu ulos" />
  </ListItem>
));

// vim: et ts=2 sw=2 :
