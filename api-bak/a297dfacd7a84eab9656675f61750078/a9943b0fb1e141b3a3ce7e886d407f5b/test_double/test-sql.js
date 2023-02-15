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
var assert = require('assert');

console.warn("\n\n<--- Script From DS platform, Run in xBoson ------------------------------------------------->");


var c = sql.query("SELECT * FROM a297dfacd7a84eab9656675f61750078.sys_bm001 limit ?", [10], "bm");
console.log("sql.query:", c, sys.jsonFromInstance(sys.result.bm));


var d = sql.currentDBTimeString();
console.log("sql.currentDBTimeString", d);


sql.connection('f3f8b967bd664673a12c3823b007b1a8');
sql.query("Select * from sys_config limit ?", [3], 'bm2');
console.log("sql.connection(key)", sys.jsonFromInstance(sys.result.bm2));


sql.connection("jdbc:mysql://localhost:3306/sys", "root", "root");
sql.query("Select * from sys_config limit ?", [2], 'bm3');
console.log("sql.connection(key)", sys.jsonFromInstance(sys.result.bm3));
console.log("sql.dbType()", sql.dbType());


//sql.connection("jdbc:oracle:thin:localhost:1521:test", "root", "root");
sql.connection();
console.log("sql.dbType()", sql.dbType());

var meta = sql.metaData("select * from sys_pl_drm_ds001");
console.log("sql.metaData()", JSON.stringify(meta));


var sqlstr = "SELECT apiid, apinm FROM sys_apis";
sql.queryPaging(sqlstr, [], 1, 30, "p");
var list = sys.result.p;
assert.eq(30, list.length, "list length");
assert(sys.result.p_count, "count");
for (var i=0; i<list.length; ++i) {
  var item = list[i];
  console.log(i, item.apiid, item.apinm);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// All Over
//
console.warn("\n\n<---- <<<<< OK >>>>> Run in xBoson ---------------------------------------------------------->");
//
// All Over
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////