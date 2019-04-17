import React from 'react';
import {TouchableOpacity,StyleSheet,View,Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class ViewUtil {
  static getSettingItem(callback, text, color, Icons, icon, expandableIco){
    return <TouchableOpacity
        style={styles.setting_item_container}
        onPress={callback}
      >
        <View style={{alignItems: 'center',flexDirection: 'row'}}>
          {Icons&&icon?<Icons
              name={icon}
              size={16}
              style={{color:color,marginRight: 10,}}
            />:<View style={{opacity:1,width:16,height:16,marginRight: 10,}}></View>
          }
          <Text>{text}</Text>
        </View>
        <Ionicons
          style={{marginRight: 10,color: color||'black', alignSelf: 'center',}}
          name={expandableIco?expandableIco:'ios-arrow-forward'}
          size={16}
        />
      </TouchableOpacity>
  }
  static getMenuItem(callback,menu,color,expandableIco){
    return ViewUtil.getSettingItem(callback,menu.name,color,menu.Icons,menu.icon,expandableIco)
  }
  /**
   * 获取左侧返回按钮
   */
  static getLeftBackButton(callback){
    return <TouchableOpacity
      style={{padding:8,paddingLeft: 12}}
      onPress={callback}
    >
      <Ionicons
        name={'ios-arrow-back'}
        size={26}
        style={{color:'white'}}
      />
    </TouchableOpacity>
  }

  static getRightButton(title, callback){
    return <TouchableOpacity
      style={{alignItems: 'center',}}
      onPress={callback}
    >
      <Text style={{fontSize: 20, color:'#fff', marginRight: 10,}}>{title}</Text>
    </TouchableOpacity>
  }

  /**
   * 获取分享按钮
   * @param {} callback 
   */
  static getShareButton(){
    return <TouchableOpacity
      underlayColor={'transparent'}
      onPress={()=>{}}
    >
      <Ionicons
        name={'md-share'}
        size={20}
        style={{color:'white',opacity:0.9,marginRight: 10}}
      />
    </TouchableOpacity>
  }
};

const styles = StyleSheet.create({
  setting_item_container:{
    backgroundColor:'white',
    padding:10,height:60,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  }
})