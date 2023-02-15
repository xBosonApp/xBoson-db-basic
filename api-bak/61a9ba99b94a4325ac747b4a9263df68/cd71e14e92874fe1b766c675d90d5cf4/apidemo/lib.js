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

module.exports = {
  toKen : toKen,
  zgUri : zgUri,
  zgHost : "http://120.194.140.172:8088"
};
function zgUri() {
  return "http://120.194.140.172:8088/api/v1/";
}
//获取智光 toKen
function toKen(cache,http) {
  //从缓存中获取智光 toKen 有效时间戳
  var data = cache.get("ZHIGUANG_LOGIN", "data");
  //var token = cache.get("ZHIGUANG_LOGIN", "token");
  if (data !== null) {
    //info = JSON.parse(info);
    var nat = parseInt(data.expireAt);
    var ndt = Date.parse(new Date());//date.currentTimeMillis()
    var nn = nat-ndt;
    if (800000<nn) {
      return data.token;
    }
  }
  var url = zgUri() + "auth/login";
  var parm = {"username":"tokentest","password":"123456"};
  var h = {"Content-Type":"application/json"};
  var ret = http.post(url,parm,null,"json",h);
  var token = ret.data.data.token;
  cache.set("ZHIGUANG_LOGIN", "data", ret.data.data);
  //cache.set("ZHIGUANG_LOGIN", "token", token);
  //cache.set("ZHIGUANG_LOGIN", "expireAt", ret.data.data.expireAt);
  return token;
}