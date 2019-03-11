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
const defaultState = {}

export default function onAction(state = defaultState, action){
  switch (action.type) {
    case Types.LOAD_POP_SUCCESS:
      return {
        ...state,
        [action.storeName]:{
          ...state[action.storeName],
          items:action.items,
          isLoading: false
        }
      }
    case Types.POP_REFRESH:
      return {
        ...state,
        [action.storeName]:{
          ...state[action.storeName],
          isLoading: true
        }
      }
    case Types.LOAD_POP_FAIL:
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