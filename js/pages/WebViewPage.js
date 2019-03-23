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

export default class WebViewPage extends Component {
  constructor(props){
    super(props)
    this.params = this.props.navigation.state.params
    const {title,url} = this.params
    this.state={
      title:title,
      url:url,
      canGoBack:false,
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
  onNavigationStateChange(navState){
    this.setState({
      canGoBack:navState.canGoBack,
      url: navState.url
    })
  }
  render() {
    let navigationBar = <NavigationBar
      leftButton={ViewUtil.getLeftBackButton(()=>this.onBackPress())}
      title={this.state.title}
      style={{backgroundColor:THEME_COLOR}}
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
