import React from 'react';

import {
  StyleSheet,
  StyleProp,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  View,
  ViewStyle,
  TextStyle,
  ViewProps,
  GestureResponderEvent
} from 'react-native';

import Layout from './Layout';

type ITabProps = ViewProps & {
  testID?: string,
  title?: string,
  titleStyle?: TextStyle,
  badge?: React.ReactElement<any>,
  onPress?: Function,
  hidesTabTouch?: boolean,
  allowFontScaling?: boolean,
  style?: ViewStyle,
  children?: React.ReactElement<any>,
}


export default class Tab extends React.Component<ITabProps, > {
  constructor(props: ITabProps) {
    super(props);

    this._handlePress = this._handlePress.bind(this);
  }

  render() {
    let { title, badge } = this.props;
    let icon = null;
    if (React.Children.count(this.props.children) > 0) {
      icon = React.Children.only(this.props.children);
    }

    let titleView;
    if (title) {
      titleView =
        <Text
          numberOfLines={1}
          allowFontScaling={!!this.props.allowFontScaling}
          style={[styles.title, this.props.titleStyle]}>
          {title}
        </Text>;
    }

    if (badge) {
      badge = React.cloneElement(badge, {
        style: [styles.badge, badge.props.style],
      });
    }

    let tabStyle = [
      styles.container,
      title ? null : styles.untitledContainer,
      this.props.style,
    ];
    if (
      !this.props.hidesTabTouch &&
      Platform.OS === 'android' &&
      Platform.Version >= 21
    ) {
      return (
        <TouchableNativeFeedback
          testID={this.props.testID}
          background={TouchableNativeFeedback.Ripple('transparent', true)}
          onPress={this._handlePress}
          accessible={this.props.accessible}
          accessibilityLabel={this.props.accessibilityLabel}>
          <View style={tabStyle}>
            <View>
              {icon}
              {badge}
            </View>
            {titleView}
          </View>
        </TouchableNativeFeedback>
      );
    }
    return (
      <TouchableOpacity {...this.props}
        testID={this.props.testID}
        activeOpacity={this.props.hidesTabTouch ? 1.0 : 0.8}
        onPress={this._handlePress}
        style={tabStyle}>
        <View>
          {icon}
          {badge}
        </View>
        {titleView}
      </TouchableOpacity>
    );
  }

  _handlePress(event: GestureResponderEvent) {
    if (this.props.onPress) {
      this.props.onPress(event);
    }
  }
}

let styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  untitledContainer: {
    paddingBottom: 13,
  },
  title: {
    color: '#929292',
    fontSize: 10,
    textAlign: 'center',
    alignSelf: 'stretch',
    marginTop: 4,
    marginBottom: 1 + Layout.pixel,
  },
});
