/**
 * 全局导航工具类
 * 
 * 注意注意 有两种方式获得不通路由的 navigation
 * 
 * 其中homepage 第一种嵌套路由的方式要获取navigation 直接获取 第一种
 * 第二种 = 第二种
 */
export default class NavigationUtil {
  /**
   * 跳转到指定页面
   * @param {*} params 要传递的参数
   * @param {*} page 要跳转的页面
   */
  static goPage(params,page){
    /**
     * 第一种获取navigation
     */
    // const {navigation} = params
    /**
     * 第二种获取navigation
     */
    const navigation = NavigationUtil.navigation
    if(!navigation){
      console.log('navigation is can not null')
      return
    }
    navigation.navigate(page,{...params})
  }
  /**
   * 后退页面
   * @param {*} navigation 
   */
  static goToBack(navigation){
    navigation.goBack()
  }
  /**
   * 去到homePage页面
   * @param {*} params 
   */
  static resetToHomePage(params){
    const {navigation} = params;
    navigation.navigate('Main')
  }
};
