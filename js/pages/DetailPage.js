import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, WebView,DeviceInfo} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NavigationUtil from '../navigator/NavigationUtil';
import BackPressComponent from '../common/BackPressComponent';
import FavoriteDao from '../expand/dao/FavoriteDao';

const THEME_COLOR = '#678'
const TRENDING_URL = 'https://github.com/'

export default class DetailPage extends Component {
  constructor(props){
    super(props)
    this.params = this.props.navigation.state.params
    const {projectModes,flag} = this.params
    this.favoriteDao = new FavoriteDao(flag)
    this.url = projectModes.item.html_url || TRENDING_URL+projectModes.item.fullName
    const title = projectModes.item.full_name || projectModes.item.fullName
    this.state={
      title:title,
      url:this.url,
      canGoBack:false,
      isFavorite:projectModes.isFavorite
    }
    this.backPress = new BackPressComponent({backPress:()=>this.onBackPress()})
  }
  componentDidMount() {
    this.backPress.componentDidMount()
  }

  componentWillUnmount() {
    this.backPress.componentWillUnmount()
  }
  onBackPress () {
    this.onBack()
    return true;
  };
  onBack(){
    if(this.state.canGoBack){
      this.webview.goBack()
    } else {
      NavigationUtil.goToBack(this.props.navigation)
    }
  }
  onFavoriteButtonClick(){
    const {projectModes,callback} = this.params
    const isFavorite = projectModes.isFavorite = !projectModes.isFavorite
    callback(isFavorite)
    this.setState({
      isFavorite:isFavorite
    })
    let key = projectModes.item.fullName?projectModes.item.fullName:projectModes.item.id.toString()
    if(projectModes.isFavorite){
      this.favoriteDao.saveFavoriteItem(key,JSON.stringify(projectModes.item))
    } else {
      this.favoriteDao.removeFavoriteItem(key)
    }
  }
  renderRightButton(){
    return <View style={{flexDirection: 'row',}}>
        <TouchableOpacity
          onPress={()=> this.onFavoriteButtonClick()}
        >
          <FontAwesome
            name={this.state.isFavorite?'star':'star-o'}
            size={20}
            style={{color:'white',marginRight: 10,}}
          />
        </TouchableOpacity>
        {ViewUtil.getShareButton(()=>{})}
    </View>
  }
  onNavigationStateChange(navState){
    this.setState({
      canGoBack:navState.canGoBack,
      url: navState.url
    })
  }
  render() {
    const{theme} = this.params
    const titleLayoutStyle = this.state.title.length > 20 ? {paddingRight: 30} : null
    let navigationBar = <NavigationBar
      leftButton={ViewUtil.getLeftBackButton(()=>this.onBack())}
      titleLayoutStyle={titleLayoutStyle}
      title={this.state.title}
      style={theme.styles.navBar}
      rightButton={this.renderRightButton()}
    />;

    return (
      <View style={styles.container}>
        {navigationBar}
        <WebView
          ref={webview=>this.webview = webview}
          startInLoadingState={true}
          onNavigationStateChange={e=>this.onNavigationStateChange(e)}
          source={{uri:this.state.url}}
        ></WebView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
    marginTop:DeviceInfo.isIPhoneX_deprecated?30:0
  },
});
