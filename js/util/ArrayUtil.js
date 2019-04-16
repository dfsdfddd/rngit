export default class ArrayUtil {
  static isEqual(arr1, arr2){
    if(!(arr1&&arr2)) return false
    if(arr1.length !== arr2.length) return false
    for (let i = 0,l=arr1.length; i < l; i++) {
      if(arr1[i] !== arr2[i]) return false
    }
    return true
  }
}
