import React, { Component, Fragment } from 'react';
import {
  Typography,
  Button,
  Grid,
  GridList,
  Card,
  CardContent,
  CardActions,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { DirectionsBike } from '@material-ui/icons';

import SubmitBike from './SubmitBike';

const styles = theme => ({
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
});

class Lend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bikes: []
    };
  }

  componentDidMount() {
    fetch('/api/bikes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
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

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Grid
          container
          className={classes.cardgrid}
          spacing={8}
        >
          {this.state.bikes.map(bike =>
            <Grid item xs={12} sm={6}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography color='textSecondary'>
                    Bike of the Day
                  </Typography>
                  <Typography variant='headline' component="h2">
                    {bike.name}
                  </Typography>
                  <Typography color='textSecondary'>
                    noun
                  </Typography>
                  <Typography component='p'>
                    {`${bike.name}'s id is ${bike.bikeId}`}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size='small'>Learn More</Button>
                </CardActions>
              </Card>
            </Grid>
          )}
        </Grid>
        <div
          className={classes.fabs}
        >
          <SubmitBike />
          <Button
            className={classes.fab}
            variant='extendedFab'
          >
            <DirectionsBike
              className={classes.extendedIcon}
            />
            Lainaa
          </Button>
        </div>
      </Fragment>
    );
  }
}

export default withStyles(styles)(Lend);

// vim: et ts=2 sw=2 :
