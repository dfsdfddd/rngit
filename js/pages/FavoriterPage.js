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
import EventTypes from '../util/EventTypes';
import EventBus from 'react-native-event-bus'


// 导入组件
import NavigationBar from '../common/NavigationBar';
import FavoriteDao from '../expand/dao/FavoriteDao';
import { FLAG_STORAGE } from '../expand/dao/DataStore';
import FavoriteUtil from '../util/FavoriteUtil';
import TrendingItem from '../common/TrendingItem';

const URL = `https://api.github.com/search/repositories?q=`
const QUERY_STR = '&sort=stars'
const THEME_COLOR = '#678'
const pageSize = 10
// const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)


// 创建 createMaterialTopTabNavigator 需要的的路由组件
class FavoriteTab extends Component {
  constructor(props){
    super(props)
    const {flag} = this.props
    this.storeName = flag
    this.favoriteDao = new FavoriteDao(flag)
  }
  componentDidMount(){
    this.loadData(true);
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.listener = data => {
      if(data.to === 2){
        this.loadData(false)
      }
    })
  }
  componentWillUnmount(){
    EventBus.getInstance().removeListener(this.listener)
  }
  loadData(isShowLoading){
    const {onLoadFavoriteData}= this.props;
    onLoadFavoriteData(this.storeName, isShowLoading)
  }
  // 获取当前页面有关的数据
  _store(){
    const {favorite} = this.props
    let store = favorite[this.storeName] // 动态获取state
    if(!store){
      store = {
        items:[],
        isLoading: false,
        projectModes:[], // 要显示的数据
      }
    }
    return store
  }
  onFavorite(item, isFavorite){
    FavoriteUtil.onFavorite(this.favoriteDao,item,isFavorite,this.props.flag)
    if(this.storeName === FLAG_STORAGE.flag_popular){
      EventBus.getInstance().fireEvent(EventTypes.favorite_changed_popular)
    } else {
      EventBus.getInstance().fireEvent(EventTypes.favorite_changed_trending)
    }
  }
  renderItem(data){
    const {theme} = this.props
    const item = data.item
    const Item = this.storeName === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem
    return <Item
      theme={theme}
      projectModes={item}
      onSelect={(callback)=>{
        NavigationUtil.goPage({
          theme,
          projectModes:item,
          flag:this.storeName,
          callback
        },'DetailPage')
      }}
      onFavorite={(item,isFavorite)=> this.onFavorite(item, isFavorite)}
    />
  }
  render(){
    const {theme} = this.props
    let store = this._store()
    return(
      <View style={styles.container}>
        <FlatList
          data={store.projectModes}
          renderItem={data=> this.renderItem(data)}
          keyExtractor={item=>""+(item.item.id||item.item.fullName)}
          refreshControl={
            <RefreshControl
              title={'Loading'}
              titleColor={theme.themeColor}
              colors={[theme.themeColor]}
              refreshing={store.isLoading}
              onRefresh={()=>this.loadData(true)}
              tintColor={theme.themeColor}
            />
          }
        />
        <Toast
          ref={'toast'}
          position={'center'}
        />
      </View>
    )
  }
};

const mapStateToProps = (state) => ({
  favorite: state.favorite,
})

const mapDispatchToProps = (dispatch) => ({
  onLoadFavoriteData: (storeName, isShowLoading) => dispatch(actions.onLoadFavoriteData(storeName, isShowLoading)),
})

const FavoriteTabPage = connect(mapStateToProps,mapDispatchToProps)(FavoriteTab)

// 主体导出组件
class FavoriterPage extends Component {
  constructor(props){
    super(props);
    this.tabsName = ['最热','趋势'];
  }
  // static router =  TopTabNavigator.router
  render() {
    const {theme} = this.props
    let statusBar = {
      backgroundColor:theme.themeColor,
      barStyle:'light-content'
    }
    let navigationBar = <NavigationBar
      title={'收藏'}
      statusBar={statusBar}
      style={theme.styles.navBar}
    />;
    // 使用路由，并且传递navigation 到新创建的路由
    const TopTabNav = createAppContainer(createMaterialTopTabNavigator({
      'Popular':{
        screen: props => <FavoriteTabPage theme={theme} {...props} flag={FLAG_STORAGE.flag_popular}/>,
        navigationOptions:{
          title:'最热'
        }
      },
      'Trending':{
        screen: props => <FavoriteTabPage theme={theme} {...props} flag={FLAG_STORAGE.flag_trending}/>,
        navigationOptions:{
          title:'趋势'
        }
      },
    },{
      tabBarOptions:{
        tabStyle: styles.tabStyle,
        upperCaseLabel: false,
        style: {
          backgroundColor: theme.themeColor,
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

const mapFavStateToProps = (state) => {
  return ({
    theme: state.theme.theme,
  });
}

export default connect(mapFavStateToProps)(FavoriterPage)

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
