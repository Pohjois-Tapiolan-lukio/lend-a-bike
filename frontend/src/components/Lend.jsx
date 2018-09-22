import React, { Component, Fragment } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  ButtonBase,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import SubmitBike from './SubmitBike';
import { BikeCardButtons } from './LendAdmin';
import { LendBike, ReturnBike } from './LendUtils';

const styles = theme => ({
  fabs: {
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    position: 'fixed',
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
});

class Lend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bikes: [],
      lendings: [],
      selectedBike: '',
      lender: '',
      disableSubmit: false,
      // TODO Dialogs in separate components
      dialogOpen: false,
      submitStatus: 0,
      lendingListOpen: false,
    };
  }
  componentDidMount = () => {
    this.reloadBikes();
    this.reloadLendings();
  };
  reloadBikes = () => {
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
  };
  // TODO Fetch should be static
  reloadLendings = () => {
    fetch('/api/lendings', {
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
  handleSelect = bike => () => {
    this.setState({
      selectedBike: this.state.selectedBike === bike ? '' : bike,
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
        bikeNumber: this.state.selectedBike.bikeNumber,
        bike_id: this.state.selectedBike._id,
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
          this.reloadLendings();
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
  openDialog = () =>
    this.setState({
      dialogOpen: true,
    });
  closeDialog = () =>
    this.setState({
      dialogOpen: false,
    });
  openLendingList = () =>
    this.setState({
      lendingListOpen: true,
    });
  closeLendingList = () =>
    this.setState({
      lendingListOpen: false,
    });
  filterLendingsByBike = bike =>
    this.state.lendings.filter(
      lending =>
        lending.bike_id === bike._id &&
        new Date(lending.time.returned).getTime() === new Date(0).getTime()
    );

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Grid container className={classes.cardgrid} spacing={8}>
          {this.state.bikes.map(bike => {
            const bikeInUse = this.filterLendingsByBike(bike);

            return (
              <Grid item xs={12} sm={6} key={bike._id}>
                <Card
                  className={classes.card}
                  raised={this.state.selectedBike._id === bike._id}
                >
                  <ButtonBase
                    className={classes.cardAction}
                    onClick={this.handleSelect(bike)}
                  >
                    <CardContent>
                      <Typography variant="headline" component="h2">
                        {bike.name}
                      </Typography>
                      <Typography color="textPrimary">
                        {bikeInUse.length > 0
                          ? 'Pyörä on varattu'
                          : 'Pyörää on vapaana'}
                      </Typography>
                      <Typography color="textSecondary">
                        {`Number: ${bike.bikeNumber}`}
                      </Typography>
                      <Typography color="textSecondary">
                        {`_id: ${bike._id}`}
                      </Typography>
                    </CardContent>
                  </ButtonBase>
                  {this.props.adminToken ? (
                    <Fragment>
                      <CardActions>
                        <BikeCardButtons
                          bike={bike}
                          onDelete={this.reloadBikes}
                          onEdit={this.reloadBikes}
                          adminToken={this.props.adminToken}
                          bikes={this.state.bikes}
                          lendings={this.state.lendings}
                        />
                      </CardActions>
                    </Fragment>
                  ) : (
                    ''
                  )}
                </Card>
              </Grid>
            );
          })}
        </Grid>
        <div className={classes.fabs}>
          <SubmitBike
            reloadBikes={this.reloadBikes}
            adminToken={this.props.adminToken}
          />
          {this.state.selectedBike !== '' &&
          this.filterLendingsByBike(this.state.selectedBike)[0] ? (
            <ReturnBike
              selectedBike={this.state.selectedBike}
              onReturn={this.reloadBikes}
            />
          ) : (
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
          )}
        </div>
      </Fragment>
    );
  }
}

export default withStyles(styles)(Lend);

// vim: et ts=2 sw=2 :
