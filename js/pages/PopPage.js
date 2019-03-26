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
import FavoriteDao from '../expand/dao/FavoriteDao';
import { FLAG_STORAGE } from '../expand/dao/DataStore';
import FavoriteUtil from '../util/FavoriteUtil';

const URL = `https://api.github.com/search/repositories?q=`
const QUERY_STR = '&sort=stars'
const THEME_COLOR = '#678'
const pageSize = 10
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)

import EventTypes from '../util/EventTypes';
import EventBus from 'react-native-event-bus'
import { FLAG_LANGUAGE } from '../expand/dao/LanguageDao';
// 创建 createMaterialTopTabNavigator 需要的的路由组件
class PopTab extends Component {
  constructor(props){
    super(props)
    const {tabLabel} = this.props
    this.storeName = tabLabel
    this.isFavoriteChanged = false
  }
  componentDidMount(){
    this.loadData();
    EventBus.getInstance().addListener(EventTypes.favorite_changed_popular, this.favoriteChangeListener = () => {
      this.isFavoriteChanged = true
    })
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomTabSelectListener = data => {
      if(data.to === 0 && this.isFavoriteChanged){
        this.loadData(null,true)
      }
    })
  }
  componentWillUnmount(){
    EventBus.getInstance().removeListener(this.favoriteChangeListener)
    EventBus.getInstance().removeListener(this.bottomTabSelectListener)
  }
  loadData(loadMore,refreshFavorite){
    const {onLoadPopData,onLoadMorePop,onFlushPopularFavorite}= this.props;
    const store = this._store()
    const url = this.getFetchUrl(this.storeName)
    if(loadMore){
      onLoadMorePop(this.storeName,++store.pageIndex,pageSize, store.items,favoriteDao, callBack=>{
        this.refs.toast.show('没有更多了')
      })
    } else if(refreshFavorite){
      onFlushPopularFavorite(this.storeName, store.pageIndex, pageSize,store.items, favoriteDao)
    } else {
      onLoadPopData(this.storeName,url,pageSize,favoriteDao)
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
      projectModes={item}
      onSelect={(callback)=>{
        NavigationUtil.goPage({
          projectModes:item,
          flag:FLAG_STORAGE.flag_popular,
          callback
        },'DetailPage')
      }}
      onFavorite={(item,isFavorite)=>FavoriteUtil.onFavorite(favoriteDao,item,isFavorite,FLAG_STORAGE.flag_popular)}
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
          keyExtractor={item=>""+item.item.id}
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

const mapStateToProps = (state) => ({
  popular: state.popular
})

const mapDispatchToProps = (dispatch) => ({
  onLoadPopData: (storeName, url, pageSize,favoriteDao) => dispatch(actions.onLoadPopData(storeName, url, pageSize,favoriteDao)),
  onLoadMorePop: (storeName,pageIndex,pageSize,items,favoriteDao,callBack) => dispatch(actions.onLoadMorePop(storeName,pageIndex,pageSize,items,favoriteDao,callBack)),
  onFlushPopularFavorite: (storeName,pageIndex,pageSize,items,favoriteDao) => dispatch(actions.onFlushPopularFavorite(storeName,pageIndex,pageSize,items,favoriteDao))
})

const PopTabPage = connect(mapStateToProps,mapDispatchToProps)(PopTab)
// 主体导出组件
class PopPage extends Component {
  constructor(props){
    super(props);
    const {onLoadLanguage} = this.props;
    onLoadLanguage(FLAG_LANGUAGE.flag_key);
  }
  // static router =  TopTabNavigator.router

  _genTab(){
    const tabs = {}
    const {keys} = this.props;
    keys.forEach((item,index) => {
      if(item.checked){
        tabs[`tab${index}`] = {
          screen: props => <PopTabPage {...props} tabLabel={item.name}/>, // 这是个不错的技巧
          navigationOptions:{
            title:item.name
          }
        }
      }
      
    });
    return tabs
  }
  render() {
    const {keys} = this.props;

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
    const TopTabNav =keys.length ? createAppContainer(createMaterialTopTabNavigator(this._genTab(),{
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
    })) : null
    return  <View style={{flex:1,marginTop:DeviceInfo.isIPhoneX_deprecated?30:0}}>
      {/* <TopTabNavigator navigation={this.props.navigation}/> */}
      {navigationBar}
      {TopTabNav&&<TopTabNav/>}
      
    </View>
  }
}

const mapPopStateToProps = (state) => ({
  keys: state.language.keys,
})

const mapPopDispatchToProps = (dispatch) => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
})

export default  connect(mapPopStateToProps,mapPopDispatchToProps)(PopPage)

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
