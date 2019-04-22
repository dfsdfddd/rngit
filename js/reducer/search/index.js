import Types from '../../action/types';


/**
 * popular:{
 *    java:{
 *      items:[],
 *      storeName
 *      isLoading: false
 *    }
 *    ios:{
 *      items:[],
 *      storeName
 *      isLoading: false
 *    }
 * }
 * 如何动态的设置store和动态的获取store
 * @param {*} state 
 * @param {*} action 
 */
const defaultState = {
  showText:'搜索',
  items:[],
  isLoading:false,
  projectModes:[],
  hideLoadingMore:true,
  showBottomButton:false
}

export default function onAction(state = defaultState, action){
  switch (action.type) {
    case Types.SEARCH_REFRESH:// 下拉刷新成功
      return {
        ...state,
        isLoading: true,
        hideLoadingMore: true,
        showBottomButton:false,
        showText:"取消",

      }
    case Types.SEARCH_REFRESH_SUCCESS: //下拉刷新
      return {
        ...state,
        isLoading: false,
        hideLoadingMore: false,
        showBottomButton:action.showBottomButton,
        items:action.items,
        projectModes:action.projectModes,
        pageIndex:action.pageIndex,
        showText:"搜索",
        inputKey:action.inputKey

      }
    case Types.SEARCH_FAIL://下拉刷新失败
      return {
        ...state,
        isLoading: false,
        showText:"搜索"
      }
    case Types.SEARCH_CANCEL://下拉刷新失败
      return {
        ...state,
        isLoading: false,
        showText:"搜索"
      }
    case Types.SEARCH_LOAD_MORE_SUCCESS://上拉加载成功
      return {
        ...state,
          projectModes:action.projectModes,
          hideLoadingMore: false,
          pageIndex:action.pageIndex
      }
    case Types.SEARCH_LOAD_MORE_FAIL://上拉加载失败
      return {
        ...state,
        hideLoadingMore: true,
        pageIndex:action.pageIndex
      }
    case Types.FLUSH_POP_FAVORITE:// 刷新收藏状态
      return {
        ...state,
        [action.storeName]:{
          ...state[action.storeName],
          projectModes:action.projectModes,
        }
      }
    default:
      return state;
  }
}