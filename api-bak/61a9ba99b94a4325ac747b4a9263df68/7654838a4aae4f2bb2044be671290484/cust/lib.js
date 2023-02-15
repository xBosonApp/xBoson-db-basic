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
var mongodb = require('mongodb');
var uuid = require("uuid");
var pconf = cfg.get("xboson-saas");

// db().collection("person").createIndex({"wx":1},{unique: true, sparse:true});

// db().collection("person").createIndex({"tel":1},{unique: true, partialFilterExpression: {tel:{$type:"string"}} });

module.exports = {
  db        : db,
  open      : open,
  genid     : genid,
  getSession   : getSession,
  getSessionByToken: getSessionByToken,
  open_operate: open_operate
};

// 根据请求token获取 wx openid
function get_wxopenid(req){
  var REGION = pconf.cache_region;
  var token = req.getHeader('token');
  var info = cache.get(REGION,token);
  if(info){
    return info.openid;
  }
}

function getSessionByToken(token,cache){
  // 缓存区名称
  var REGION = pconf.cache_region;
  
  if(!token) return null;
  
  return cache.get(REGION, token);
}

function getSession(req,cache){
  
  var token = req.getHeader('token');
  
  if(!token) return null;
  
  return getSessionByToken(token,cache);
  
}

// 打开租户相关表
function open_operate(tableName){
  // 连接数据库
  var mcli = mongodb.connect(pconf.mongodb);
  var db = mcli.db(pconf.dbname_operate);
  // 打开collection
  return db.collection(tableName);
}

// 根ID（UUID）
function genid() {
  var b = uuid.getBytes(uuid.v1obj());
  return b.toString('base58');
}

// 返回数据表对象
function open(tableName) {
  return db().collection(tableName);
}
// 连接数据库
function db() {
  var mcli = mongodb.connect(pconf.mongodb);
  return mcli.db(pconf.dbname_crm);
}


// 模块：person：人员关系管理
// API接口定义
// personAdd：添加人员信息，微信授权（获取微信ID、昵称头像）
// personEdit：修改人员信息
// personDel：删除人员信息
// personGet：获取人员信息（带搜索条件：返回列表/单个详细信息）
// ------------------------------------------------------------
// gitQRCode：获取创建二维码所需的信息，数据：person._id, person.tag
// ------------------------------------------------------------
// groupAdd：添加人员关系信息，小程序扫码建立关联，参数：person._id, person.tag
// groupEdit：修改人员关系信息
// groupDel：删除人员关系信息
// groupGet：获取人员关系信息（带搜索条件：返回列表/单个详细信息）
// ------------------------------------------------------------
// 用户关系构建流程：扫码启动微信小程序（医生端、患者端）
// 1、患者端，选择【我的】出示【我的二维码】（如果未绑定手机号，需要弹出输入手机号，发送短信认证或微信手机号一键绑定），注：这个流程可选
// 2、医生端，出示身份二维码，患者端扫码与医生绑定关系，医生端接到申请选择关系属性后确认，数据记录在人员关系表的group中与医生关联，同时将该患者添加至relation租户客户表的 group 中。
// 3、医生和患者端能通过【朋友】查看添加的人员列表和删除人员；
// 4、患者端启动小程序默认绑定微信账号，获取微信ID、头像、昵称，将信息添加到人员关系表中
// 5、需要考虑：租户管理员，获取全部客户
// 数据应用场景，在日历里面添加新任务（如：约人），选择相关人员（group内人员可选择）推送预约任务给对方
// ------------------------------------------------------------
// Mongo 数据库名称（客户关系管理）
// dbname="xboson-saas-crm"
// --------------------------
// // 人员关系表：
// "person": [
// 	{
// 	  "_id": {
// 			"tel": "", // 电话号码，未绑定用户可为空
// 			"wx": "",	// 微信ID，启动小程序获取
// 		},
// 		"wxnm": "",	// 微信昵称
// 		"tag": ["客户","同事",""],	// 标签（默认），用户自定义属性，如：患者、亲属、同事、领导等
// 	  "group": [{	// 关系组，支持一对多，按标签分组，如：医生与患者之间的逻辑关系
// 				"tag": "",	// 标签，按标签分组，数据来自人员表的 "tag": 标签
// 				"tel": "",	// 联系电话
// 				"wx": "",	// 微信ID
// 				"wxnm": "",	// 微信昵称
// 				"mark": "", // 备注
// 			},],
// 		"name": "",	// 姓名
// 		"sex": "",	// 性别
// 		"bdate": "",	// 出生日期
// 		"add": "",	// 现住址
// 	  "gps": {"long": 121.70404187842306, "lat": 31.18618555293118},	// Long：经度，lat：纬度，可地图点选记录GPS数据
// 		"status":  "1", // 状态：SYSX0001='0':无效；'1':有效，默认值：'1'
// 		"createdt":  new Date(), // 创建时间
// 		"updatedt":  new Date(), // 更新时间
// 	},
// ]

// ------------------------------------------------------------
// relationAdd：添加人员关系信息（租户客户列表）
// relationEdit：修改人员关系信息（租户客户列表）
// relationDel：删除人员关系信息（租户客户列表）
// relationGet：获取人员关系信息（带搜索条件：返回列表/单个详细信息）
// ------------------------------------------------------------
// // 租户客户表（租户的客户）
// "relation": [
// 	{
// 	  "_id": "",	// 租户ID
// 		"tag": ["客户","同事",""],	// 标签（默认），用户自定义属性，如：患者、亲属、同事、领导等
// 	  "group": [{		// 客户列表
// 				"tag": "",	// 标签，按标签分组，数据来自人员表的 "tag": 标签
// 				"tel": "",	// 联系电话
// 				"wx": "",	// 微信ID
// 				"mark": "", // 备注
// 			},],
// 	},
// ]