/**
 *  Copyright 2023 Jing Yanming
 * 
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
"use strict";

// var schedule = require("schedule");
var lib = require('./lib');
// var orgid = sys.request.orgid;
// var userid = sys.getUserIdByOpenId();



// 在页面创建计划任务（每1小时调用一次此接口）

var token = getToken();
setCache(token);

sys.put('access_token',getCache());
sys.setRetData(0);


function getCache(){
  var config = lib.getConfig();
  var REGION = config.cache_region;
  var key = config.cache_key_access_token;
  return cache.get(REGION, key);
}

// 将token存到缓存
function setCache(token){
  var config = lib.getConfig();
  var REGION = config.cache_region;
  var key = config.cache_key_access_token;
  cache.set(REGION, key, token);
}

// 获取微信服务端访问token
function getToken(){
  // https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
  var config = lib.getConfig();
  var wxRet = http.get("https://api.weixin.qq.com/cgi-bin/token", {
    appid: config.appid, //"wxf3a4d838441c7e0e", //APPID
    secret: config.appsecret, //"0f44a68f9d2ee232d9c37e844fd2b7c3", //SECRET
    grant_type: "client_credential"
  },"json");
  
  // sys.printValue(wxRet);
  // {"access_token":"ACCESS_TOKEN","expires_in":7200}

  var token = wxRet.data.access_token;
  if(!token){
    throw new Error('no access token: '+wxRet.data.errmsg); 
  }
  
  return token;
}