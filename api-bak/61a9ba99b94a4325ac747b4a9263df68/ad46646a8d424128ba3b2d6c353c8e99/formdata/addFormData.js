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
var lib = require("./lib");
var coll = lib.open("datas");
var uuid = require('uuid');

// 从wx登录用户session里获取信息
var session = lib.getSession(sys.request, cache);
// if(!session){
//   sys.ret(1,"获取不到用户信息");
//   return;
// }
// if(!session.personid){
//   sys.ret(1,"获取不到用户ID，请重新登录");
//   return;
// }

// 参数
var data = {
  // pid: session.personid, //提交者ID
  type: sys.request.getString("type"), //表单类型
  data: {},  //表单数据
};

data._id = uuid.v1();
var da = {};
sys.request.forEach(function(k, v) {
  v = sys.requestParameterMap[k];
  var ks = "";
  if (Array.isArray(v) && v.length <= 1) {
    v = v[0];
    ks = k;
  }else{
    ks = k.replace('[]','');
  }
  da[ks] = v;
});
delete da.openid;
delete da.s;
delete da.ems;
delete da.type;
delete da.tk;
data.data = da;
sys.put("data==", data);

// 保存数据
// addForm(data);

sys.setRetData(0);

//保存数据
function addForm(data){
  coll.insertOne({
    _id: data._id,
    type: data.type,  //租户名称
    pid: data.pid,  //提交者ID
    data: data.data,  //数据
    dt: new Date()  //表单提交时间
  });
  
}