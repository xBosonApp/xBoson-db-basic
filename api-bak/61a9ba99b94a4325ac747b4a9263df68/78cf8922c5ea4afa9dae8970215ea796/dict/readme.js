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
--------------------------
Mongo 数据库名称（数据字典）
dbname="xboson-saas-mdm"
--------------------------
字典分类表结构：
"dicts": [
	{
	  "_id": {
			"cd": "SYSX0001", // sort分类编码，编码规则：国标：GB/T2261.2 => GBT22612，平台：SYSX+YEAR+000n
			"parentcd": "0",	// 父分类编码：分类为父类时，默认值: ‘0’
		},
		"nm": "",	// 分类中文名
		"shortkey": "", // 快捷拼音码
		"ver": "2021", // 版本：数字或年代，默认值：'2021'
		"status": "1", // 状态：SYSX0001='0':无效；'1':有效，默认值：'1'
		"mark": "", // 说明
		"url": "", // 操作页面ID：为此分类指定专用操作页面，用于动态加载不同明细画面
		"createdt": new Date(), // 创建时间
		"updatedt": new Date(), // 更新时间
		"dict": [	// 字典明细
			{
				"ver": "2021", // 版本：数字或年代，默认值：'2021'，唯一值，索引：{dict.ver:-1}
				"standard": "001", // 标准来源：字典分类编码：SYSX0002，默认值：'001'（平台）
				"mark": "", // 说明
				"status": "1", //  状态：SYSX0001='0':无效；'1':有效，默认值：'1'
				"createdt": new Date(), // 创建时间
				"updatedt": new Date(), // 更新时间
				"data": [	// 字典数据
					{
						"cd": "", // 字典编码
						"nm": "",	// 字典中文名
						"shortkey": "", // 快捷拼音码
						"mark": "",	// 说明
					},
				],
			},
		],
	},
]
---------------------
数据元Data element
"dataeles": [	// 数据元
	{
	  "_id”: {
		"cd": "SYS002021",	// 分类编码：编码规则：SYS+0n(业务分类，系统：00)+Year
		"parentcd": "0",	// 父分类编码：分类为父类时，默认值:"0"
		},
		"cnm": "基础",	// 中文名称
		"ver": "2021", // 版本：数字或年代，默认值：'2021'
		"status": "1", //  状态：SYSX0001='0':无效；'1':有效，默认值：'1'
		"mark": "", // 说明
		"createdt": new Date(), // 创建时间
		"updatedt": new Date(), // 更新时间
		"dataele": [	// 数据元明细
			{
				"ver": "2021", // 版本：数字或年代，默认值：'2021'，唯一值，索引：{dict.ver:-1}
				"standard": "001", // 标准来源，字典分类编码：SYSX0002，默认值：'001'（平台）
				"mark": "", // 说明
				"status": "1", //  状态：SYSX0001='0':无效；'1':有效，默认值：'1'
				"createdt": new Date(), // 创建时间
				"updatedt": new Date(), // 更新时间
				"data": [	// 数据元数据
					{
						"cd": "SYS0020210001", // 字典编码，分类编码：编码规则：SYS+0n+Year+000n
						"enm": "status",	// 英文名称
						"cnm": "状态",	// 中文名称
						"sort": 0, // 排序
						"datatype": "string", // 数据类型：SYSX0003，如果是数组集合对象类型，定义数据集需要指定 arrayobj 值为数据集对象ID
						"numrange": "1",	// 数据长度
						"format": "",	// 显示格式：SYSX0004
						"unit": "",	// 显示单位：SYSX0005
						"dict": "",	// 字典分类编码
						"mark": "",	// 说明
						"ele": {  // 画面组件元素定义
						  "id": "",	// 组件元素ID
						  "type": "",  // 类型 text(文本类型组件),upload( 上传组件),picker(选择组件),time(时间组件),region(省市县组件) ~
						  "placeholder": "输入【姓名】",	// 默认提示
						  "value":"", // 初始化值
						  "data": [
                { "id": 1, "name": "男" },
                { "id": 2, "name": "女" },
              ], //填充表单的数据 例如下拉框
						  "validate": {
                //验证规则:
                //1.reg正则表达式 
                //2.notnull 非空验证 
                //3.null 不验证
                "type": "reg",
                "value": "",  // 正则表达式
                "tip": "", // 校验后提示信息
              },
              "isRequire":false, // 是否为必填项，默认：false
            	"isDisabled": false,  // 是否禁用，默认：false
            	"isReadonly": false,  // 是否只读，默认：false
            	"isShow": true, // 是否显示，默认：true
						}
					},
				],
			},
		],
	},
]

---------------------
术语表结构：
"terms": [
	{
		"_id": "SYSX0001", // 分类编码，编码规则：国标：GB/T2261.2 => GBT22612，平台：SYSX+YEAR+000n
		"parentcd": "0",	// 父分类编码：分类为父类时，默认值:0
		"cnm": "",	// 分类中文名称：专业-学科
		"enm": "",	// 分类英文名称：专业-学科
		"shortkey": "", // 中文名称快捷拼音码
		"standard": "001", // 标准来源，字典分类编码：SYSX0002，默认值：'001'（平台）
		"status": "1", //  状态：SYSX0001='0':无效；'1':有效，默认值：'1'
		"mark": "", // 说明
		"createdt": new Date(), // 创建时间
		"updatedt": new Date(), // 更新时间
		"term": [
			{
				"id": "", //  UUID (v1)，术语ID
				"year": "2021", // 公布年度或年月：默认：4位数字，参考：2021.07
				"cnm中文名称": "",	// 中文规范
				"enm英文名称": "",	// 英文规范
				"shortkey": "", // 中文名称拼音首字母快捷拼音码
				"defined": "",	// 术语定义：中文内容
				"source": "",	// 术语来源：
				"status": "1", //  状态：SYSX0001='0':无效；'1':有效，默认值：'1'
				"mark": "", // 说明
				"createdt": new Date(), // 创建时间
				"updatedt": new Date(), // 更新时间
			},
		],
	},
]
-----------------------------
"logs": [
	{
		"id": "", // UUID (v1)，索引
		"主数据分类": "", // 主数据类别ID (字典分类编码：SYSX0002)：01:dicts(字典), 02:terms(术语), 
		"分类编码": "", // 
		"操作类型": "", // SYSX0010=mdm001
		"操作前JSON": "", // 
		"操作后JSON": "", // 
		"操作者ID": "", // 
		"创建日期": "", // 创建时间戳
	}
]

---------------------
字典数据（单表）【备用参考】
		"dicts": [
			{
				"_id": "", // 版本：数字或年代，唯一值
				"type_id": "", // 分类编码，dict-sort._id
				"创建时间": "",
				"更新时间": "",
				"数据": [
					{
						"编码": "", // 字典编码
						"名称": "",	// 字典中文名
						"快捷吗": "", // 快捷拼音码
						"状态": "", // SYSX0001=0:无效;1:有效
						"说明": "",
					},
				],
			},
		],