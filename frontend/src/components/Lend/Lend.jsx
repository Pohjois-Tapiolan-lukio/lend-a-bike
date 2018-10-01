import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { LendBike, ReturnBike, BikeViews } from '.';
import { withContext } from '../DataContext';

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
    // TODO use template
    bikes: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        bikeNumber: PropTypes.number.isRequired,
      })
    ),
  };
  handleSelect = bike => () => {
    this.setState({
      selectedBike: this.state.selectedBike === bike ? null : bike,
    });
  };
  clearSelection = () => this.setState({ selectedBike: null });

  render() {
    return (
      <Fragment>
        <BikeViews
          handleSelect={this.handleSelect}
          selectedBike={this.state.selectedBike}
          clearSelection={this.clearSelection}
        />

        <LendBike
          selectedBike={this.state.selectedBike}
          clearSelection={this.clearSelection}
        />
        <ReturnBike
          selectedBike={this.state.selectedBike}
          clearSelection={this.clearSelection}
        />
      </Fragment>
    );
  }
}

export default withContext(Lend);

// vim: et ts=2 sw=2 :
