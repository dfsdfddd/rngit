import Types from '../../action/types';


/**
 * favorite:{
 *    pop:{
 *      projectModes:[],
 *      isLoading: false
 *    },
 *    treading:{
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
    case Types.FAVORITE_LOAD_DATA:// 下拉刷新成功
      return {
        ...state,
        [action.storeName]:{
          ...state[action.storeName],
          isLoading: true,
        }
      }
    case Types.FAVORITE_LOAD_SUCCESS: //下拉刷新
      return {
        ...state,
        [action.storeName]:{
          ...state[action.storeName],
          projectModes:action.projectModes,
          isLoading: false,
        }
      }
    case Types.FAVORITE_LOAD_FAIL://下拉刷新失败
      return {
        ...state,
        [action.storeName]:{
          ...state[action.storeName],
          isLoading: false
        }
      }
    default:
      return state;
  }
}