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

const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE'
const URL = `https://github.com/trending/`
const THEME_COLOR = '#678'
const pageSize = 10

// 创建 createMaterialTopTabNavigator 需要的的路由组件
class TreadingTab extends Component {
  constructor(props){
    super(props)
    const {tabLabel,timeSpan} = this.props
    console.log(timeSpan);
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
      onLoadMoreTreading(this.storeName,++store.pageIndex,pageSize, store.items, callBack=>{
        this.refs.toast.show('没有更多了')
      })
    } else {
      onLoadTreadingData(this.storeName,url,pageSize)
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
    const item = data.item
    return <TrendingItem
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
          keyExtractor={item=>""+(item.id || item.fullName)}
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

// 主体导出组件
export default class TrendingPage extends Component {
  constructor(props){
    super(props);
    this.tabsName = ['All','C','C++','Javascript','Php','Angular'];
    this.state={
      timeSpan:TimeSpans[0]
    }
  }
  // static router =  TopTabNavigator.router

  _genTab(){
    const tabs = {}
    this.tabsName.forEach((item,index) => {
      tabs[`tab${index}`] = {
        screen: props => <TreadingTabPage {...props} timeSpan={this.state.timeSpan} tabLabel={item}/>, // 这是个不错的技巧
        navigationOptions:{
          title:item
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
    if(!this.tabNav){
      this.tabNav = createAppContainer(createMaterialTopTabNavigator(this._genTab(),{
        tabBarOptions:{
          tabStyle: styles.tabStyle,
          upperCaseLabel: false,
          scrollEnabled: true,
          style: {
            backgroundColor: '#678',
            height:30
          },
          indicatorStyle:styles.indicatorStyle,
          labelStyle: styles.labelStyle
        }
      }))
    }
    return this.tabNav
  }
  render() {
    let statusBar = {
      backgroundColor:THEME_COLOR,
      barStyle:'light-content'
    }
    let navigationBar = <NavigationBar
      // title={'趋势'}
      titleView={this.renderTitleView()}
      statusBar={statusBar}
      style={{backgroundColor:THEME_COLOR}}
    />;
    // 使用路由，并且传递navigation 到新创建的路由
    const TopTabNav = this._tabNav()
    return  <View style={{flex:1,marginTop:DeviceInfo.isIPhoneX_deprecated?30:0}}>
      {/* <TopTabNavigator navigation={this.props.navigation}/> */}
      {navigationBar}
      {this.renderTrendingDialog()}
      <TopTabNav/>
    </View>
  }
}

const mapStateToProps = (state) => ({
  treading: state.treading
})

const mapDispatchToProps = (dispatch) => ({
  onLoadTreadingData: (storeName, url, pageSize) => dispatch(actions.onLoadTreadingData(storeName, url, pageSize)),
  onLoadMoreTreading: (storeName,pageIndex,pageSize,items,callBack) => dispatch(actions.onLoadMoreTreading(storeName,pageIndex,pageSize,items,callBack))
})

const TreadingTabPage = connect(mapStateToProps,mapDispatchToProps)(TreadingTab)

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