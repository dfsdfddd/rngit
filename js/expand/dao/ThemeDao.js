import {AsyncStorage,} from 'react-native';
import langs from '../../res/data/langs';
import keys from '../../res/data/keys';
import ThemeFactory, { ThemeFlags } from '../../res/styles/ThemeFactory';

const THEME_KEY = 'theme_key'

export const FLAG_LANGUAGE = {flag_language: 'language_dao_language', flag_key: 'language_dao_key'}
export default class ThemeDao {
    /**
     * 获取主题
     * @returns {Promise<any> | Promise}
     */
    getTheme() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(THEME_KEY, (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (!result) {
                    this.save(ThemeFlags.Default);
                    result=ThemeFlags.Default
                }
                resolve(ThemeFactory.createTheme(result));
            });
        });
    }

    /**
     * 保存主题的方法
     * @param objectData
     */
    save(themeFlag) {
        AsyncStorage.setItem(THEME_KEY, themeFlag, (error, result) => {
        });
    }
}
