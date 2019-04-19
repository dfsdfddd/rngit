import React, {Component} from 'react';
import {DeviceEventEmitter,StyleSheet, ActivityIndicator, View, FlatList, RefreshControl, Text, DeviceInfo,TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action/index';
import TrendingItem from '../common/TrendingItem';
import Toast from 'react-native-easy-toast'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


// 导入 react-navigarion
import {createMaterialTopTabNavigator,createAppContainer} from 'react-navigation';

// 导入工具类
import NavigationUtil from '../navigator/NavigationUtil';

// 导入组件
import NavigationBar from '../common/NavigationBar';
import TrendingDialog, { TimeSpans } from '../common/TrendingDialog';
import FavoriteDao from '../expand/dao/FavoriteDao';
import { FLAG_STORAGE } from '../expand/dao/DataStore';
import FavoriteUtil from '../util/FavoriteUtil';
import { FLAG_LANGUAGE } from '../expand/dao/LanguageDao';
import ArrayUtil from '../util/ArrayUtil';


const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE'
const URL = `https://github.com/trending/`
const pageSize = 10
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending)


// 创建 createMaterialTopTabNavigator 需要的的路由组件
class TreadingTab extends Component {
  constructor(props){
    super(props)
    const {tabLabel,timeSpan} = this.props
    this.storeName = tabLabel
    this.timeSpan = timeSpan
  }
  componentDidMount(){
    this.loadData();
    this.timeSpanChangelistener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE,timeSpan=>{
      this.timeSpan = timeSpan
      this.loadData();
    })
  }
  componentWillUnmount(){
    if(this.timeSpanChangelistener){
      this.timeSpanChangelistener.remove()
    }
  }
  loadData(loadMore){
    const {onLoadTreadingData,onLoadMoreTreading}= this.props;
    const store = this._store()
    const url = this.getFetchUrl(this.storeName)
    if(loadMore){
      onLoadMoreTreading(this.storeName,++store.pageIndex,pageSize, store.items,favoriteDao, callBack=>{
        this.refs.toast.show('没有更多了')
      })
    } else {
      onLoadTreadingData(this.storeName,url,pageSize,favoriteDao)
    }
  }
  // 获取当前页面有关的数据
  _store(){
    const {treading} = this.props
    let store = treading[this.storeName] // 动态获取state
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
    return URL + key + '?' +this.timeSpan.searchText
  }
  renderItem(data){
    const {theme} = this.props
    const item = data.item
    return <TrendingItem
      theme={theme}
      projectModes={item}
      onSelect={(callback)=>{
        NavigationUtil.goPage({
          theme,
          projectModes:item,
          flag:FLAG_STORAGE.flag_trending,
          callback
        },'DetailPage')
      }}
      onFavorite={(item, isFavorite)=> FavoriteUtil.onFavorite(favoriteDao,item,isFavorite,FLAG_STORAGE.flag_trending)}

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
    const{theme} = this.props
    let store = this._store()
    return(
      <View style={styles.container}>
        <FlatList
          data={store.projectModes}
          renderItem={data=> this.renderItem(data)}
          keyExtractor={item=>""+(item.item.id || item.item.fullName)}
          refreshControl={
            <RefreshControl
              title={'Loading'}
              titleColor={theme.themeColor}
              colors={[theme.themeColor]}
              refreshing={store.isLoading}
              onRefresh={()=>this.loadData()}
              tintColor={theme.themeColor}
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

const mapStateToProps = (state) => ({
  treading: state.treading
})

const mapDispatchToProps = (dispatch) => ({
  onLoadTreadingData: (storeName, url, pageSize,favoriteDao) => dispatch(actions.onLoadTreadingData(storeName, url, pageSize,favoriteDao)),
  onLoadMoreTreading: (storeName,pageIndex,pageSize,items,favoriteDao,callBack) => dispatch(actions.onLoadMoreTreading(storeName,pageIndex,pageSize,items,favoriteDao,callBack))
})

const TreadingTabPage = connect(mapStateToProps,mapDispatchToProps)(TreadingTab)

// 主体导出组件
class TrendingPage extends Component {
  constructor(props){
    super(props);
    // this.tabsName = ['All','C','C++','Javascript','Php','Angular'];
    this.state={
      timeSpan:TimeSpans[0]
    }
    const {onLoadLanguage} = this.props
    onLoadLanguage(FLAG_LANGUAGE.flag_language)
    this.preKeys = []
  }
  // static router =  TopTabNavigator.router

  _genTab(){
    const tabs = {}
    const {keys,theme} = this.props
    this.preKeys = keys
    keys.forEach((item,index) => {
      if(item.checked){
        tabs[`tab${index}`] = {
          screen: props => <TreadingTabPage theme={theme} {...props} timeSpan={this.state.timeSpan} tabLabel={item.name}/>, // 这是个不错的技巧
          navigationOptions:{
            title:item.name
          }
        }
      }
    });
    return tabs
  }
  renderTitleView(){
    return <View>
      <TouchableOpacity
        ref='button'
        underlayColor='transparent'
        onPress={()=>this.dialog.show()}
      >
        <View style={{flexDirection: 'row',alignItems: 'center',}}>
          <Text style={{fontSize: 18,color:'#ffffff',fontWeight: '400'}}>趋势 {this.state.timeSpan.showText}</Text>
          <MaterialIcons
            name={'arrow-drop-down'}
            size={22}
            style={{color:'white'}}
          />
        </View>
      </TouchableOpacity>
    </View>
  }
  onSelectTimeSpan(tab){
    this.dialog.dismiss()
    console.log(tab);
    this.setState({
      timeSpan:tab
    })
    DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE,tab)
  }
  renderTrendingDialog(){
    return <TrendingDialog
      ref={dialog=>this.dialog=dialog}
      onSelect={tab=>this.onSelectTimeSpan(tab)}
    />
  }
  _tabNav(){
    const {theme} = this.props;
    // 主题🤒️变化需要重新渲染
    if(theme !== this.theme||!this.tabNav || !ArrayUtil.isEqual(this.preKeys,this.props.keys)){
      this.theme = theme
      this.tabNav = createAppContainer(createMaterialTopTabNavigator(this._genTab(),{
        tabBarOptions:{
          tabStyle: styles.tabStyle,
          upperCaseLabel: false,
          scrollEnabled: true,
          style: {
            backgroundColor: theme.themeColor,
            height:30
          },
          indicatorStyle:styles.indicatorStyle,
          labelStyle: styles.labelStyle
        },
        lazy: true // 懒加载目录，每次只加载一个tab
      }))
    }
    return this.tabNav
  }
  render() {
    const {keys,theme} = this.props
    let statusBar = {
      backgroundColor:theme.themeColor,
      barStyle:'light-content'
    }
    let navigationBar = <NavigationBar
      // title={'趋势'}
      titleView={this.renderTitleView()}
      statusBar={statusBar}
      style={theme.styles.navBar}
    />;
    // 使用路由，并且传递navigation 到新创建的路由
    const TopTabNav = keys.length ? this._tabNav() : null
    return  <View style={{flex:1,marginTop:DeviceInfo.isIPhoneX_deprecated?30:0}}>
      {/* <TopTabNavigator navigation={this.props.navigation}/> */}
      {navigationBar}
      {this.renderTrendingDialog()}
      {TopTabNav&&<TopTabNav/>}
    </View>
  }
}

const mapTrendingStateToProps = (state) => ({
  keys: state.language.languages,
  theme: state.theme.theme
})

const mapTrendingDispatchToProps = (dispatch) => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
})

export default connect(mapTrendingStateToProps,mapTrendingDispatchToProps)(TrendingPage)

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


// const mapStateToProps = (state) => ({})

// const mapDispatchToProps = (dispatch) => ({
//   onThemeChange: theme => dispatch(actions.onThemeChange(theme))
// })

// export default connect(mapStateToProps,mapDispatchToProps)(TrendingPage)