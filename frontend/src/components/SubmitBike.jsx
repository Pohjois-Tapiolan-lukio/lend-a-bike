import React, { Component, Fragment } from 'react';
import {
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Grid,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Add } from '@material-ui/icons';

const styles = theme => ({
  fab: {
    marginLeft: theme.spacing.unit,
    background: 'linear-gradient(45deg, #c51162 30%, #f4701d 90%)',
    color: 'white',
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
  textField: {
    marginTop: theme.spacing.unit,
  }
});

class SubmitBike extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      disableSubmit: false,
      name: '',
      bikeId: '',
    };
  }

  closeDialog = () => {
    this.setState({
      open: false,
    });
  }
  openDialog = () => {
    this.setState({
      open: true,
    });
  }

  handleChange = key => event => {
    this.setState({
      [key]: event.target.value,
    });
  }

  submitBike = () => {
    this.setState({
      disableSubmit: true,
    });

    fetch('/api/bikes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: this.state.name,
        bikeId: this.state.bikeId,
      }),
    })
      .then(result => result.json())
      .then(data => {
        console.log(data);
        if (!data.error) {
          this.setState({
            name: '',
            bikeId: '',
            open: false,
          });
        }
      })
      .catch(console.error);

    this.setState({
      disableSubmit: false,
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Button
          className={classes.fab}
          variant='extendedFab'
          onClick={this.openDialog}
        >
          <Add
            className={classes.extendedIcon}
          />
          Lisää
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.closeDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Lisää uusi pyörä
          </DialogTitle>
          <DialogContent>
            <Grid container>
              <DialogContentText id="alert-dialog-description">
                Kirjoita pyörän tiedot
              </DialogContentText>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  autoFocus
                  className={classes.textField}
                  id='name'
                  placeholder='Pyörän nimi'
                  value={this.state.name}
                  onChange={this.handleChange('name')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  className={classes.textField}
                  id='bikeId'
                  placeholder='Pyörän ID'
                  value={this.state.bikeId}
                  onChange={this.handleChange('bikeId')}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.closeDialog}
              variant='contained'
              color="secondary"
            >
              Kumoa
            </Button>
            <Button
              onClick={this.submitBike}
              color="primary"
              disabled={this.state.disableSubmit}
            >
              Lisää
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

export default withStyles(styles)(SubmitBike);

// vim: et ts=2 sw=2 :
