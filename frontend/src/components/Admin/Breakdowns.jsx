import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Slide,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ExpansionPanelActions,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { withContext } from '../DataContext';
import { Build, Close, ExpandMore, Add } from '@material-ui/icons';
import { red, green, grey as gray } from '@material-ui/core/colors';

import {
  // lendingType,
  bikeType,
  breakdownType,
  // getBrokenBikes,
} from '../../utils';

const styles = theme => ({
  flex: {
    flexGrow: 1,
  },
  title: {
    position: 'relative',
  },
  listList: {
    height: '100%',
    overflow: 'auto',
    '&>li:nth-child(odd)>div': {
      background: gray[100],
    },
  },
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  unfixed: {
    color: red[700],
  },
  fixed: {
    color: green[500],
  },
  column: {
    flexBasis: '33.33%',
  },
});

const Transition = props => <Slide direction="up" {...props} />;

export const Breakdowns = withStyles(styles)(
  withContext(
    class extends Component {
      constructor(props) {
        super(props);
        this.state = {
          dialogOpen: false,
        };
      }
      static propTypes = {
        classes: PropTypes.object.isRequired,
        bikes: PropTypes.arrayOf(bikeType).isRequired,
        breakdowns: PropTypes.arrayOf(breakdownType).isRequired,
        adminToken: PropTypes.string.isRequired,
      };
      closeDialog = () => {
        this.setState({ dialogOpen: false });
      };
      openDialog = () => {
        this.setState({ dialogOpen: true });
      };
      fixBreakdown = bikeNumber => {
        const Authorization = this.props.adminToken
          ? `Bearer ${this.props.adminToken}`
          : undefined;
        return fetch(`/api/breakdowns/fix/${bikeNumber}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization,
          },
        })
          .then(response => {
            if (response.ok) {
              response.json().then(this.props.reloadBreakdowns);
            } else if (response.status === 403) {
              this.props.setToken('');
            }
          })
          .catch(error => console.error);
      };
      render() {
        const { classes, bikes, breakdowns } = this.props;

        return (
          <Fragment>
            <ListItem button onClick={this.openDialog}>
              <ListItemIcon>
                <Build />
              </ListItemIcon>
              <ListItemText primary="Pyörät huollossa" />
            </ListItem>
            <Dialog
              fullScreen
              open={this.state.dialogOpen}
              onClose={this.closeDialog}
              TransitionComponent={Transition}
            >
              <AppBar className={classes.title}>
                <Toolbar>
                  <Typography
                    variant="title"
                    color="inherit"
                    className={classes.flex}
                  >
                    Huollossa olevat pyörät
                  </Typography>
                  <IconButton
                    color="inherit"
                    onClick={this.closeDialog}
                    aria-label="Close"
                  >
                    <Close />
                  </IconButton>
                </Toolbar>
              </AppBar>
              <List dense className={classes.listList}>
                {[]
                  .concat(breakdowns)
                  .reverse()
                  .map((breakdown, index) => {
                    const bikeByNumber = bikes.filter(
                      bike => bike.bikeNumber === breakdown.bikeNumber
                    )[0];
                    const fixed =
                      new Date(breakdown.time.fixed).getTime() !== 0;
                    const bull = (
                      <span className={classes.secondaryHeading}>
                        {` \u2022 `}
                      </span>
                    );

                    return (
                      <ListItem key={index}>
                        <ExpansionPanel className={classes.root}>
                          <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                            <div className={classes.column}>
                              <Typography className={classes.heading}>
                                {bikeByNumber ? (
                                  bikeByNumber.name
                                ) : (
                                  <span className={classes.unfixed}>
                                    Tuntematon pyörä
                                  </span>
                                )}
                                {bull}
                                {breakdown.bikeNumber}
                              </Typography>
                            </div>
                            <div className={classes.column}>
                              <Typography className={classes.secondaryHeading}>
                                {fixed ? (
                                  <span className={classes.fixed}>
                                    Korjattu{' '}
                                  </span>
                                ) : (
                                  <span className={classes.unfixed}>
                                    Ei vielä korjattu
                                  </span>
                                )}

                                {fixed
                                  ? new Date(
                                      breakdown.time.fixed
                                    ).toLocaleString('fi-FI')
                                  : ''}
                              </Typography>
                            </div>
                          </ExpansionPanelSummary>
                          <ExpansionPanelDetails>
                            <div>
                              <Typography variant="caption">
                                {new Date(breakdown.time.broken).toLocaleString(
                                  'fi-FI'
                                )}
                              </Typography>
                              <Typography variant="subheading">
                                {breakdown.reason}
                              </Typography>
                              <Typography>
                                {breakdown.description
                                  ? breakdown.description
                                  : 'Ei lisätietoja'}
                              </Typography>
                            </div>
                          </ExpansionPanelDetails>

                          {fixed
                            ? ''
                            : [
                                <Divider key="divider" />,
                                <ExpansionPanelActions key="actions">
                                  <FixBreakdown
                                    onFix={() =>
                                      this.fixBreakdown(breakdown.bikeNumber)
                                    }
                                  />
                                </ExpansionPanelActions>,
                              ]}
                        </ExpansionPanel>
                      </ListItem>
                    );
                  })}
              </List>
              {
                // <AddBrokenBike />
              }
            </Dialog>
          </Fragment>
        );
      }
    }
  )
);

const FixBreakdown = withStyles(styles)(props => (
  <Fragment>
    <Button color="primary" onClick={props.onFix}>
      Merkkaa korjatuksi
    </Button>
  </Fragment>
));

// TODO add dialog layout
// TODO make this do something
// eslint-disable-next-line
const AddBrokenBike = withStyles(styles)(
  class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        dialogOpen: false,
      };
    }

    closeDialog = () => {
      this.setState({ dialogOpen: false });
    };
    openDialog = () => {
      this.setState({ dialogOpen: true });
    };
    render() {
      const { classes } = this.props;
      return (
        // TODO make fab layout
        <Button
          className={classes.fab}
          color="primary"
          variant="fab"
          disabled={this.state.submitDisabled}
          onClick={this.openDialog}
        >
          <Add />
        </Button>
      );
    }
  }
);

// vim: et ts=2 sw=2 :
