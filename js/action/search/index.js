import Types from "../types";
import DataStore, { FLAG_STORAGE } from '../../expand/dao/DataStore';
import {handleData, _projectModels,doCallBack} from '../ActionUtil';
import types from "../types";
import ArrayUtil from "../../util/ArrayUtil";
import Utils from '../../util/Utils';

const API_URL = "https://api.github.com/search/repositories?q="
const QUERY_STR = "&sort=stars"
const CANCEL_TOKENS =[]

/**
 * 
 * @param {*} inputKey 搜索的key
 * @param {*} pageSize 分页大小
 * @param {*} token 是否在请求后台，请求了没有返回，可以取消
 * @param {*} favoriteDao 
 * @param {*} popKeys 最热模块下所有的标签
 * @param {*} callback 
 */
export function onSearch(inputKey,pageSize,token,favoriteDao,popKeys,callback) {
  return dispatch => {
    dispatch({type: Types.SEARCH_REFRESH})
    fetch(genFetchUrl(inputKey)).then((response) => {
      return hasCancel(token)?null:response.json()
    }).then((responseData)=>{
      // 点击取消
      if(hasCancel(token,true)){
        console.log('user cancel')
        return
      }
      // 是否有数据
      if(!responseData||!responseData.items||responseData.items.length === 0){
        dispatch({type:Types.SEARCH_FAIL,message:`没有找到关于${inputKey}的项目`})
        doCallBack(callBack,`没有找到关于${inputKey}的项目`)
        return
      }
      let items = responseData.items
      handleData(Types.SEARCH_REFRESH_SUCCESS,dispatch,"",{data:items},pageSize,favoriteDao,{
        showBottomButton: !Utils.checkKeyIsExist(popKeys,inputKey),// 输入的key是否存在于pop里面存在就true
        inputKey
      })
    }).catch((err) => {
      console.log(err)  
      dispatch({type:Types.SEARCH_FAIL,error:err})
    });
  }
}

export function onSearchCancel(token) {
  return dispatch => {
    CANCEL_TOKENS.push(token)
    dispatch({type:Types.SEARCH_CANCEL})
  }
}

/**
 * 
 * @param {*} pageIndex 第几页
 * @param {*} pageSize 每页数据
 * @param {*} dataArray 原始数据
 * @param {*} callBack 返回异常信息和没有更多等
 */
export function onLoadMoreSearch(pageIndex,pageSize,dataArray=[],favoriteDao,callBack){
  return dispatch => {
    setTimeout(() => { // 模拟请求
      console.log('add end')
      if((pageIndex-1)*pageSize>=dataArray.length){// 已加载完所有数据
        if(typeof callBack === 'function'){
          callBack('no more')
        }
        dispatch({
          type: Types.SEARCH_LOAD_MORE_FAIL,
          error:'no more',
          pageIndex:--pageIndex,
        })
      } else {
        console.log('add normal')
        // 本次和载入的最大数量
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize*pageIndex
        _projectModels(dataArray.slice(0,max),favoriteDao,data=>{
          dispatch({
            type: Types.SEARCH_LOAD_MORE_SUCCESS,
            pageIndex,
            projectModes: data
          })
        })
      }
    }, 500);
  }
}


function genFetchUrl(key) {
  return API_URL + key + QUERY_STR
}
function hasCancel(token,isRemove) {
  if(CANCEL_TOKENS.includes(token)){
    isRemove&&ArrayUtil.remove(CANCEL_TOKENS,token)
    return true
  }
  return false
}
function checkKeyIsExist(keys,key) {
  for (let i = 0,l = keys.length; i < l; i++) {
    if(key.toLowerCase()===keys[i].name.toLowerCase())return true
  }
  return false
}