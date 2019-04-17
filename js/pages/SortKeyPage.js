import React, {Component} from 'react';
import {TouchableHighlight,Alert,ScrollView,StyleSheet, ActivityIndicator, View, FlatList, RefreshControl, Text, DeviceInfo} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action/index';
import PopularItem from '../common/PopularItem';
import Toast from 'react-native-easy-toast'
import CheckBox from 'react-native-check-box'

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


// 导入 react-navigarion
import {createMaterialTopTabNavigator,createAppContainer} from 'react-navigation';

// 导入工具类
import NavigationUtil from '../navigator/NavigationUtil';

// 导入组件
import SortableListView from 'react-native-sortable-listview'

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
import LanguageDao, { FLAG_LANGUAGE } from '../expand/dao/LanguageDao';
import BackPressComponent from '../common/BackPressComponent';
import ViewUtil from '../util/ViewUtil';
import ArrayUtil from '../util/ArrayUtil';



class SortKeyPage extends Component {
  constructor(props){
    super(props);
    this.params = this.props.navigation.state.params
    // android 物理后退
    this.backPress = new BackPressComponent({backPress:(e)=>this.onBackPress()})
    
    this.languageDao = new LanguageDao(this.params.flag)

    this.state = {
      checkedArray: SortKeyPage._keys(this.props)
    }
    console.log('11111');
  }
  /**
   * 
   * @param {*} props 
   * @param {*} original 移除标签使用， 是否从props中获取原始标签
   * @param {*} state 移除标签使用
   */
  static _keys(props, state){
    // state 中有checkedArray 就取 否则就从原始数据中获取数据
    if(state&&state.checkedArray&&state.checkedArray.length){
      return this.state.checkedArray
    }
    const flag = SortKeyPage._flag(props)
    let dataArray = props.language[flag] || []
    let keys = []
    for (let i = 0, j=dataArray.length; i < j; i++) {
      let data = dataArray[i];
      if(data.checked) keys.push(data)
    }
    return keys
  }
  static _flag(props){
    const {flag} = props.navigation.state.params
    return flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages'
  }
  static getDerivedStateFromProps(nextProps,prevState){
    console.log('33333');

    const checkedArray = SortKeyPage._keys(nextProps, null, prevState);
    if(prevState.keys !== checkedArray){
      return {
        keys:checkedArray
      }
    }
    return null
  }
  componentDidMount(){
    console.log('22222');

    this.backPress.componentDidMount()
    if(SortKeyPage._keys(this.props).length === 0){
      let {onLoadLanguage} = this.props
      onLoadLanguage(this.params.flag)
    }
  }
  componentWillUnmount(){
    this.backPress.componentWillUnmount()
  }
  // static router =  TopTabNavigator.router
  onBackPress (e) {
    this.onBack()
    return true;
  };
  onBack(){
    if(!ArrayUtil.isEqual(SortKeyPage._keys(this.props),this.setState.checkedArray)){
      Alert.alert('提示','要保存修改吗',[
        {
          text: '否',
          onPress:()=>{
            NavigationUtil.goToBack(this.props.navigation)
          }
        },
        {
          text: '是',
          onPress:()=>{
            this.onSave()
          }
        },
      ])
    } else {
      NavigationUtil.goToBack(this.props.navigation)
    }
  }
  
  
  onSave(hasChecked){
    if(!hasChecked){
      // 没有排序直接返回
      if(ArrayUtil.isEqual(SortKeyPage._keys(this.props),this.state.checkedArray)){
        NavigationUtil.goToBack(this.props.navigation)
        return
      }
    }

    // 保存排序后的数据

    // 获取排序后的数据

    // 更新本地数据
    this.languageDao.save(this.getSortResult())
    const {onLoadLanguage} = this.props
    // 更新store
    onLoadLanguage(this.params.flag)
    NavigationUtil.goToBack(this.props.navigation)
  }
  // 获取排序后的标签结果
  getSortResult(){
    const flag = SortKeyPage._flag(this.props)
    // 从原始数据复制一份数据
    let sortResultArray = ArrayUtil.clone(this.props.language[flag])
    // 获取排序之前的排列顺序
    const preCheckedArray = SortKeyPage._keys(this.props)
    // 遍历排序前的数据，用排序后的数据checkedArray进行替换
    for (let i = 0,j=preCheckedArray.length; i < j; i++) {
      let item = preCheckedArray[i];
      let index = this.props.language[flag].indexOf(item)
      sortResultArray.splice(index,1,this.state.checkedArray[i])
    }
    return sortResultArray
  }
  
  render() {
    let title = this.params.flag === FLAG_LANGUAGE.flag_language ? '语言排序' : '标签排序'
    let navigationBar = <NavigationBar
      title={title}
      style={{backgroundColor:THEME_COLOR}}
      leftButton={ViewUtil.getLeftBackButton(()=>this.onBack())}
      rightButton={ViewUtil.getRightButton("保存",()=>this.onSave())}
    />;
    return <View style={styles.container}>
      {navigationBar}
      <SortableListView
        data={this.state.checkedArray}
        order={Object.keys(this.state.checkedArray)}
        onRowMoved={e => {
          this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0])
          this.forceUpdate()
        }}
        renderRow={row => <SortCell data={row} {...this.params}/>}
      />
    </View>
  }
}

class SortCell extends Component {
  render(){
    return <TouchableHighlight
      underlayColor={'#eee'}
      style={this.props.data.checked ? styles.item : styles.hidden}
      {...this.props.sortHandlers}
    >
      <View style={{marginLeft: 10,flexDirection: 'row',}}>
        <MaterialCommunityIcons
          name={'sort'}
          size={16}
          style={{marginRight: 10,color:THEME_COLOR}}
        />
        <Text>{this.props.data.name}</Text>
      </View>
    </TouchableHighlight>
  }
}

const mapPopStateToProps = (state) => ({
  language: state.language,
})

const mapPopDispatchToProps = (dispatch) => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
})

export default  connect(mapPopStateToProps,mapPopDispatchToProps)(SortKeyPage)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  line: {
    height: 0.5,
    opacity:0.5,
    backgroundColor:'darkgray'
  },
  hidden:{
    height:0
  },
  item:{
    backgroundColor:"#f8f8f8",
    borderBottomWidth: 1,
    borderColor: '#eee',
    height:50,
    justifyContent: 'center',
  }
});
