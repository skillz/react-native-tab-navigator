'use strict';

import { Set } from 'immutable';
import React, { ReactNode } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ViewStyle,
  ViewProps
} from 'react-native';

import Badge from './Badge';
import Layout from './Layout';
import StaticContainer from './StaticContainer';
import Tab from './Tab';
import TabBar from './TabBar';
import TabNavigatorItem from './TabNavigatorItem';

type ITabNavigatorProps = ViewProps & {
  sceneStyle?: ViewStyle,
  tabBarStyle?: ViewStyle,
  tabBarShadowStyle?: ViewStyle,
  hidesTabTouch?: boolean,
  selected: boolean,
}

type ITabNavigatorState = {
  renderedSceneKeys: Set<string>,
}

export default class TabNavigator extends React.Component<ITabNavigatorProps, ITabNavigatorState> {
  static Item: typeof TabNavigatorItem;

  constructor(props:ITabNavigatorProps) {
    super(props);
    this.state = {
      renderedSceneKeys: this._updateRenderedSceneKeys(props.children),
    };

    this._renderTab = this._renderTab.bind(this);
  }

  componentWillReceiveProps(nextProps: ITabNavigatorProps) {
    let { renderedSceneKeys } = this.state;
    this.setState({
      renderedSceneKeys: this._updateRenderedSceneKeys(
        nextProps.children,
        renderedSceneKeys,
      ),
    });
  }

  _getSceneKey(item, index: number): string {
    return `scene-${(item.key !== null) ? item.key : index}`;
  }

  _updateRenderedSceneKeys(children: ReactNode, oldSceneKeys = Set()): Set<any> {
    let newSceneKeys = Set().asMutable();
    React.Children.forEach(children, (item, index) => {
      if (item === null) {
        return;
      }
      let key = this._getSceneKey(item, index);
      if (React.isValidElement(item)) {
        if (oldSceneKeys.has(key) || item?.props.selected) {
          newSceneKeys.add(key);
        }
      }
    });
    return newSceneKeys.asImmutable();
  }

  render() {
    let { style, children, tabBarStyle, tabBarShadowStyle, sceneStyle, ...props } = this.props;
    let scenes:ReactNode[] = [];

    React.Children.forEach(children, (item: ReactNode, index) => {
      if (item === null) {
        return;
      }
      if (React.isValidElement(item)) {
        let sceneKey = this._getSceneKey(item, index);
        if (!this.state.renderedSceneKeys.has(sceneKey)) {
          return;
        }

        let { selected } = item.props;
        let scene = (
          <SceneContainer key={sceneKey} selected={selected} style={sceneStyle}>
            {item}
          </SceneContainer>
        );
        scenes.push(scene);
      }
    });

    return (
      <View {...props} style={[styles.container, style]}>
        {scenes}
        <TabBar style={tabBarStyle} shadowStyle={tabBarShadowStyle}>
          {React.Children.map(children, this._renderTab)}
        </TabBar>
      </View>
    );
  }

  _renderTab(item: ReactNode) {
    if (React.isValidElement(item)) {
      if (item.props.renderTab) {
        return (
          <TouchableOpacity style={[styles.tabContainer, item.props.tabStyle]}
                            onPress={item.props.onPress}
                            activeOpacity={item.props.hidesTabTouch ? 1 : 0.8}
                            accessible={this.props.accessible}
                            accessibilityLabel={this.props.accessibilityLabel}>
            {item.props.renderTab(item.props.selected)}
          </TouchableOpacity>
        );
      }

      let icon;
      if (item === null) {
        return;
      }
      if (item.props.selected) {
        if (item.props.renderSelectedIcon) {
          icon = item.props.renderSelectedIcon();
        } else if (item.props.renderIcon) {
          let defaultIcon = item.props.renderIcon();
          icon = React.cloneElement(defaultIcon, {
            style: [defaultIcon.props.style, styles.defaultSelectedIcon],
          });
        }
      } else if (item.props.renderIcon) {
        icon = item.props.renderIcon();
      }

      let badge;
      if (item.props.renderBadge) {
        badge = item.props.renderBadge();
      } else if (item.props.badgeText) {
        badge = <Badge>{item.props.badgeText}</Badge>;
      }

      return (
        <Tab {...item.props}
          testID={item.props.testID}
          title={item.props.title}
          allowFontScaling={item.props.allowFontScaling}
          titleStyle={[
            item.props.titleStyle,
            item.props.selected ? [
              styles.defaultSelectedTitle,
              item.props.selectedTitleStyle,
            ] : null,
          ]}
          badge={badge}
          onPress={item.props.onPress}
          hidesTabTouch={this.props.hidesTabTouch}
          style={item.props.tabStyle}>
          {icon}
        </Tab>
      );
    }
  }
}

type ISceneContainerProps = ViewProps & {
  selected: boolean,
}

class SceneContainer extends React.Component<ISceneContainerProps> {

  render() {
    let { selected, ...props } = this.props;
    return (
      <View
        {...props}
        pointerEvents={selected ? 'auto' : 'none'}
        removeClippedSubviews={!selected}
        style={[
          styles.sceneContainer,
          selected ? null : styles.hiddenSceneContainer,
          props.style,
        ]}>
        <StaticContainer shouldUpdate={selected}>
          {this.props.children}
        </StaticContainer>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sceneContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: Layout.tabBarHeight,
  },
  hiddenSceneContainer: {
    overflow: 'hidden',
    opacity: 0,
  },
  defaultSelectedTitle: {
    color: 'rgb(0, 122, 255)',
  },
  defaultSelectedIcon: {
    tintColor: 'rgb(0, 122, 255)',
  },
  tabContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  }
});

TabNavigator.Item = TabNavigatorItem;
