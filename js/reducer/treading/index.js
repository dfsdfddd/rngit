import Types from '../../action/types';


/**
 * popular:{
 *    java:{
 *      items:[],
 *      storeName
 *      isLoading: false
 *    }
 * }
 * 如何动态的设置store和动态的获取store
 * @param {*} state 
 * @param {*} action 
 */
const defaultState = {}

export default function onAction(state = defaultState, action){
  switch (action.type) {
    case Types.TREADING_REFRESH_SUCCESS:// 下拉刷新成功
      return {
        ...state,
        [action.storeName]:{
          ...state[action.storeName],
          items:action.items,// 原始数据
          projectModes:action.projectModes, // 此次要显示的数据
          isLoading: false,
          hideLoadingMore: false,
          pageIndex:action.pageIndex
        }
      }
    case Types.TREADING_REFRESH: //下拉刷新
      return {
        ...state,
        [action.storeName]:{
          ...state[action.storeName],
          isLoading: true,
          hideLoadingMore: true,
        }
      }
    case Types.TREADING_REFRESH_FAIL://下拉刷新失败
      return {
        ...state,
        [action.storeName]:{
          ...state[action.storeName],
          isLoading: false
        }
      }
    case Types.TREADING_LOAD_MORE_SUCCESS://上拉加载成功
      return {
        ...state,
        [action.storeName]:{
          ...state[action.storeName],
          projectModes:action.projectModes,
          hideLoadingMore: false,
          pageIndex:action.pageIndex
        }
      }
    case Types.TREADING_LOAD_MORE_FAIL://上拉加载失败
      return {
        ...state,
        [action.storeName]:{
          ...state[action.storeName],
          hideLoadingMore: true,
          pageIndex:action.pageIndex
        }
      }
    default:
      return state;
  }
}