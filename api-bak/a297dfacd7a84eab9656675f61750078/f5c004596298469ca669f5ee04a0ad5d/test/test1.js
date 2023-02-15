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


//数据服务中心 
//数据源id  d4723f9db3044ba9851af5dc209b1ed7
//数据源schema 61a9ba99b94a4325ac747b4a9263df68

sql.connection("d4723f9db3044ba9851af5dc209b1ed7");

// se.query测试  
// sql.connection执行之后，se.query还是在原来的db连接上执行sql  需要修改？？
se.query("select * from sys_apps",[], "result1");
sql.query("select * from sys_apps",[], "result2");

//连接回平台数据源
sql.connection();

//se.query
// se.query("select * from 61a9ba99b94a4325ac747b4a9263df68.sys_apps",[], "result11");
// se.query("select * from 61a9ba99b94a4325ac747b4a9263df68.sys_apps",[], "result111",true);
// sql.query("select * from 61a9ba99b94a4325ac747b4a9263df68.sys_apps",[], "result22");

// se.query(`select TABLE_NAME 表名,TABLE_COMMENT 表说明 FROM information_schema.TABLES `,[],"test");
//WHERE TABLE_SCHEMA =? and TABLE_NAME = ?

sys.put("uri", http.uri());
sys.setRetData(0, 'Do nothing.',"result1", "result2","result11", "result22","test");