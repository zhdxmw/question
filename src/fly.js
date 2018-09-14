import Fly from 'flyio/dist/npm/wx'
const $http = new Fly

//配置请求基地址
$http.config.baseURL='http://ligo-bukeapi.helone.net'

//添加请求拦截器
$http.interceptors.request.use((request)=>{
  //给所有请求添加自定义header
  // request.headers["X-Tag"]="flyio";
  request.headers = {
    'X-Tag': 'flyio',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
  //终止请求
  //var err=new Error("xxx")
  //err.request=request
  //return Promise.reject(new Error(""))

  //可以显式返回request, 也可以不返回，没有返回值时拦截器中默认返回request
  return request;
})

//添加响应拦截器，响应拦截器会在then/catch处理之前执行
$http.interceptors.response.use(
  (response) => {
    //只将请求结果的data字段返回
    return response.data
  },
  (err) => {
    //发生网络错误后会走到这里
    //return Promise.resolve("ssss")
    console.log(err)
  }
)

export default $http
