/*
*  统一封装axios
* @Author: songstar
* @Date:   2017-06-30 22:53:48
* @Last Modified by:   Administrator
* @Last Modified time: 2017-07-02 11:26:04
*/

// 导入模块
// import axios from 'axios'
import router from '@/router';
import util from '@/libs/util';
import md5 from 'js-md5';

export default function fetch (options) {
  return new Promise((resolve, reject) => {
    // 创建一个axios实例
    const instance = util.ajax;
    if (!options['params'] && !options['data']) {
      options['params'] = {};
    }
    let now = Date.parse( new Date() ).toString().substr(0, 10);
    let token = '';
    let params = options['params'] ? options['params'] : options['data'];
    for (let key in params) {
      token += md5(params[key]);
    }
    token = md5(`api_${token}_api`);
    if (options['data']) {
      options['data']['time'] = now;
      options['data']['token'] = token;
    } else {
      options['params']['time'] = now;
      options['params']['token'] = token;
    }
   
    // console.log(options);
    // 请求处理
    instance(options)
      .then((response) => {
        // 请求成功时,根据业务判断状态
        if (response.status === 200) {
          resolve(response.data)
          return false
        } else {
          router.replace({name: 'login'})
        }
        this.$Message.warning('失败')
        reject(response)
      })
      .catch((error) => {
        // 请求失败时,根据业务判断状态
        if (error.response) {
          let resError = error.response
          let resCode = resError.status
          let resMsg = error.message
          this.$Message.error('操作失败！错误原因 ' + resMsg)
          reject({code: resCode, msg: resMsg})
        }
      })
  })
}
