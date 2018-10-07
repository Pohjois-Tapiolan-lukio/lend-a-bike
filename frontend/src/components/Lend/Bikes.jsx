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
import { red } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import { Build } from '@material-ui/icons';

import { BikeCardButtons } from '../Admin';
import { withContext } from '../DataContext';
import {
  getLentBikes,
  getAvailableBikes,
  getBrokenBikes,
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
    width: `calc(100% - ${2 * theme.spacing.unit}px)`,
    margin: theme.spacing.unit,
  },
  card: {
    transition: `box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
      background 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms`,
    // margin: 'auto',
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
  image: {
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    margin: 'auto 8px',
    maxWidth: '90%',
    maxHeight: 100,
  },
});

const BikeContent = props => (
  <CardContent>
    <Typography variant="headline" component="h2">
      {props.broken ? (
        <span style={{ color: red[700], whiteSpace: 'nowrap' }}>
          {props.bike.name}{' '}
          <Build
            style={{
              verticalAlign: 'bottom',
              fontSize: '18px !important',
            }}
          />
        </span>
      ) : (
        props.bike.name
      )}
    </Typography>
    <Typography color="textPrimary">
      {props.broken
        ? 'Pyörä on huollossa'
        : props.available
          ? 'Pyörä on vapaana'
          : 'Pyörä on varattu'}
    </Typography>
    <Typography color="textSecondary">
      {`Pyörän numero: ${props.bike.bikeNumber}`}
    </Typography>
  </CardContent>
);

export const Bikes = withStyles(styles, { withTheme: true })(
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
        const { classes, selectedBike, theme } = this.props;
        const bikes = this.props.available
          ? getAvailableBikes(this.props.bikes, this.props.lendings)
          : getLentBikes(this.props.bikes, this.props.lendings);
        const brokenBikes = getBrokenBikes(
          this.props.bikes,
          this.props.breakdowns
        );

        return (
          <Grid
            container
            className={classes.cardgrid}
            spacing={2 * theme.spacing.unit}
          >
            {bikes.map(bike => {
              const broken = brokenBikes.some(
                brokenBike => brokenBike.bikeNumber === bike.bikeNumber
              );
              return (
                <Grid item xs={12} sm={6} key={bike._id}>
                  <Card
                    className={classNames(classes.card, {
                      [classes.selected]: selectedBike
                        ? selectedBike._id === bike._id
                        : false,
                    })}
                    raised={
                      selectedBike ? selectedBike._id === bike._id : false
                    }
                  >
                    <ButtonBase
                      className={classes.cardButton}
                      onClick={this.props.handleSelect(bike)}
                      disabled={broken}
                    >
                      <Grid container>
                        <Grid item xs={6}>
                          <BikeContent
                            bike={bike}
                            broken={broken}
                            available={this.props.available}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <BikeImage bike={bike} />
                        </Grid>
                      </Grid>
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
        );
      }
    }
  )
);

export const BikeViews = withContext(
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
      this.setState({ height });
    }

    render() {
      return (
        <SwipeableViews
          axis="x"
          disableLazyLoading
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
);

const BikeImage = withStyles(styles)(
  class extends Component {
    constructor(props) {
      super(props);
      this.style = {};
    }
    static propTypes = {
      classes: PropTypes.object.isRequired,
      bike: bikeType.isRequired,
    };

    render() {
      const { classes, bike } = this.props;

      return bike.image && bike.image.file ? (
        <img
          src={`/${bike.image.file.filename}`}
          className={classes.image}
          alt=""
        />
      ) : null;
    }
  }
);

// vim: et ts=2 sw=2 :
