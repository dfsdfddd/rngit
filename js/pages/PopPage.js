import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

// 导入 react-navigarion
import {createMaterialTopTabNavigator} from 'react-navigation';

// 导入工具类

import NavigationUtil from '../navigator/NavigationUtil';

// 创建 createMaterialTopTabNavigator 需要的的路由组件
class PopTab extends Component {
  render(){
    const {tabLabel} = this.props
    return(
      <View style={styles.container}>
        <Text style={styles.welcome}>PopPage</Text>
        <Text style={styles.welcome}>{tabLabel}</Text>
        <Text onPress={()=>{
          NavigationUtil.goPage({
            navigation: this.props.navigation
          },'DetailPage')
        }}>跳转到详情页面</Text>
      </View>
    )
  }
};

// 创建路由
const TopTabNavigator = createMaterialTopTabNavigator({
  PopTab1:{
    screen: PopTab,
    navigationOptions:{
      title:'tab1'
    }
  },
  PopTab2:{
    screen: PopTab,
    navigationOptions:{
      title:'tab2'
    }
  },
})
// 主体导出组件
export default class PopPage extends Component {
  static router =  TopTabNavigator.router
  render() {
    // 使用路由，并且传递navigation 到新创建的路由
    return  <View style={{flex:1,marginTop:30}}>
      <TopTabNavigator navigation={this.props.navigation}/>
    </View>
  }
}



const styles = StyleSheet.create({
  container: {
  flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});
