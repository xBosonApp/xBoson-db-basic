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

var cfg = require("config");
var uuid = require("uuid");

var crypto = require('crypto');

module.exports = {
  getConfig: get_config,
  setSession: setSession,
  getSession: getSession,
  decryptWxData: decryptWxData,
  updateSession: updateSession
};



// 设置微信登录session
// param : data {openid:"",session_key:"",unionid:"", personid:'', platform: ''}
function setSession(data,cache){
  
  var config = get_config();
  
  var token = uuid.v4();
  
  // 缓存区名称
  var REGION = config.cache_region;
  
  // // 删除旧token
  // if(data.old_token){
  //   cache.del(REGION,data.old_token);
  // }
  // 
  // 获取用户id下的 personid:platform:token 映射
  var mapping = cache.get(REGION, data.personid) || {};
  // 
  var old_token = mapping[data.platform];
  //删除旧token
  if(old_token){
    cache.del(REGION,old_token);
  }
  
  // 设置personid:platform:token
  mapping[data.platform] = token;
  cache.set(REGION, data.personid, mapping);
  
  // 设置新token
  cache.set(REGION, token, {
    platform: data.platform,
    openid: data.openid,
    session_key: data.session_key,
    unionid: data.unionid,
    personid: data.personid
  });
  
  
  
  // 返回token
  
  return token;
  
}

// 根据token返回session信息 {openid,session_key,unionid}
function getSession(token,cache){
  
  var config = get_config();
  
  // 缓存区名称
  var REGION = config.cache_region;
  
  return cache.get(REGION, token);
}

// 更新session
function updateSession(data,token,cache){
  
  var config = get_config();
  
  // 缓存区名称
  var REGION = config.cache_region;
  
  // 设置新token
  cache.set(REGION, token, data);
}

// 解密wx小程序数据
function decryptWxData (sessionKey,encryptedData,iv){

  // base64 decode
  // sessionKey = new Buffer(sessionKey, 'base64')
  // encryptedData = new Buffer(encryptedData, 'base64')
  // iv = new Buffer(iv, 'base64')
  sessionKey = crypto.toBytes(sessionKey, 'base64')
  encryptedData = crypto.toBytes(encryptedData, 'base64')
  iv = crypto.toBytes(iv, 'base64')
  
   // 解密
  // var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
  // // 设置自动 padding 为 true，删除填充补位
  // decipher.setAutoPadding(true)
  // var decoded = decipher.update(encryptedData, 'binary', 'utf8')
  // decoded += decipher.final('utf8')
  
  // decoded = JSON.parse(decoded)
    
  // 解密
  // ps 和 iv 参数必须和加密时提供的参数一致.
  var cd = crypto.createDecipher("AES/CBC/NoPadding", sessionKey, iv);
  var xbuf = [];
  xbuf.push(cd.update(encryptedData));
  xbuf.push(cd.end());
  // ddata 是解密后的字节缓冲区
  var ddata = crypto.joinBytes(xbuf);
  
  ddata = ddata.toJavaString();
  ddata = ddata.replace(/^[\u000e\u0007\n]+|[\u000e\u0007\n]+$/g, '');
  ddata = JSON.parse(ddata);

  // if (ddata.watermark.appid !== appId) {
  //   throw new Error('Illegal Buffer')
  // }
  
  return ddata;
}


// 获取智能配置
function get_config() {
  var conf_name = "xboson-saas";
  var conf = cfg.get(conf_name);
  return conf;
}