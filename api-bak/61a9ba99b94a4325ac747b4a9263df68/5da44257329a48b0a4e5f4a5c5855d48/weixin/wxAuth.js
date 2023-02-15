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

var lib = require('./lib');

var config = lib.getConfig();

var data = {
  // 调微信认证用 wx.login()获取 code
  code: (sys.request.getString("code"))?sys.request.getString("code"):"",
  
  // old_token: sys.request.getHeader("token"), //当前用户上一次调用此接口返回的token
  
  platform: sys.request.platform || 'android' // windows, android, ...
};
var ms = Date.now();
// 调微信认证API 参数【appid+appsecret+code】，返回【session_key+openid】
var wxRet = http.get("https://api.weixin.qq.com/sns/jscode2session", {
  appid: config.appid, //"wxf3a4d838441c7e0e", //APPID
  secret: config.appsecret, //"0f44a68f9d2ee232d9c37e844fd2b7c3", //SECRET
  js_code: data.code,
  grant_type: "authorization_code"
},"json");

sys.printValue(Date.now()-ms);

// openid 	string 	用户唯一标识
// session_key 	string 	会话密钥
// unionid 	string 	用户在开放平台的唯一标识符，若当前小程序已绑定到微信开放平台帐号下会返回，详见 UnionID 机制说明。
// errcode 	number 	错误码
// errmsg 	string 	


if(!wxRet.data.errmsg){
  
  // 获取用户信息
  var personid,registered=false,org;  //用户id，是否已注册（手机号是否已绑定）
  
  var r = getPerson(wxRet.data.openid);
  if(r.data){
    personid = r.data._id;
    registered = r.data.tel != null;
    // 返回所属机构信息
    org = getTenantByPersonid(personid);
  }else if(r.error){
    sys.setRetData(2,r.error);
    return;
  }else{
    // 添加新用户
    var r_addPerson = addPerson(wxRet.data.openid);  
    if(r_addPerson.error){
      sys.setRetData(2,r_addPerson.error);
      return;
    }
    personid = r_addPerson.data;
  }
  
  
  // 设置session
  var token = lib.setSession({
    // old_token: data.old_token,  //旧token
    platform: data.platform, // 系统平台，android,windows,ios...
    openid: wxRet.data.openid,  // wx openid
    session_key: wxRet.data.session_key,  // wx登录的sessionKey
    unionid: wxRet.data.unionid, // wx unionid
    personid: personid
  },cache);
  
  
  var res = {
    token: token, //返回平台 token
    registered: registered, // 手机号是否已绑定
    person : r.data ? r.data : {_id: personid}, //个人信息
    org: org ? { 
      name: org.name, nickname:org.nickname, 
      post:org.member[0].post 
      
    } : null 
  }
  
  sys.put("result", res);
  sys.setRetData(0);

}else{
  sys.setRetData(2,wxRet.data.errmsg);
  return;
}



// var res = {
//   token: "@session_key@", //返回平台 token（session_key）
//   openid: "aaaa@openid@bbb",  // 微信个人（openid）
// }

// 前端请求【业务API】：header 参数
// var default_header = {
//   'Content-Type': 'application/json', //默认是json格式
//   'openid': wx.getStorageSync('openId'), //个人微信 ID
//   'appid': app.g.appid, //微信 AppID(可选)
//   'token': wx.getStorageSync('token'), //xBoson服务器认证 token
// };

// 根据wxid获取用户信息(调接口)
function getPerson(wxid){
  // /7654838a4aae4f2bb2044be671290484/cust/personGet?wx=Empty&keyword=Empty&openid=lining&s=d&ems=ems
  var ret = http.platformGet(
    {app:"7654838a4aae4f2bb2044be671290484",mod:"cust",api:"personGet"},
    {wx: wxid});
  // 被调用的 API 返回的数据，JSON 结构	
  var retData = ret["data"];
  // sys.printValue(retData);
  // 被调用的 API 返回的 "xxx" 的值
  if(retData.code == 0){
    if(retData.result && retData.result.length>0){
      // 获取到用户信息
      return { data: retData.result[0] };
    }else{
      // 没有此用户信息
      return {};
    }
  }else{
    // 接口返回错误
    return {error: retData["msg"]};
  }
}

function addPerson(wxid){
  
  // /7654838a4aae4f2bb2044be671290484/cust/personAdd?wxnm=Empty&wx=Empty&tel=Empty&openid=lining&s=d&ems=ems
  var ret = http.platformGet(
    {app:"7654838a4aae4f2bb2044be671290484",mod:"cust",api:"personAdd"},
    {wx: wxid});
  // 被调用的 API 返回的数据，JSON 结构	
  var retData = ret["data"];
  // 被调用的 API 返回的 "xxx" 的值
  if(retData["code"] == 0){
    return { data: retData.personid };
  }else{
    return { error: retData.msg };
  }
}

// 根据personid获取租户信息
function getTenantByPersonid(personid){
  // /78cf8922c5ea4afa9dae8970215ea796/tenant/orgGet
  var ret = http.platformGet(
    {app:"78cf8922c5ea4afa9dae8970215ea796",mod:"tenant",api:"orgGet"},
    {personid: personid});
  // 被调用的 API 返回的数据，JSON 结构	
  var data = ret.data;
  if(data.result && data.result[0]){
    return data.result[0];
  }else{
    // sys.printValue(personid+":不是租户成员");
  }
}