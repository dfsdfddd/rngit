import Types from "../types";
import DataStore, { FLAG_STORAGE } from '../../expand/dao/DataStore';
import {handleData, _projectModels} from '../ActionUtil';

/**
 * dispatch 为异步actioin 需要导入 redux-thunk 包才有效
 * @param storeName 获取某个tab的信息
 */
export function onLoadTreadingData(storeName,url,pageSize,favoriteDao) {
  return dispatch => {
    dispatch({type: Types.TREADING_REFRESH, storeName: storeName})
    let dataStore = new DataStore()
    dataStore.fetchData(url,FLAG_STORAGE.flag_trending).then((result) => { // 异步操作
      handleData(Types.TREADING_REFRESH_SUCCESS,dispatch, storeName, result, pageSize,favoriteDao)
    }).catch((err) => {
      console.log(err)
      dispatch({
        type: Types.TREADING_REFRESH_FAIL, 
        storeName,
        error: err
      })
    });
  }
}

/**
 * 
 * @param {*} storeName 
 * @param {*} pageIndex 第几页
 * @param {*} pageSize 每页数据
 * @param {*} dataArray 原始数据
 * @param {*} callBack 返回异常信息和没有更多等
 */
export function onLoadMoreTreading(storeName,pageIndex,pageSize,dataArray=[],favoriteDao,callBack){
  return dispatch => {
    setTimeout(() => { // 模拟请求
      console.log('add end')
      if((pageIndex-1)*pageSize>=dataArray.length){// 已加载完所有数据
        if(typeof callBack === 'function'){
          callBack('no more')
        }
        dispatch({
          type: Types.TREADING_LOAD_MORE_FAIL,
          error:'no more',
          storeName: storeName,
          pageIndex:--pageIndex,
          projectModes:dataArray
        })
      } else {
        console.log('add normal')
        // 本次和载入的最大数量
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize*pageIndex
        _projectModels(dataArray.slice(0,max),favoriteDao,data=>{
          dispatch({
            type: Types.TREADING_LOAD_MORE_SUCCESS,
            storeName,
            pageIndex,
            projectModes: data
          })
        })
        
      }
    }, 500);
  }
}
