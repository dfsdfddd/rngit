import Types from "../types";
import DataStore from '../../expand/dao/DataStore';

/**
 * dispatch 为异步actioin 需要导入 redux-thunk 包才有效
 * @param storeName 获取某个tab的信息
 */
export function onLoadPopData(storeName,url,pageSize) {
  return dispatch => {
    dispatch({type: Types.POP_REFRESH, storeName: storeName})
    let dataStore = new DataStore()
    dataStore.fetchData(url).then((result) => { // 异步操作
      handleData(dispatch, storeName, result, pageSize)
    }).catch((err) => {
      console.log(err)
      dispatch({
        type: Types.POP_REFRESH_FAIL, 
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
export function onLoadMorePop(storeName,pageIndex,pageSize,dataArray=[],callBack){
  return dispatch => {
    setTimeout(() => { // 模拟请求
      console.log('add end')
      if((pageIndex-1)*pageSize>=dataArray.length){// 已加载完所有数据
        if(typeof callBack === 'function'){
          callBack('no more')
        }
        dispatch({
          type: Types.POP_LOAD_MORE_FAIL,
          error:'no more',
          storeName: storeName,
          pageIndex:--pageIndex,
          projectModes:dataArray
        })
      } else {
        console.log('add normal')
        // 本次和载入的最大数量
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize*pageIndex
        dispatch({
          type: Types.POP_LOAD_MORE_SUCCESS,
          storeName,
          pageIndex,
          projectModes: dataArray.slice(0,max)
        })
      }
    }, 500);
  }
}

function handleData(dispatch, storeName, data, pageSize){
  let fixItems = []
  if(data&&data.data&&data.data.items){
    fixItems = data.data.items
  }
  dispatch({
    type: Types.POP_REFRESH_SUCCESS,
    projectModes: pageSize>fixItems.length?fixItems:fixItems.slice(0,pageSize),// 第一次要加载的数据
    storeName,
    pageIndex:1,
    items: fixItems,
  })
}