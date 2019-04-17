import React, {Component} from 'react';
import {Alert,ScrollView,StyleSheet, ActivityIndicator, View, FlatList, RefreshControl, Text, DeviceInfo} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action/index';
import PopularItem from '../common/PopularItem';
import Toast from 'react-native-easy-toast'
import CheckBox from 'react-native-check-box'

import Ionicons from 'react-native-vector-icons/Ionicons';


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
import LanguageDao, { FLAG_LANGUAGE } from '../expand/dao/LanguageDao';
import BackPressComponent from '../common/BackPressComponent';
import ViewUtil from '../util/ViewUtil';
import ArrayUtil from '../util/ArrayUtil';



class CustomKeyPage extends Component {
  constructor(props){
    super(props);
    this.params = this.props.navigation.state.params
    // android 物理后退
    this.backPress = new BackPressComponent({backPress:(e)=>this.onBackPress()})
    
    this.changeValues = []
    // 是否是移除的标签
    this.isRemoveKey = !!this.params.isRemoveKey
    // 获取langguageDao
    this.languageDao = new LanguageDao(this.params.flag)

    this.state = {
      keys: []
    }
  }
  /**
   * 
   * @param {*} props 
   * @param {*} original 移除标签使用， 是否从props中获取原始标签
   * @param {*} state 移除标签使用
   */
  static _keys(props, original, state){
    const {flag,isRemoveKey} = props.navigation.state.params
    let key = flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages'
    if (isRemoveKey&&!original){
      return state && state.keys && state.keys.length !== 0 && state.keys || props.language[key].map(val=>{
        return {
          ...val,
          checked: false
        }
      })
    } else {
      return props.language[key]
    }
  }
  static getDerivedStateFromProps(nextProps,prevState){
    if(prevState.keys !== CustomKeyPage._keys(nextProps,null,prevState)){
      return {
        keys:CustomKeyPage._keys(nextProps,null,prevState)
      }
    }
    return null
  }
  componentDidMount(){
    this.backPress.componentDidMount()
    if(CustomKeyPage._keys(this.props).length === 0){
      let {onLoadLanguage} = this.props
      onLoadLanguage(this.params.flag)
    }
    this.setState({
      keys:CustomKeyPage._keys(this.props)
    })
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
    if(this.changeValues.length > 0){
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
  
  
  onSave(){
    if(this.changeValues.length === 0){
      NavigationUtil.goToBack(this.props.navigation)
      return
    }

    let keys;

    if(this.isRemoveKey){
      for (let i = 0,l = this.changeValues.length; i < l; i++) {
        ArrayUtil.remove(keys = CustomKeyPage._keys(this.props,true),this.changeValues[i],"name")
      }
    }
    // 更新本地数据
    this.languageDao.save(keys || this.state.keys)
    const {onLoadLanguage} = this.props
    // 更新store
    onLoadLanguage(this.params.flag)
    NavigationUtil.goToBack(this.props.navigation)
  }
  renderView(){
    let dataArray = this.state.keys
    if(!dataArray || dataArray.length === 0) return
    let len = dataArray.length
    let views= []
    for (let i = 0,l = len; i < l; i+=2) {
      views.push(
        <View keys={i}>
          <View style={styles.item}>
            {this.renderCheckBox(dataArray[i],i)}
            {i+1<len&&this.renderCheckBox(dataArray[i+1],i+1)}
          </View>
          <View style={styles.line}></View>
        </View>
      )
    }
    return views
  }
  onClick(data,index){
    data.checked = !data.checked
    ArrayUtil.updateArray(this.changeValues,data)
    this.state.keys[index]=data
    this.setState({
      keys: this.state.keys
    })
  }
  _checkedImage(checked){
    const {theme} = this.params
    return <Ionicons
      name={checked?'ios-checkbox':'md-square-outline'}
      size={20}
      style={{color: THEME_COLOR}}
    />
  }
  renderCheckBox(data,index){
    return <CheckBox
      style={{flex: 1, padding: 10}}
      onClick={()=> this.onClick(data,index)}
      isChecked={data.checked}
      leftText={data.name}
      checkedImage={this._checkedImage(true)}
      unCheckedImage={this._checkedImage(false)}
  />
  }
  render() {
    let title = this.isRemoveKey ? '标签移除' : '自定义标签'
    title = this.params.flag === FLAG_LANGUAGE.flag_language ? '自定义语言' : title
    let rightButtonTitle = this.isRemoveKey ? '移除' : '保存'
    let navigationBar = <NavigationBar
      title={title}
      style={{backgroundColor:THEME_COLOR}}
      leftButton={ViewUtil.getLeftBackButton(()=>this.onBack())}
      rightButton={ViewUtil.getRightButton(rightButtonTitle,()=>this.onSave())}
    />;
    return <View style={styles.container}>
      {navigationBar}
      <ScrollView>
        {this.renderView()}
      </ScrollView>
    </View>
  }
}

const mapPopStateToProps = (state) => ({
  language: state.language,
})

const mapPopDispatchToProps = (dispatch) => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
})

export default  connect(mapPopStateToProps,mapPopDispatchToProps)(CustomKeyPage)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
  },
  line: {
    height: 0.5,
    opacity:0.5,
    backgroundColor:'darkgray'
  }
});
