import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import SwipeableViews from 'react-swipeable-views';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  ButtonBase,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { BikeCardButtons } from '../LendAdmin';
import { withContext } from '../DataContext';
import {
  // getLentBikes,
  // getAvailableBikes,
  bikeType,
} from '../../utils';

const styles = theme => ({
  cardgrid: {
    [theme.breakpoints.down('sm')]: {
      marginTop: 56 + 48 + theme.spacing.unit,
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: 64 + 48 + theme.spacing.unit,
    },
    width: `calc(100% - 8px)`,
    margin: 4,
  },
  card: {
    transition: `box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
      background 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms`,
    margin: 'auto',
  },
  selected: {
    background: '#ddd',
  },
  cardButton: {
    display: 'block',
    textAlign: 'initial',
    width: '100%',
    height: '100%',
  },
});

const BikeContent = props => (
  <CardContent>
    <Typography variant="headline" component="h2">
      {props.bike.name}
    </Typography>
    <Typography color="textPrimary">
      {props.available ? 'Pyörä on vapaana' : 'Pyörä on varattu'}
    </Typography>
    <Typography color="textSecondary">
      {`Pyörän numero: ${props.bike.bikeNumber}`}
    </Typography>
  </CardContent>
);

export const Bikes = withStyles(styles)(
  withContext(
    class extends Component {
      static propTypes = {
        adminToken: PropTypes.string,
        bikes: PropTypes.arrayOf(bikeType).isRequired,
        handleSelect: PropTypes.func.isRequired,
        selectedBike: bikeType,
      };
      render() {
        const { classes, selectedBike } = this.props;
        return (
          <Grid container className={classes.cardgrid} spacing={8}>
            {this.props.bikes.map(bike => (
              <Grid item xs={12} sm={6} key={bike._id}>
                <Card
                  className={classNames(classes.card, {
                    [classes.selected]: selectedBike
                      ? selectedBike._id === bike._id
                      : false,
                  })}
                  raised={selectedBike ? selectedBike._id === bike._id : false}
                >
                  <ButtonBase
                    className={classes.cardButton}
                    onClick={this.props.handleSelect(bike)}
                  >
                    <BikeContent bike={bike} available />
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
            ))}
          </Grid>
        );
      }
    }
  )
);

export const BikeViews = withStyles(styles)(
  withContext(
    class extends Component {
      static propTypes = {
        classes: PropTypes.object.isRequired,
        bikeViewIndex: PropTypes.number.isRequired,
        changeBikeViewIndex: PropTypes.func.isRequired,
        selectedBike: bikeType,
        handleSelect: PropTypes.func.isRequired,
      };

      render() {
        return (
          <SwipeableViews
            axis="x"
            index={this.props.bikeViewIndex}
            onChangeIndex={this.props.changeBikeViewIndex}
            slideStyle={{
              height: '-webkit-fill-available',
            }}
          >
            <Bikes
              selectedBike={this.props.selectedBike}
              handleSelect={this.props.handleSelect}
            />
            <Bikes selectedBike={null} handleSelect={() => {}} />
          </SwipeableViews>
        );
      }
    }
  )
);

// vim: et ts=2 sw=2 :
