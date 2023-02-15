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


// 数据服务中心机构 sys_bm001模型预设数据

var sql="select typecd,parentcd,typenm,shortkey,standard,datatable,url uri,version,status,mark,createdt,updatedt from sys_bm001 where typecd='BM.DMLM' or typecd='BM.MDDM' or typecd ='BM'";
sql.query(sql,null,"result");
// result=sys.result.result;

var sql2 = ` insert IGNORE into 61a9ba99b94a4325ac747b4a9263df68.sys_bm001 
  select typecd,parentcd,typenm,shortkey,standard,datatable,url uri,version,status,mark,createdt,updatedt from sys_bm001 where typecd='BM.DMLM' or typecd='BM.MDDM' or typecd ='BM'

`;

sql.update(sql2,[]);

// sys_template

// sql.update('create table 61a9ba99b94a4325ac747b4a9263df68.sys_template like sys_template', null);

// sql.query('select TABLE_NAME ???,TABLE_COMMENT ??? FROM information_schema.TABLES ',null,'test');

// sql.update('drop table 61a9ba99b94a4325ac747b4a9263df68.testuser1',null);
// sql.update('drop table 61a9ba99b94a4325ac747b4a9263df68.testuser2',null);

sql.connection('2b92f395e82c4e0a982d0c1f8c28ae9e');

sql.query('select version() ver',null);

// sys.addRetData(result,'result');
sys.setRetData(0, 'Do nothing.','result');