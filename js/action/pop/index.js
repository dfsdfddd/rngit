import Types from "../types";
import DataStore from '../../expand/dao/DataStore';

/**
 * 
 * @param storeName 获取某个tab的信息
 */
export function onLoadPopData(storeName,url) {
  return dispatch => {
    dispatch({type: Types.POP_REFRESH, storeName: storeName})
    let dataStore = new DataStore()
    dataStore.fetchData(url).then((result) => { // 异步操作
      handleData(dispatch, storeName, result)
    }).catch((err) => {
      console.log(err)
      dispatch({
        type: Types.LOAD_POP_FAIL, 
        storeName,
        error: err
      })
    });
  }
}

function handleData(dispatch, storeName, data){
  dispatch({
    type: Types.LOAD_POP_SUCCESS,
    items: data&&data.data&&data.data.items,
    storeName
  })
}