import React, { Component } from 'react';
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  card: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

class Memos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      memos: [],
    };
  }

  componentDidMount() {
    const token = this.props.cookies.get('memoserverjwt');
    fetch('/api/memos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(memos => {
        this.setState({
          memos,
        });
        return memos;
      })
      .catch(console.error);
  }

  render() {
    const { classes } = this.props;
    const bull = <span className={classes.bullet}>•</span>;
    return (
      <div>
        {this.state.memos.map((memo, index) => (
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="headline">{memo.text}</Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        ))}
      </div>
    );
  }
}

export default withStyles(styles)(Memos);

// vim: et ts=2 sw=2 :
