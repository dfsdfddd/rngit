import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HTMLView from 'react-native-htmlview'; // reactnative 中显示
import BaseItem from './BaseItem';

export default class TrendingItem extends BaseItem {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const {projectModes} = this.props
    const {item} =projectModes
    if(!item) return null
    let description ='<p>'+ item.description +'</p>'
    return (
      <TouchableOpacity
        onPress={()=>{this.onItemClick()}}
      >
        <View style={styles.cell_container}>
          <Text style={styles.title}>
            {item.fullName}
          </Text>
          <HTMLView
            value={description}
            onLinkPress={(url)=>{}}
            stylesheet={{
              p: styles.description,
              a: styles.description
            }}
          />
          <Text style={styles.description}>
            {item.meta}
          </Text>
          <View style={styles.row}>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <Text>Built by:</Text>
              {item.contributors.map((resule,i,arr)=>{
                  return <Image
                    key={i}
                    style={{height:22,width:22,margin: 2,}}
                    source={{uri:arr[i]}}
                  />
                })}
              {/* <Image
                style={{height:22,width:22}}
                source={{uri:item.contributors[0]||''}}
              /> */}
              
            </View>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <Text>Start:</Text>
              <Text>{item.starCount}</Text>
            </View>
            {this._favoriteIcon()}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}


const styles = StyleSheet.create({
  row: {
    justifyContent:'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cell_container:{
    backgroundColor:'white',
    padding:10,
    marginLeft: 5,
    marginRight: 5,
    marginVertical: 3,
    borderColor: '#dddddd',
    borderWidth: 0.5,
    borderRadius: 2,
    shadowColor: 'gray',
    shadowOffset: {width:0.5,height:0.5},
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation:2 // 安卓里面的阴影
  },
  title:{
    fontSize: 16,
    marginBottom: 2,
    color:'#212121'
  },
  description:{
    fontSize: 16,
    marginBottom: 2,
    color:'#757575'
  }
})