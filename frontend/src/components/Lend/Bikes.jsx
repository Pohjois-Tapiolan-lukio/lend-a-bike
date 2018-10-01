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
  getLentBikes,
  getAvailableBikes,
  bikeType,
  lendingType,
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
  slide: {
    transition: 'transform 500ms linear 0ms',
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
        lendings: PropTypes.arrayOf(lendingType).isRequired,
        handleSelect: PropTypes.func.isRequired,
        selectedBike: bikeType,
        available: PropTypes.bool,
      };
      static defaultProps = {
        available: false,
      };
      render() {
        const { classes, selectedBike } = this.props;
        const bikes = this.props.available
          ? getAvailableBikes(this.props.bikes, this.props.lendings)
          : getLentBikes(this.props.bikes, this.props.lendings);

        return (
          <Grid container className={classes.cardgrid} spacing={8}>
            {bikes.map(bike => (
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
                    <BikeContent bike={bike} available={this.props.available} />
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
      constructor(props) {
        super(props);
        this.state = {
          height: 0,
        };
      }
      static propTypes = {
        classes: PropTypes.object.isRequired,
        bikeViewIndex: PropTypes.number.isRequired,
        changeBikeViewIndex: PropTypes.func.isRequired,
        selectedBike: bikeType,
        handleSelect: PropTypes.func.isRequired,
      };
      componentDidMount() {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions.bind(this));
      }
      componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions.bind(this));
      }
      updateDimensions() {
        const height = document.body.clientHeight;
        // console.log(height);
        this.setState({ height });
      }

      render() {
        const { classes } = this.props;
        const index = this.props.bikeViewIndex;
        const bikesList = [
          {
            node: (
              <Bikes
                available
                styles={{
                  display: this.bikeViewIndex === 0 ? undefined : 'none',
                }}
                selectedBike={this.props.selectedBike}
                handleSelect={this.props.handleSelect}
              />
            ),
            direction: 'right',
          },
          {
            node: (
              <Bikes
                styles={{
                  display: this.bikeViewIndex === 1 ? undefined : 'none',
                }}
                selectedBike={this.props.selectedBike}
                handleSelect={this.props.handleSelect}
              />
            ),
            direction: 'left',
          },
        ];
        //return (
        //  <Fragment>
        //    {bikesList.map((bikes, index) => (
        //      <Slide
        //        className={classes.slide}
        //        key={index}
        //        direction={bikes.direction}
        //        in={this.props.bikeViewIndex === index}
        //        mountOnEnter
        //        unmountOnExit
        //      >
        //        {bikes.node}
        //      </Slide>
        //    ))}
        //  </Fragment>
        //);
        return (
          <SwipeableViews
            axis="x"
            index={this.props.bikeViewIndex}
            onChangeIndex={this.props.changeBikeViewIndex}
            slideStyle={{
              height: this.state.height,
            }}
          >
            <Bikes
              available
              selectedBike={this.props.selectedBike}
              handleSelect={this.props.handleSelect}
            />
            <Bikes
              selectedBike={this.props.selectedBike}
              handleSelect={this.props.handleSelect}
            />
          </SwipeableViews>
        );
      }
    }
  )
);

// vim: et ts=2 sw=2 :
