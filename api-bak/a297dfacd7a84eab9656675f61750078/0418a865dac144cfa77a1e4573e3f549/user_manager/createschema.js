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
var orgid=sys.request.orgid;
sql.connection("00000000000000000000000000000000");
var sql1="create database "+orgid;
sql.update(sql1,[]);

var sql2="CREATE TABLE "+orgid+".sys_tenant ( orgid char(32) NOT NULL COMMENT '租户ID',org_type char(1) NOT NULL COMMENT '开发商租户标记 0开发商1租户',init_db char(1) NOT NULL,pid char(32) NOT NULL COMMENT '租户创建者个人编号',status char(1) NOT NULL COMMENT '字典. 0. 无效 1. 有效 2. 迁出',createdt datetime DEFAULT NULL COMMENT '创建时间',updatedt datetime DEFAULT NULL COMMENT '修改时间',PRIMARY KEY (orgid)) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='平台租户信息表'";
sql.update(sql2,[]);
sql.update("update a297dfacd7a84eab9656675f61750078.sys_tenant set init_db=? where orgid=?",["1",orgid]);
var sql3="CREATE TABLE "+orgid+".sys_user_dept (
  `pid` char(32) NOT NULL COMMENT 'PID',
  `deptid` char(32) NOT NULL COMMENT '部门ID',
  `status` char(1) NOT NULL COMMENT '状态 0无效1有效',
  `createdt` datetime DEFAULT NULL COMMENT '创建时间',
  `updatedt` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`pid`,`deptid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '人员部门映射表'";
sql.update(sql3,[]);
var sql4="CREATE TABLE "+orgid+".sys_apps (
  `appid` VARCHAR(32) NOT NULL COMMENT '应用ID',
  `appnm` VARCHAR(50) NOT NULL COMMENT '应用名称',
  `about` VARCHAR(255) DEFAULT NULL COMMENT '关于应用信息',
  `appflag` CHAR(1) DEFAULT NULL COMMENT '0平台1第三方APP',
  `status` CHAR(1) NOT NULL COMMENT '状态 0无效1有效',
  `createdt` DATETIME DEFAULT NULL COMMENT '创建时间',
  `updatedt` DATETIME DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`appid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '所有 APP 信息表'";
sql.update(sql4,[]);
var sql4="CREATE TABLE "+orgid+".sys_modules (
  `appid` VARCHAR(32) NOT NULL COMMENT '应用ID',
  `moduleid` VARCHAR(50) NOT NULL COMMENT '模块ID',
  `modulenm` VARCHAR(50) DEFAULT NULL COMMENT '模块名称',
  `about` VARCHAR(255) DEFAULT NULL COMMENT '关于模块信息',
  `auflag` CHAR(1) NOT NULL COMMENT 'API UI标记，0 API，1 UI，2 KPI模块',
  `status` CHAR(1) NOT NULL COMMENT '状态 0无效1有效',
  `createdt` DATETIME DEFAULT NULL COMMENT '创建时间',
  `updatedt` DATETIME DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`appid`, `moduleid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT 'APP 模块（业务）信息表'";
sql.update(sql4,[]);
var sql5="CREATE TABLE "+orgid+".sys_apis (
  `appid` varchar(32) NOT NULL COMMENT '应用ID',
  `moduleid` varchar(50) NOT NULL COMMENT '模块ID',
  `apiid` varchar(50) NOT NULL COMMENT 'API ID',
  `apinm` varchar(100) DEFAULT NULL COMMENT 'API名称',
  `op_type` char(1) NOT NULL COMMENT '操作类型，0查询 1更新',
  `vt_type` char(1) NOT NULL COMMENT '操作类型，0查询 1更新',
  `contentid` char(32) NOT NULL COMMENT 'API内容ID',
  `status` char(1) NOT NULL COMMENT '状态 0无效1有效',
  `createdt` datetime DEFAULT NULL COMMENT '创建时间',
  `updatedt` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`appid`, `moduleid`, `apiid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT 'API 信息表'";
sql.update(sql5,[]);
//`help_info` varchar(250) DEFAULT NULL COMMENT 'API帮助',
var sql6="CREATE TABLE "+orgid+".sys_api_content (
  `contentid` char(32) NOT NULL COMMENT 'API内容ID',
  `stability` char(2) NOT NULL COMMENT '稳定性状态 开发中/开发完成/测试中/测试完成待发布/已发布/下线',
  `updatecmt` varchar(250) DEFAULT NULL COMMENT '修改注释',
  `pid` char(32) NOT NULL COMMENT '修改者PID',
  `updatedt` datetime DEFAULT NULL COMMENT '修改时间',
  `content` mediumtext DEFAULT NULL COMMENT 'API内容',
  PRIMARY KEY (`contentid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT 'API 内容表';
CREATE INDEX `sys_api_content_stability` ON `sys_api_content` (`stability`)";
sql.update(sql6,[]);
//`help_info` varchar(250) DEFAULT NULL COMMENT 'API帮助',
var sql7="CREATE TABLE "+orgid+".sys_api_his_content (
  `hisid` char(32) NOT NULL COMMENT '历史ID',
  `contentid` char(32) NOT NULL COMMENT 'API内容ID',
  `stability` char(2) NOT NULL COMMENT '稳定性状态 开发中/开发完成/测试中/测试完成待发布/已发布/下线',
  `updatecmt` varchar(250) DEFAULT NULL COMMENT '修改注释',
  `pid` char(32) NOT NULL COMMENT '修改者PID',
  `updatedt` datetime DEFAULT NULL COMMENT '修改时间',
  `content` mediumtext DEFAULT NULL COMMENT 'API内容',
  PRIMARY KEY (`hisid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT 'API 历史内容表'";
sql.update(sql7,[]);
var sql8="CREATE INDEX `sys_api_his_content_contentid` ON "+orgid+".ys_api_his_content (`contentid`)";
sql.update(sql8,[]);
var sql9="CREATE INDEX `sys_api_his_content_stability` ON "+orgid+".sys_api_his_content (`stability`)";
sql.update(sql9,[]);
var sql10="CREATE TABLE "+orgid+".sys_role (
  `roleid` char(32) NOT NULL COMMENT '角色ID',
  `rolenm` varchar(100) NOT NULL COMMENT '角色名',
  `comm_flag` char(1) DEFAULT NULL COMMENT '通用角色标记 0：不通用，1：通用，字典87',
  `op_type` char(1) NOT NULL COMMENT '操作类型，0查询 1更新',
  `role_desc` varchar(200) DEFAULT NULL COMMENT '角色描述',
  `orgid` char(32) NOT NULL COMMENT '所属机构ID',
  `status` char(1) NOT NULL COMMENT '状态 0无效1有效',
  `createdt` datetime DEFAULT NULL COMMENT '创建时间',
  `updatedt` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`roleid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '角色表'";
sql.update(sql10,[]);
var sql11="CREATE TABLE "+orgid+".sys_role_api (
  `roleid` char(32) NOT NULL COMMENT '角色ID',
  `appid` varchar(32) NOT NULL COMMENT '应用ID',
  `moduleid` varchar(50) NOT NULL COMMENT '模块ID',
  `apiid` varchar(50) NOT NULL COMMENT 'API ID',
  `status` char(1) NOT NULL COMMENT '状态 0无效1有效',
  `createdt` datetime DEFAULT NULL COMMENT '创建时间',
  `updatedt` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`roleid`,`appid`,`moduleid`,`apiid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '角色API映射表'";
sql.update(sql11,[]);
var sql12="CREATE TABLE "+orgid+".sys_user_role (
  `pid` char(32) NOT NULL COMMENT 'PID',
  `roleid` char(32) NOT NULL COMMENT '角色ID',
  `status` char(1) NOT NULL COMMENT '状态 0无效1有效',
  `createdt` datetime DEFAULT NULL COMMENT '创建时间',
  `updatedt` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`pid`,`roleid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '用户角色映射表'";
sql.update(sql12,[]);
var sql13="CREATE TABLE "+orgid+".sys_dept_role (
  `deptid` char(32) NOT NULL COMMENT '部门ID',
  `roleid` char(32) NOT NULL COMMENT '角色ID',
  `status` char(1) NOT NULL COMMENT '状态 0无效1有效',
  `createdt` datetime DEFAULT NULL COMMENT '创建时间',
  `updatedt` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`deptid`,`roleid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '部门角色映射表'";
sql.update(sql13,[]);
var sql14="CREATE TABLE "+orgid+".sys_system_role (
  `sysid` char(32) NOT NULL COMMENT '系统ID',
  `roleid` char(32) NOT NULL COMMENT '角色ID',
  `status` char(1) NOT NULL COMMENT '状态 0无效1有效',
  `createdt` datetime DEFAULT NULL COMMENT '创建时间',
  `updatedt` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`sysid`,`roleid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '系统角色映射表'";
sql.update(sql14,[]);
var sql15="CREATE TABLE "+orgid+".sys_menu (
  `menuid` char(32) NOT NULL COMMENT '菜单ID',
  `p_menuid` char(32) DEFAULT NULL COMMENT '上级菜单ID',
  `levels` int NOT NULL COMMENT '菜单层级',
  `menu_icon` varchar(50) DEFAULT NULL COMMENT '菜单图标',
  `menunm` varchar(50) DEFAULT NULL COMMENT '菜单名称（行业）',
  `uri` varchar(100) DEFAULT NULL COMMENT 'URI',
  `sorting_order` int DEFAULT NULL COMMENT '菜单排序',
  `roleid` varchar(1000) DEFAULT NULL COMMENT '角色ID，多个，逗号分隔',
  `menu_desc` varchar(200) DEFAULT NULL COMMENT '菜单描述',
  `orgid` char(32) NOT NULL COMMENT '机构ID',
  `status` char(1) DEFAULT NULL COMMENT '状态 0无效1有效',
  `createdt` datetime DEFAULT NULL COMMENT '创建时间',
  `updatedt` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`menuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '菜单信息表'";
sql.update(sql15,[]);
var sql16="CREATE TABLE "+orgid+".sys_template (
  `fileid` char(32) NOT NULL COMMENT '文件ID',
  `filenm` varchar(100) NOT NULL COMMENT '文件名称',
  `file_desc` varchar(200) DEFAULT NULL COMMENT '文件描述',
  `file_dir` varchar(100) NOT NULL COMMENT '文件路径',
  `file_type` char(1) DEFAULT NULL COMMENT '文件类型',
  `raw_fileid` char(32) DEFAULT NULL COMMENT '备份文件的源文件ID',
  `orgid` char(32) DEFAULT NULL COMMENT '机构ID',
  `report_type` char(1) DEFAULT NULL COMMENT '报表类型 字典49',
  `appid` varchar(32) DEFAULT NULL COMMENT '应用ID',
  `moduleid` varchar(50) DEFAULT NULL COMMENT '模块ID',
  `report_api` char(50) DEFAULT NULL COMMENT '绑定API',
  `status` char(1) NOT NULL COMMENT '状态 0无效1有效',
  `createdt` datetime DEFAULT NULL COMMENT '创建时间',
  `updatedt` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`fileid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '文件存储信息表'";
sql.update(sql16,[]);
var sql17="CREATE TABLE "+orgid+".sys_mod_kpi (
  `pid` varchar(100) NOT NULL,
  `modid` varchar(100) NOT NULL DEFAULT '''',
  `jsondata` varchar(2000) DEFAULT NULL,
  `createdt` datetime DEFAULT NULL,
  `updatedt` datetime DEFAULT NULL,
  `modnm` varchar(100) NOT NULL,
  `modtype` varchar(100) NOT NULL,
  `shareable` char(1) DEFAULT ''0'',
  `fileid` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`modid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8";
sql.update(sql17,[]);
var sql18="CREATE TABLE "+orgid+".sys_user_html` (
  `pid` varchar(100) NOT NULL DEFAULT '''',
  `pageid` varchar(200) NOT NULL DEFAULT '''',
  `domid` varchar(100) NOT NULL,
  `modid` varchar(100) DEFAULT NULL,
  `createdt` datetime DEFAULT NULL,
  `updatedt` datetime DEFAULT NULL,
  `optdata` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`pid`,`pageid`,`domid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8";
sql.update(sql18,[]);
;
var sql19="CREATE INDEX sys_files_filenm ON "+orgid+".sys_template (`filenm`)";
sql.update(sql19,[]);
sys.setRetData("0");