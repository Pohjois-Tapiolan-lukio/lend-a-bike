import React, { Component, Fragment } from 'react';
import {
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  //CardActions,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { DirectionsBike } from '@material-ui/icons';

import SubmitBike from './SubmitBike';

const styles = theme => {
  //console.log(theme);
  return {
    flex: {
      flexGrow: 1,
    },
    fabs: {
      bottom: theme.spacing.unit * 2,
      right: theme.spacing.unit * 2,
      position: 'fixed',
    },
    fab: {
      marginLeft: theme.spacing.unit,
      background: 'linear-gradient(45deg, #c51162 30%, #f4701d 90%)',
      color: 'white',
    },
    extendedIcon: {
      marginRight: theme.spacing.unit,
    },
    cardgrid: {
      marginTop: 64,
    },
    card: {
      transition: 'box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    },
    cardAction: {
      display: 'block',
      textAlign: 'initial',
      width: '100%',
      height: '100%',
    },
  };
};

class Lend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bikes: [],
      selectedBike: '',
      lender: '',
      disableSubmit: false,
      dialogOpen: false,
      submitStatus: 0,
    };
  }
  componentDidMount() {
    fetch('/api/bikes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(result => result.json())
      .then(result => {
        this.setState({
          bikes: result,
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
  handleSelect = bikeId => () => {
    this.setState({
      selectedBike: this.state.selectedBike === bikeId ? '' : bikeId,
    });
  };
  handleChange = key => event => {
    this.setState({
      [key]: event.target.value,
    });
  };
  submit = () => {
    this.setState({ disableSubmit: true });
    fetch('/api/lendings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lender: this.state.lender,
        bikeId: this.state.selectedBike,
      }),
    })
      .then(result => {
        if (result.status === 200) {
          this.setState({
            disableSubmit: false,
            lender: '',
            selectedBike: '',
            submitStatus: result.status.toString(),
          });
          setTimeout(this.closeDialog, 800);
        } else {
          this.setState({
            disableSubmit: false,
            submitStatus: result.status.toString(),
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  openDialog = () => {
    this.setState({
      dialogOpen: true,
    });
  };
  closeDialog = () => {
    this.setState({
      dialogOpen: false,
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Grid container className={classes.cardgrid} spacing={8}>
          {this.state.bikes.map(bike => (
            <Grid item xs={12} sm={6} key={bike._id}>
              <Card
                className={classes.card}
                onClick={this.handleSelect(bike.bikeId)}
                raised={this.state.selectedBike === bike.bikeId}
              >
                <ButtonBase
                  className={classes.cardAction}
                  onClick={this.handleSelect(bike.bikeId)}
                >
                  <CardContent>
                    <Typography color="textSecondary">
                      Bike of the Day
                    </Typography>
                    <Typography variant="headline" component="h2">
                      {bike.name}
                    </Typography>
                    <Typography color="textSecondary">noun</Typography>
                    <Typography component="p">
                      {`${bike.name}'s id is ${bike.bikeId}`}
                    </Typography>
                  </CardContent>
                </ButtonBase>
              </Card>
            </Grid>
          ))}
        </Grid>
        <div className={classes.fabs}>
          <SubmitBike />
          <LendBike
            selectedBike={this.state.selectedBike}
            handleChange={this.handleChange}
            lender={this.state.lender}
            dialogOpen={this.state.dialogOpen}
            closeDialog={this.closeDialog}
            openDialog={this.openDialog}
            submit={this.submit}
            disableSubmit={this.state.disableSubmit}
            submitStatus={this.state.submitStatus}
          />
        </div>
      </Fragment>
    );
  }
}

const LendBike = withStyles(styles)(props => (
  <Fragment>
    <Button
      className={props.classes.fab}
      variant="extendedFab"
      disabled={props.selectedBike === ''}
      onClick={props.openDialog}
    >
      <DirectionsBike className={props.classes.extendedIcon} />
      Lainaa
    </Button>
    <Dialog
      open={props.dialogOpen}
      onClose={props.closeDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Lainaa pyörä</DialogTitle>
      <DialogContent>
        <Grid container>
          <DialogContentText id="alert-dialog-description">
            Kirjoita tietosi
            <br />
            {
              {
                '200': 'Lainaus luotu',
                '400': 'Lainaus epäonnistui (400)',
                '409': 'Pyörä on käytössä (409)',
              }[props.submitStatus]
            }
          </DialogContentText>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              autoFocus
              className={props.classes.textField}
              id="lender"
              placeholder="Nimi"
              value={props.lender}
              onChange={props.handleChange('lender')}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={props.closeDialog}
          variant="contained"
          color="secondary"
        >
          Sulje
        </Button>
        <Button
          onClick={props.submit}
          color="primary"
          disabled={props.disableSubmit}
        >
          Lainaa
        </Button>
      </DialogActions>
    </Dialog>
  </Fragment>
));

export default withStyles(styles)(Lend);

// vim: et ts=2 sw=2 :
