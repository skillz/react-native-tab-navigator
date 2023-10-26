'use strict';

import React from 'react';
import {
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TextProps,
  ViewStyle,
} from 'react-native';

import Layout from './Layout';

type IBadgeState = {
  computedSize: {
    width: number,
    height: number,
  },
}

export default class Badge extends React.Component<TextProps, IBadgeState> {

  constructor(props: TextProps) {
    super(props);

    this._handleLayout = this._handleLayout.bind(this);
    this.state = {
      computedSize: {
        width: 0,
        height: 0,
      },
    };
  }


  render() {
    let { computedSize } = this.state;
    let style:ViewStyle = {};
    if (!computedSize) {
      style.opacity = 0;
    } else {
      style.width = Math.max(computedSize?.height, computedSize?.width);
    }

    return (
      <Text
        {...this.props}
        numberOfLines={1}
        onLayout={this._handleLayout}
        style={[styles.container, this.props.style, style]}>
        {this.props.children}
      </Text>
    );
  }

  _handleLayout(event: LayoutChangeEvent) {
    let { width, height } = event.nativeEvent.layout;
    let { computedSize } = this.state;
    if (computedSize && computedSize.height === height &&
      computedSize.width === width) {
      return;
    }

    this.setState({
      computedSize: { width, height },
    });

    if (this.props.onLayout) {
      this.props.onLayout(event);
    }
  }
}

let styles = StyleSheet.create({
  container: {
    fontSize: 12,
    color: '#fff',
    backgroundColor: 'rgb(0, 122, 255)',
    lineHeight: 15,
    textAlign: 'center',
    borderWidth: 1 + Layout.pixel,
    borderColor: '#fefefe',
    borderRadius: 17 / 2,
    overflow: 'hidden',
  },
});
