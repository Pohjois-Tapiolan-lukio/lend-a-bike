import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { LendBike, ReturnBike, BikeViews } from '.';
import { withContext } from '../DataContext';

// TODO create a layout that integrates styles
const styles = theme => ({
  fabs: {
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    position: 'fixed',
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
});

class Lend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedBike: null,
    };
  }
  static propTypes = {
    adminToken: PropTypes.string,
    reloadBikes: PropTypes.func.isRequired,
    bikes: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        bikeNumber: PropTypes.number.isRequired,
      })
    ),
  };
  componentDidMount = () => {
    this.props.reloadBikes();
    this.props.reloadLendings();
  };
  handleSelect = bike => () => {
    this.setState({
      selectedBike: this.state.selectedBike === bike ? null : bike,
    });
  };

  // TODO create external methods for filtering lendings
  filterLendingsByBike = bike =>
    this.props.lendings.filter(
      lending =>
        lending.bike_id === bike._id &&
        new Date(lending.time.returned).getTime() === new Date(0).getTime()
    );

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <BikeViews
          handleSelect={this.handleSelect}
          selectedBike={this.state.selectedBike}
        />

        <div className={classes.fabs}>
          {this.state.selectedBike &&
          // TODO This looks very confusing
          // must be clearer
          //  - yes it will be removed
          this.filterLendingsByBike(this.state.selectedBike)[0] ? (
            <ReturnBike selectedBike={this.state.selectedBike} />
          ) : (
            // TODO FIX THIS MESS: OK ITS FIXED NOW!
            <LendBike selectedBike={this.state.selectedBike} />
          )}
        </div>
      </Fragment>
    );
  }
}

export default withStyles(styles)(withContext(Lend));

// vim: et ts=2 sw=2 :
