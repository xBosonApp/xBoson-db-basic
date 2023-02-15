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
模块：tenant：租户管理
API接口定义
orgAdd：添加租户信息
orgEdit：修改租户信息
orgDel：删除租户信息
orgGet：获取租户信息（带搜索条件：返回列表/单个详细信息）

添加租户：管理员时分2步骤，1、平台管理注册管理员账号&密码，并授权租户管理员角色；2、添加租户画面选择平台注册的人员
------------------------------------------------------------
租户成员注册流程：
1、平台提供给租户管理员账号，管理员登入后添加成员；
2、必须输入成员有效手机号（用于微信小程序绑定微信账号），输入 {手机号} 短信认证，绑定微信账号
3、租户成员微信绑定账号并认证后，即可正常使用医生端微信小程序；

画面：
租户管理画面：当前登录账户人员为租户的管理员，画面直接加载成员管理画面（view.html），进行成员维护
添加成员信息需要将信息添加在【person】表中，添加后取得 person._id 在添加 tenant-org.member 成员信息
------------------------------------------------------------
memberAdd：添加租户成员信息
memberEdit：修改租户成员信息
memberDel：删除租户成员信息
memberGet：获取租户成员信息（带搜索条件：返回列表/单个详细信息）

--------------------------
Mongo 数据库名称（运营管理）
dbname="xboson-saas-operate"
--------------------------
var lib = require('./lib'); // 参考主数据.数据字典.lib

// 租户管理【一期】
"tenant-org": [
  {
	  "_id": lib.genid(),	// 租户ID
	  "name": "",	// 租户名称
	  "nickname": "",	// 租户昵称，可用于二级域名
	 	"pid":	 "",	// 管理员ID（平台pid）
	  "member": [ {
			"personid": "",	// person._id
	  	"post": "",	// 职称（字典）
	  	"mark": "",	// 备注
	  },],
	  "add":"",	// 地址
	  "gps": {"long": 121.70404187842306, "lat": 31.18618555293118},	// Long：经度，lat：纬度
	  "status":  "1", // 状态：SYSX0001='0':无效；'1':有效，默认值：'1'
		"mark": "", // 说明
		"createdt":  new Date(), // 创建时间
		"updatedt":  new Date(), // 更新时间
  },
]

// 租户订单管理【二期】
"tenant-order": [
	{
    "_id": "",	// 租户ID：tenant-org._id
    "item": [{
      "app": "001",	// 项目ID（授权应用ID）
      "strdt": "",	// 项目开始时间
      "enddt": "",	// 项目结束时间
      "charge": 100,	// 项目服务费（单位元）
      "status": "1", // 状态：SYSX0001='0':无效；'1':有效，默认值：'1'
      "mark": "", // 说明
    },],
	  "status": "1", // 状态：SYSX0001='0':无效；'1':有效，默认值：'1'
		"mark": "", // 说明
		"createdt": new Date(), // 创建时间
		"updatedt": new Date(), // 更新时间
  },
]