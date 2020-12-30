import axios from 'axios'
import qs from 'qs'

axios.defaults.timeout = 5000;                        //响应时间      
axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8';   //配置请求头
axios.defaults.headers['X-Session-Id'] = localStorage.getItem('sessionId')

if (process.env.NODE_ENV == 'development') {
    //开发环境下的代理地址，解决本地跨域跨域，配置在config目录下的index.js dev.proxyTable中
    //项目域名地址
    axios.defaults.baseURL='https://ng.mangocloud.com.cn';
  } else if (process.env.NODE_ENV == 'production') {
    //生产环境下的地址
    axios.defaults.baseURL="https://ng.mangocloud.com.cn"
  }
  
//POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
    //在发送请求之前做某件事
    // if(config.method  === 'post'){
        console.log(config)
        config.data = JSON.stringify(config.data);
    // }
    return config;
},(error) =>{
    console.log('错误的传参')
    return Promise.reject(error);
});

//返回状态判断(添加响应拦截器)
axios.interceptors.response.use((res) =>{
    //对响应数据做些事
    if(!res.data.success){
        return Promise.resolve(res);
    }
    return res;
}, (error) => {
    console.log('网络异常')
    return Promise.reject(error);
});

//返回一个Promise(发送post请求)
export function fetchPost(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, params)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err);
            })
            .catch((error) => {
                reject(error)
            })
    })
}
export function fetchPut(url, params) {
    return new Promise((resolve, reject) => {
        axios.put(url, params)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err);
            })
            .catch((error) => {
                reject(error)
            })
    })
}
////返回一个Promise(发送get请求)
export function fetchGet(url, param) {
    return new Promise((resolve, reject) => {
        axios.get(url, {params: param})
            .then(response => {
                resolve(response.data)
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
export function fetchDelete(url, param) {
    return new Promise((resolve, reject) => {
        axios.delete(url, {params: param})
            .then(response => {
                resolve(response)
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
export default {
    fetchPost,
    fetchGet,
    fetchPut,
    fetchDelete,
}