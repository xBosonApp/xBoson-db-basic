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

var s = [
  `Create Table IF NOT EXISTS ns_ex_cri (
  	criid        varchar(32) NOT NULL,
  	createdt     datetime NOT NULL,
  	updatedt     datetime NOT NULL,
  	standardcode varchar(45) NOT NULL COMMENT '交换标准编码',
  	standardname varchar(45) NOT NULL COMMENT '交换标准编码名称',
  	setcode      varchar(45) NOT NULL COMMENT '数据集编码',
  	setcodenode  varchar(45) NOT NULL COMMENT '数据集名称',
  	table_name   varchar(45) COMMENT '物理表名',
  	typecd       varchar(100) NOT NULL Comment '数据集列映射字典, sys_mdm001',
  	status       int(11) NOT NULL DEFAULT '1',
  	
  	PRIMARY KEY (standardcode, setcode),
  	UNIQUE INDEX criid_UNIQUE (criid ASC)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='交换标准'`,
  
  
  `Create Table IF NOT EXISTS ns_ex_remote (
  	rtid      varchar(32) NOT NULL,
  	createdt  datetime NOT NULL,
  	updatedt  datetime NOT NULL,
  	authoritytype Int Not Null Comment '登录方式',
  	username  varchar(50),
  	userpwd   varchar(50),
  	license   varchar(1500),
  	status    int(11) NOT NULL DEFAULT '1',
    rname     varchar(45) NOT NULL DEFAULT 'nonname',
  	
  	PRIMARY KEY (rtid),
  	UNIQUE KEY rname_UNIQUE (rname)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='远程配置'`,
  
  
  `Create Table IF NOT EXISTS ns_ex_mapper (
  	mapid      varchar(32) NOT NULL,
  	createdt   datetime NOT NULL,
  	updatedt   datetime NOT NULL,
  	sql_str    varchar(5000) NOT NULL Comment 'SQl查询文',
  	map_json   varchar(5000) Not Null Comment '数据集>SQl列 映射',
  	status     int(11) NOT NULL DEFAULT '1',
  	
  	criid      varchar(32) Not Null Comment '交换标准 ns_ex_cri',
  	source_did varchar(32) NOT NULL Comment '数据源主键 sys_pl_drm_ds001',
  	wsid       varchar(32) Not Null Comment 'SOAP 调用定义 sys_webservice',
  	rtid       varchar(32) Not Null Comment 'SOAP 调用定义 ns_ex_remote',
  	route      varchar(50) Comment '服务路由信息, scenecode:serviceename [/route]',
  	process    varchar(50) Comment '服务流程编排相关信息',
  	
  	sourceorgan  varchar(50) Not Null Comment '消费方所在机构编码',
  	sourcedomain varchar(50) Not Null Comment '消费方所使用的接入系统编码',
  	servicecode  varchar(50) Not Null Comment '请求的服务在服务注册中心的唯一服务编码',
  	targetorgan  varchar(50) Comment '服务提供方所在的机构编码',
  	targetdomain varchar(50) Not Null Comment '服务提供方所在的接入系统编码',
  	map_name     varchar(45) NOT NULL,
  	
  	PRIMARY KEY (mapid),
  	UNIQUE KEY map_name_UNIQUE (map_name)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='DB映射配置'`,
  
  
  `Create Table If Not Exists ns_ex_req_log (
    logid       varchar(32) NOT NULL,
    mapid       varchar(32) NOT NULL,
    daqtaskid   varchar(32) NOT NULL Comment '采集任务的标识号',
  	reqcode     int Not NUll Comment '上传数据请求结果代码',
  	reqmsg      text Not Null Comment '上传数据请求结果描述',
  	totalcnt    int Not Null Comment '上传数据行',
    
    status      int(11) NOT NULL DEFAULT '1',
    createdt    datetime NOT NULL,
  	updatedt    datetime NOT NULL,
    PRIMARY KEY (logid)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='数据交换日志'`
];

s.forEach(function(ss) {
  sql.update(ss);
  sys.printValue("Success: "+ ss.substring(0, 50) +"...");
});

sys.setRetData(0, 'ok');