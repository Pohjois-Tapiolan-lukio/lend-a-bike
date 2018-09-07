import React, { Component } from 'react';
import {
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { DirectionsBike } from '@material-ui/icons';

const styles = theme => ({
  flex: {
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
  cardgrid: {
    marginBottom: 2,
  },
  card: {
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
      .then(result => { console.log(result); return result })
      .then(result => result.json())
      .then(result => {
        console.log(result);
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
      <div>
        <Grid
          container
          spacing={16}
          className={classes.cardgrid}
        >
          {this.state.bikes.map(bike =>
            <Grid item xs={12} sm={6}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography color="textSecondary">
                    Bike of the Day
                  </Typography>
                  <Typography variant="headline" component="h2">
                    {bike.name}
                  </Typography>
                  <Typography color="textSecondary">
                    noun
                  </Typography>
                  <Typography component="p">
                    {`${bike.name}'s id is ${bike.bikeId}`}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Learn More</Button>
                </CardActions>
              </Card>
            </Grid>
          )}
        </Grid>
        <Button
          variant="extendedFab"
          color='secondary'
          aria-label="Delete"
          className={classes.fab}
        >
          <DirectionsBike
            className={classes.extendedIcon}
          />
          Lainaa
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(Lend);

// vim: et ts=2 sw=2 :
