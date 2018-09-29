import React from 'react';
import { Tabs } from '@material-ui/core';

export const BikeTabs = props => (
  <Tabs centered {...props}>
    {props.children}
  </Tabs>
);

// vim: et ts=2 sw=2 :
