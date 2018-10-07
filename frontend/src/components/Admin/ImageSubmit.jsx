import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  TextField,
  Collapse,
} from '@material-ui/core';
import { AddAPhoto } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

import { withContext } from '../DataContext';

import { FilePond, File, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
registerPlugin(FilePondImagePreview);
registerPlugin(FilePondPluginFileEncode);

const styles = theme => ({
  textField: {
    marginTop: theme.spacing.unit,
  },
});

const handler = (state, props) => (
  fieldName,
  file,
  metadata,
  load,
  error,
  progress,
  abort
) => {
  const form = new FormData();
  form.append('image', file);
  form.append('bikeNumber', state.bikeNumber);

  fetch('/api/bikes/images', {
    method: 'POST',
    body: form,
  })
    .then(response => {
      if (response.ok) {
        progress(true, 0, 1024);
        load();
        props.reloadBikes();
        props.reloadLendings();
      } else {
        error();
      }
    })
    .catch(console.log);

  return {
    abort: () => {
      abort();
    },
  };
};

const ImageSubmit = withStyles(styles)(
  withContext(
    class extends Component {
      constructor(props) {
        super(props);
        this.state = {
          bikeNumber: '',
          open: false,
          disableSubmit: false,
          submitStatus: -1,
        };
      }
      static propTypes = {
        classes: PropTypes.object.isRequired,
        bikeNumber: PropTypes.number,
      };

      handleChange = key => event =>
        this.setState({ [key]: event.target.value });
      openDialog = () => this.setState({ open: true });
      closeDialog = () => this.setState({ open: false });
      render() {
        const { classes } = this.props;
        const overrideBikeNumber = this.props.bikeNumber ? true : false;

        return (
          <Fragment>
            <ListItem button onClick={this.openDialog}>
              <ListItemIcon>
                <AddAPhoto />
              </ListItemIcon>
              <ListItemText primary="Lisää kuva" />
            </ListItem>
            <Dialog
              open={this.state.open}
              onClose={this.closeDialog}
              fullWidth
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                Lisää pyörälle kuva
              </DialogTitle>
              <DialogContent>
                <Grid container>
                  <DialogContentText id="alert-dialog-description">
                    <br />
                    {
                      {
                        '400': 'Huono pyyntö (400)',
                        '403': 'Ei oikeutta (403)',
                      }[this.state.submitStatus]
                    }
                  </DialogContentText>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      autoFocus
                      className={classes.textField}
                      id="bikeNumber"
                      placeholder="Pyörän numero"
                      value={this.state.bikeNumber}
                      onChange={this.handleChange('bikeNumber')}
                      disabled={overrideBikeNumber}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Collapse in={this.state.bikeNumber !== ''}>
                      <FilePond
                        className={classes.textField}
                        allowMultiple={false}
                        server={{
                          url: '/',
                          process: handler(this.state, this.props),
                        }}
                      />
                    </Collapse>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.closeDialog} color="primary">
                  Sulje
                </Button>
              </DialogActions>
            </Dialog>
          </Fragment>
        );
      }
    }
  )
);

export default ImageSubmit;

// vim: et ts=2 sw=2 :
