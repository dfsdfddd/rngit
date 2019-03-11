import React, {Component} from 'react';
import {StyleSheet, Text, View, FlatList, RefreshControl} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action/index';
import PopularItem from '../common/PopularItem';

// 导入 react-navigarion
import {createMaterialTopTabNavigator,createAppContainer} from 'react-navigation';

// 导入工具类

import NavigationUtil from '../navigator/NavigationUtil';

const URL = `https://api.github.com/search/repositories?q=`
const QUERY_STR = '&sort=stars'
const THEME_COLOR = 'red'

// 创建 createMaterialTopTabNavigator 需要的的路由组件
class PopTab extends Component {
  constructor(props){
    super(props)
    const {tabLabel} = this.props
    this.storeName = tabLabel
  }
  componentDidMount(){
    this.loadData();
  }
  loadData(){
    const {onLoadPopData} = this.props;
    const url = this.getFetchUrl(this.storeName)
    onLoadPopData(this.storeName,url)
  }
  getFetchUrl(key){
    return URL + key + QUERY_STR
  }
  renderItem(data){
    const item = data.item
    return <PopularItem
      item={item}
      onSelect={()=>{

      }}
    />
  }
  render(){
    const {popular} = this.props
    let store = popular[this.storeName] // 动态回去state
    if(!store){
      store = {
        items:[],
        isLoading: false
      }
    }
    return(
      <View style={styles.container}>
        <FlatList
          data={store.items}
          renderItem={data=> this.renderItem(data)}
          keyExtractor={item=>""+item.id}
          refreshControl={
            <RefreshControl
              title={'Loading'}
              titleColor={THEME_COLOR}
              colors={THEME_COLOR}
              refreshing={store.isLoading}
              onRefresh={()=>this.loadData()}
              tintColor={THEME_COLOR}
            />
          }
        />
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
  constructor(props){
    super(props);
    this.tabsName = ['Java','Android','React','React-native','Php','Vue'];
  }
  // static router =  TopTabNavigator.router

  _genTab(){
    const tabs = {}
    this.tabsName.forEach((item,index) => {
      tabs[`tab${index}`] = {
        screen: props => <PopTabPage {...props} tabLabel={item}/>, // 这是个不错的技巧
        navigationOptions:{
          title:item
        }
      }
    });
    return tabs
  }
  render() {
    // 使用路由，并且传递navigation 到新创建的路由
    const TopTabNav = createAppContainer(createMaterialTopTabNavigator(this._genTab(),{
      tabBarOptions:{
        tabStyle: styles.tabStyle,
        upperCaseLabel: false,
        scrollEnabled: true,
        style: {
          backgroundColor: '#678'
        },
        indicatorStyle:styles.indicatorStyle,
        labelStyle: styles.labelStyle
      }
    }))
    return  <View style={{flex:1,marginTop:30}}>
      {/* <TopTabNavigator navigation={this.props.navigation}/> */}
      <TopTabNav/>
    </View>
  }
}

const mapStateToProps = (state) => ({
  popular: state.popular
})

const mapDispatchToProps = (dispatch) => ({
  onLoadPopData: (storeName, url) => dispatch(actions.onLoadPopData(storeName, url))
})

const PopTabPage = connect(mapStateToProps,mapDispatchToProps)(PopTab)

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
  },
  tabStyle:{
    minWidth:50
  },
  indicatorStyle:{
    height:2,
    backgroundColor:'white'
  },
  labelStyle:{
    fontSize:13,
    marginTop:6,
    marginBottom:6
  }
});
