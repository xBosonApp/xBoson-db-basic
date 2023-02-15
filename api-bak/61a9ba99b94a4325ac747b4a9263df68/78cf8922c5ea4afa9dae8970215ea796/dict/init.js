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

var collection = lib.open("dicts");

var cnt = collection.count();

// 初始化
if(cnt == 0){
  collection.insert([
    {
      _id:{
        cd: "0",
        parentcd: "0"
      },
      "nm": "值域代码",
      "status": "1",
      "mark":"",
      "createdt":new Date(),
      "updatedt":new Date(),
    },
    {
      _id:{
        cd: "SYSX0000",
        parentcd: "0"
      },
      "nm": "系统",
      "status": "1",
      "mark":"系统基础代码",
      "createdt":new Date(),
      "updatedt":new Date(),
    },
    {
      _id:{
        cd: "SYSX0001",
        parentcd: "SYSX0000"
      },
      "nm": "状态",
      "shortkey": "zt",
      "ver": "2021",
      "status": "1",
      "mark":"",
      "url":"",
      "createdt":new Date(),
      "updatedt":new Date(),
      "dict": [
        {
          "ver": "2021",
          "standard": "001",
          "mark": "",
          "status": "1",
          "createdt": new Date(),
          "updatedt": new Date(),
          "data": [
            {
              "cd": "1",
              "nm": "有效",
              "shortkey": "yx",
              "mark": ""
            },
            {
              "cd": "0",
              "nm": "无效",
              "shortkey": "wx",
              "mark": ""
            }
          ]
        }  
      ]
    },
    {
      _id:{
        cd: "SYSX0002",
        parentcd: "SYSX0000"
      },
      "nm": "标准来源",
      "shortkey": "bzly",
      "ver": "2021",
      "status": "1",
      "mark":"",
      "url":"",
      "createdt":new Date(),
      "updatedt":new Date(),
      "dict": [
        {
          "ver": "2021",
          "standard": "001",
          "mark": "",
          "status": "1",
          "createdt": new Date(),
          "updatedt": new Date(),
          "data": [
            {
              "cd": "001",
              "nm": "系统",
              "shortkey": "pt",
              "mark": ""
            }
          ]
        }  
      ]
    },
  ]);  
}

// 字典分类表结构：
// var dicts = [
// 	{
// 	  "_id": {
// 			"cd": "SYSX0001", // sort分类编码，编码规则：国标：GB/T2261.2 => GBT22612，平台：SYSX+YEAR+000n
// 			"parentcd": "0",	// 父分类编码：分类为父类时，默认值: ‘0’
// 		},
// 		"nm": "",	// 分类中文名
// 		"shortkey": "", // 快捷拼音码
// 		"ver": "2021", // 版本：数字或年代，默认值：'2021'
// 		"status": "1", // 状态：SYSX0001='0':无效；'1':有效，默认值：'1'
// 		"mark": "", // 说明
// 		"url": "", // 操作页面ID：为此分类指定专用操作页面，用于动态加载不同明细画面
// 		"createdt": new Date(), // 创建时间
// 		"updatedt": new Date(), // 更新时间
// 		"dict": [	// 字典明细
// 			{
// 				"ver": "2021", // 版本：数字或年代，默认值：'2021'，唯一值，索引：{dict.ver:-1}
// 				"standard": "001", // 标准来源：字典分类编码：SYSX0002，默认值：'001'（平台）
// 				"mark": "", // 说明
// 				"status": "1", //  状态：SYSX0001='0':无效；'1':有效，默认值：'1'
// 				"createdt": new Date(), // 创建时间
// 				"updatedt": new Date(), // 更新时间
// 				"data": [	// 字典数据
// 					{
// 						"cd": "", // 字典编码
// 						"nm": "",	// 字典中文名
// 						"shortkey": "", // 快捷拼音码
// 						"mark": "",	// 说明
// 					},
// 				],
// 			},
// 		],
// 	},
// ];

sys.setRetData(0);