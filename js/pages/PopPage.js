import React, {Component} from 'react';
import {StyleSheet, ActivityIndicator, View, FlatList, RefreshControl, Text, DeviceInfo} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action/index';
import PopularItem from '../common/PopularItem';
import Toast from 'react-native-easy-toast'

// 导入 react-navigarion
import {createMaterialTopTabNavigator,createAppContainer} from 'react-navigation';

// 导入工具类
import NavigationUtil from '../navigator/NavigationUtil';

// 导入组件
import NavigationBar from '../common/NavigationBar';

const URL = `https://api.github.com/search/repositories?q=`
const QUERY_STR = '&sort=stars'
const THEME_COLOR = '#678'
const pageSize = 10

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
  loadData(loadMore){
    const {onLoadPopData,onLoadMorePop}= this.props;
    const store = this._store()
    const url = this.getFetchUrl(this.storeName)
    if(loadMore){
      onLoadMorePop(this.storeName,++store.pageIndex,pageSize, store.items, callBack=>{
        this.refs.toast.show('没有更多了')
      })
    } else {
      onLoadPopData(this.storeName,url,pageSize)
    }
  }
  // 获取当前页面有关的数据
  _store(){
    const {popular} = this.props
    let store = popular[this.storeName] // 动态获取state
    if(!store){
      store = {
        items:[],
        isLoading: false,
        projectModes:[], // 要显示的数据
        hideLoadingMore: true // 默认隐藏加载更多
      }
    }
    return store
  }
  getFetchUrl(key){
    return URL + key + QUERY_STR
  }
  renderItem(data){
    const item = data.item
    return <PopularItem
      item={item}
      onSelect={()=>{
        NavigationUtil.goPage({projectModes:item},'DetailPage')
      }}
    />
  }
  genIndicator(){
    return this._store().hideLoadingMore?null:
    <View style={styles.indicatorContainer}>
      <ActivityIndicator
        style={styles.indicator}
      />
      <Text>正在加载更多</Text>
    </View>
  }
  render(){
    let store = this._store()
    return(
      <View style={styles.container}>
        <FlatList
          data={store.projectModes}
          renderItem={data=> this.renderItem(data)}
          keyExtractor={item=>""+item.id}
          refreshControl={
            <RefreshControl
              title={'Loading'}
              titleColor={THEME_COLOR}
              colors={[THEME_COLOR]}
              refreshing={store.isLoading}
              onRefresh={()=>this.loadData()}
              tintColor={THEME_COLOR}
            />
          }
          ListFooterComponent={()=>this.genIndicator()}
          onEndReached={()=>{
            setTimeout(() => {
              if(this.canLoadMore){
                this.loadData(true)
                this.canLoadMore = false
              }
            }, 100);
          }}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={()=>{
            this.canLoadMore=true // 初始化 fix onEndReached 两次调用
          }}
        />
        <Toast
          ref={'toast'}
          position={'center'}
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
    let statusBar = {
      backgroundColor:THEME_COLOR,
      barStyle:'light-content'
    }
    let navigationBar = <NavigationBar
      title={'最热'}
      statusBar={statusBar}
      style={{backgroundColor:THEME_COLOR}}
    />;
    // 使用路由，并且传递navigation 到新创建的路由
    const TopTabNav = createAppContainer(createMaterialTopTabNavigator(this._genTab(),{
      tabBarOptions:{
        tabStyle: styles.tabStyle,
        upperCaseLabel: false,
        scrollEnabled: true,
        style: {
          backgroundColor: '#678',
          height: 30
        },
        indicatorStyle:styles.indicatorStyle,
        labelStyle: styles.labelStyle
      }
    }))
    return  <View style={{flex:1,marginTop:DeviceInfo.isIPhoneX_deprecated?30:0}}>
      {/* <TopTabNavigator navigation={this.props.navigation}/> */}
      {navigationBar}
      <TopTabNav/>
    </View>
  }
}

const mapStateToProps = (state) => ({
  popular: state.popular
})

const mapDispatchToProps = (dispatch) => ({
  onLoadPopData: (storeName, url, pageSize) => dispatch(actions.onLoadPopData(storeName, url, pageSize)),
  onLoadMorePop: (storeName,pageIndex,pageSize,items,callBack) => dispatch(actions.onLoadMorePop(storeName,pageIndex,pageSize,items,callBack))
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
    padding:0
    // minWidth:50
  },
  indicatorStyle:{
    height:2,
    backgroundColor:'white'
  },
  labelStyle:{
    fontSize:13,
    margin:0
    // marginTop:6,
    // marginBottom:6
  },
  indicatorContainer:{
    alignItems:'center'
  },
  indicator:{
    color:'red',
    margin: 10,
  }
});
