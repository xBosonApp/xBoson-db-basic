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

var coll = lib.open("tenant-org");

var relationColl = lib.open_crm("relation");  // 租户客户表

var uuid = require('uuid');
	

// 参数
var data = {
  name: sys.request.getString("name"),//租户名称
  nickname: sys.request.nickname,// 租户昵称
  add: sys.request.add,// 地址
  // pid: sys.request.userid && sys.getUserPID(sys.request.userid),// 租户管理员ID（平台pid）
  pid: sys.request.pid,
  gps: { //{"经度": 121.70404187842306, "纬度": 31.18618555293118},
    long: sys.request["gps-lng"],
    lat: sys.request["gps-lat"]
  },
  status: sys.request.status,// 状态
  mark: sys.request.mark// 说明 
};

data._id = uuid.v1();

// 租户表
addTenantOrg(data);

// 租户客户表
addTenantRelation(data);

sys.put("data", {_id: data._id});
sys.setRetData(0);


function addTenantOrg(data){
  
  coll.insertOne({
    _id: data._id,
    name: data.name,  //租户名称
    nickname: data.nickname,// 租户昵称
    add: data.add,// 地址
    pid: data.pid,// 地址
    gps: data.gps, //{"经度": 121.70404187842306, "纬度": 31.18618555293118},
    status: data.status || "1",// 状态
    mark: data.mark,// 说明
    createdt: new Date(),
    updatedt: new Date(),
    member: [] // 租户成员
  });
  
}

// 租户客户表加一条数据
function addTenantRelation(data){
  relationColl.insertOne({
    _id: data._id,
    tag: [],
    group: []
  });
}