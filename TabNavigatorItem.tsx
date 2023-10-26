'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import {
  TextStyle,
  ViewProps,
  ViewStyle,
} from 'react-native';

type TabNavigatorItemProps = ViewProps & {
  renderIcon?: Function,
  renderSelectedIcon?: Function,
  badgeText?: string | number,
  renderBadge?: Function,
  title?: string,
  titleStyle?: TextStyle,
  selectedTitleStyle?: TextStyle,
  tabStyle?: ViewStyle,
  selected?: boolean,
  onPress?: Function,
  allowFontScaling?: boolean,
}

export default class TabNavigatorItem extends React.Component<TabNavigatorItemProps> {

  render() {
    let child = React.Children.only(this.props.children);
    if (child && React.isValidElement(child)) {
      return React.cloneElement(child, {
        style: [child?.props?.style, this.props.style],
      } as any);
    }
  }
}
