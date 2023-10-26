'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { ViewProps } from 'react-native';


type ISceneContainerProps = ViewProps & {
  shouldUpdate: boolean,
}

export default class StaticContainer extends React.Component<ISceneContainerProps> {
  static propTypes = {
    shouldUpdate: PropTypes.bool,
  };

  shouldComponentUpdate(nextProps: ISceneContainerProps): boolean {
    return !!nextProps.shouldUpdate;
  }

  render() {
    let { children } = this.props;
    return children ? React.Children.only(children) : null;
  }
}
