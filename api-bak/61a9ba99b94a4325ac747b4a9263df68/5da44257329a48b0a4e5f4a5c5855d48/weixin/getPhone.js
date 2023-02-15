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

var token = sys.request.getHeader("token");

if(!token){
  sys.ret(1,"header中缺少token！");
  return;
}
// sys.printValue(token);

var r = sys.requestJson || {};

var encryptedData = r.encryptedData || sys.request.encryptedData;
var iv = r.iv || sys.request.iv;

if(!encryptedData || !iv){
  sys.ret(1,"缺少encryptedData或iv");
  return;
}



// 获取用户session
var session = lib.getSession(token,cache);

if(!session || !session.session_key){
  sys.ret(1,"获取不到用户session【"+token+"】");
  return;
}

// 解密微信getPhoneNumber返回的数据
var data = lib.decryptWxData(session.session_key, encryptedData, iv);

// phoneNumber 	String 	用户绑定的手机号（国外手机号会有区号）
// purePhoneNumber 	String 	没有区号的手机号
// countryCode 	String 	区号

// 查询是否有用户绑定了此手机号
var personid = getPersonIdByTel(data.phoneNumber);

if(!personid){
  // 绑定手机号
  editPerson({ _id:session.personid, tel: data.phoneNumber });
}else{
  if(personid == session.personid){
    // 
  }else{
    // 合并用户
    deletePersonById(session.personid);
    // 添加wx openid
    editPerson({_id: personid, wx: session.openid});
    // 更新session
    session.personid = personid;
    lib.updateSession(session, token, cache);
  }
}


sys.put("result", data);

sys.setRetData(0);

// 根据wxid获取用户信息(调接口)
function editPerson(param){
  // /7654838a4aae4f2bb2044be671290484/cust/personGet?wx=Empty&keyword=Empty&openid=lining&s=d&ems=ems
  var ret = http.platformPost(
    {app:"7654838a4aae4f2bb2044be671290484",mod:"cust",api:"personEdit"},param);
  // 被调用的 API 返回的数据，JSON 结构	
  var retData = ret["data"];
  // sys.printValue(retData);
  // 被调用的 API 返回的 "xxx" 的值
  if(retData.code == 0){
    if(retData.result){
      // 获取到用户信息
      return { data: retData.result };
    }
  }else{
    // 接口返回错误
    return {error: retData["msg"]};
  }
}

// 根据手机号查询用户
function getPersonIdByTel(tel){
  
  if(!tel){
    return false;
  }
  
  var ret = http.platformGet(
    {app:"7654838a4aae4f2bb2044be671290484",mod:"cust",api:"personGet"},
    {tel: tel});
  
  var retData = ret.data;
  if(retData.result && retData.result[0]){
    return retData.result[0]._id;
  }else{
    return false;
  }
  
}

// 根据personid删除用户
function deletePersonById(personid){
  if(!personid){
    return;
  }
  var ret = http.platformGet(
    {app:"7654838a4aae4f2bb2044be671290484",mod:"cust",api:"personDel"},
    {_id: personid});
    
}