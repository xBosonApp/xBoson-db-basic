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


// 数据服务中心机构 创建 sys_template 物理表
var sqls =`CREATE TABLE 61a9ba99b94a4325ac747b4a9263df68.sys_template (
  fileid char(32) NOT NULL COMMENT '文件ID',
  filenm varchar(100) NOT NULL COMMENT '文件名称',
  file_desc varchar(200) DEFAULT NULL COMMENT '文件描述',
  file_dir varchar(100) NOT NULL COMMENT '文件路径',
  file_type char(1) DEFAULT NULL COMMENT '文件类型',
  raw_fileid char(32) DEFAULT NULL COMMENT '备份文件的源文件ID',
  status char(1) NOT NULL COMMENT '状态对应数据字典0无效1有效2移除',
  createdt datetime DEFAULT NULL COMMENT '创建时间',
  updatedt datetime DEFAULT NULL COMMENT '修改时间',
  orgid char(32) NOT NULL COMMENT '所属机构ID',
  report_type char(1) DEFAULT '0' COMMENT '0是综合，1是年报，2季报，3月报，4日报',
  report_api char(50) DEFAULT NULL COMMENT '绑定api',
  appid varchar(32) DEFAULT NULL,
  moduleid varchar(50) DEFAULT NULL,
  PRIMARY KEY (fileid),
  KEY sys_files_filenm (filenm)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='文件存储信息表'`;

sql.update(sqls,[]);

// sys.addRetData(result,'result');
sys.setRetData(0, 'Do nothing.','result');