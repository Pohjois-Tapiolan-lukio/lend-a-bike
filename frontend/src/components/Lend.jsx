import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  ButtonBase,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { BikeCardButtons } from './LendAdmin';
import { LendBike, ReturnBike } from './LendUtils';
import { withContext } from './DataContext';

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
    [theme.breakpoints.down('sm')]: {
      marginTop: 56 + theme.spacing.unit,
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: 64 + theme.spacing.unit,
    },
  },
  card: {
    transition: `box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
      background 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms`,
  },
  selected: {
    background: '#ddd',
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
      selectedBike: '',
      lender: '',
      disableSubmit: false,
      // TODO Dialogs in separate components
      dialogOpen: false,
      submitStatus: -1,
      lendingListOpen: false,
    };
  }
  static propTypes = {
    adminToken: PropTypes.string,
    reloadBikes: PropTypes.func.isRequired,
    bikes: PropTypes.array.isRequired,
  };
  componentDidMount = () => {
    this.props.reloadBikes();
    this.props.reloadLendings();
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
  submit = event => {
    event.preventDefault();
    this.setState({
      disableSubmit: true,
      submitStatus: -1,
    });
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
          this.props.reloadLendings();
          setTimeout(() => {
            this.closeDialog();
            this.setState({
              submitStatus: -1,
            });
          }, 800);
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

  // TODO create external methods for filtering lendings
  filterLendingsByBike = bike =>
    this.props.lendings.filter(
      lending =>
        lending.bike_id === bike._id &&
        new Date(lending.time.returned).getTime() === new Date(0).getTime()
    );
  // filterBikesByUsage = () => ({
  //   bikesInUse: this.props.lendings
  //     .filter(
  //       lending =>
  //         new Date(lending.time.returned).getTime() === new Date(0).getTime()
  //     )
  //     .map(lending => lending.bike_id),
  // });

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Grid container className={classes.cardgrid} spacing={8}>
          {this.props.bikes.map(bike => {
            const bikeInUse = this.filterLendingsByBike(bike);

            return (
              <Grid item xs={12} sm={6} key={bike._id}>
                <Card
                  className={classNames(classes.card, {
                    [classes.selected]:
                      this.state.selectedBike._id === bike._id,
                  })}
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
                          : 'Pyörä on vapaana'}
                      </Typography>
                      <Typography color="textSecondary">
                        {`Pyörän numero: ${bike.bikeNumber}`}
                      </Typography>
                    </CardContent>
                  </ButtonBase>
                  {this.props.adminToken ? (
                    <Fragment>
                      <CardActions>
                        <BikeCardButtons bike={bike} />
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
          {this.state.selectedBike !== '' &&
          // TODO This looks very confusing
          // must be clearer
          this.filterLendingsByBike(this.state.selectedBike)[0] ? (
            <ReturnBike
              selectedBike={this.state.selectedBike}
              onReturn={this.props.reloadLendings}
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

export default withStyles(styles)(withContext(Lend));

// vim: et ts=2 sw=2 :
