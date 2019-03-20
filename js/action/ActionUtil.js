import ProjectModel from "../model/ProjectModel";
import Utils from "../util/Utils";


export function handleData(actionType,dispatch, storeName, data, pageSize, favoriteDao){
  let fixItems = []
  if(data&&data.data){
    if(Array.isArray(data.data)){
      fixItems = data.data;
    } else if(Array.isArray(data.data.items)){
      fixItems = data.data.items
    }
  }
  // 第一次要加载的数据
  let showItems = pageSize>fixItems.length?fixItems:fixItems.slice(0,pageSize)
  _projectModels(showItems,favoriteDao,projectModels=>{
    dispatch({
      type: actionType,
      projectModes: projectModels,
      storeName,
      pageIndex:1,
      items: fixItems,
    })
  })
  
}

/**
 * 返回一个[items,isFavorite]
 * items--> list
 * isFavorite--> true or false
 */
export async function _projectModels(showItems,favoriteDao,callback){
  let keys = []
  try {
    keys = await favoriteDao.getFavoriteKeys()
  } catch (error) {
    console.log(error)
  }
  console.log(keys)
  let projectModels = []
  for(let i = 0, len = showItems.length; i<len;i++){
    //Utils.checkFavorite 检查item.id=key 是否在于keys 都列表里，存在就表示收藏了
    projectModels.push(new ProjectModel(showItems[i], Utils.checkFavorite(showItems[i], keys)));
  }
  console.log(projectModels)
  if(typeof callback === 'function'){
    callback(projectModels)
  }
}
