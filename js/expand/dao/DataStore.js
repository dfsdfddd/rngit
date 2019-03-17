import { AsyncStorage } from "react-native";
import Trending from 'GitHubTrending';

export  const FLAG_STORAGE = {
  flag_popular: 'popular',
  flag_trending: 'trending'
}
export default class DataStore {
  // 保存数据
  saveData(url, data, callback){
    if(!data || !url) return
    AsyncStorage.setItem(url,JSON.stringify(this._wrapData(data),callback))
  }
  _wrapData(data){
    return {data: data,timestamp: new Date().getTime()}
  }
  // 获取本地数据
  fetchLocalData(url){
    return new Promise((resolve, reject)=>{
      AsyncStorage.getItem(url,(error,result)=>{
        if(!error){
          console.log('inlocal');
          try {
            console.log('inlocal resolve');
            resolve(JSON.parse(result))
          } catch (e) {
            reject(e)
            console.error(e);
          }
        } else {
          reject(error)
          console.error(error);
          
        }
      })
    })
  }
  // 获取网络数据
  fetchNetData(url,flag){
    return new Promise((resolve,reject)=>{
      if(flag !== FLAG_STORAGE.flag_trending){
          fetch(url).then((response) => {
            if(response.ok){
              return response.json()
            }
            throw new Errow('network is not ok')
          }).then((responseData)=>{
            console.log(responseData);
            this.saveData(url,responseData)
            resolve(responseData)
          }).catch((err) => {
            reject(err)
          });
      } else {
          new Trending().fetchTrending(url).then((items) => {
            console.log(items);
            if(!items){
              throw new Error('response is not ok')
            }
            this.saveData(url,items)
            resolve(items)
          }).catch((err) => {
            reject(err)
          });
        
      }
    })
  }
  // 实现缓存策略的入口方法
  fetchData(url,flag){
    return new Promise((resolve, reject)=>{
      this.fetchLocalData(url).then((wrapData) => {
        console.log('inlocal');
        if(wrapData&&this.checkTimestampValid(wrapData.timestamp)){
          console.log('local has data');
          resolve(wrapData)
        } else {
          console.log('local has no data. go fetch');
          this.fetchNetData(url,flag).then((data) => {
            resolve(this._wrapData(data))
          }).catch((err) => {
            reject(err)
          });
        }
      }).catch((err) => {
        console.log('in err fetch');
        this.fetchNetData(url,flag).then((data) => {
          resolve(this._wrapData(data))
        }).catch((err) => {
          reject(err)
        });
      });
    })
  }
  // 检查事件的有效期
  checkTimestampValid(timestamp){
    const currentTime = new Date();
    const targetTime = new Date();
    targetTime.setTime(timestamp)
    if(currentTime.getMonth() !== targetTime.getMonth()) return false
    if(currentTime.getDate() !== targetTime.getDate()) return false
    if(currentTime.getHours() !== targetTime.getHours()) return false
    return true
  }
}