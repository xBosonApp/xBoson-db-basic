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
//id:deletepretable
//name:删除指定预设表

var presetid=sys.request.presetid;
// var sorting=sys.request.sorting;
var typecd=sys.request.typecd;
var did=sys.request.did;
var en=sys.request.en;

if(presetid==null || typecd==null ||did==null || en==null){
    sys.setRetData("1");
    return;
}
//判断预设是否已被使用
var checkSql = "select orgid from sys_tenant where presetid=?";
var checkSql_cnt=sql.query(checkSql,[presetid]);
if(checkSql_cnt>0){
    sys.setRetData("1","预设已使用，不可删除");
    return;
}
//根据预设ID获取预设表sorting
var getTbl = "select sorting,typecd,did,en,status,createdt,updatedt from sys_pl_init_tbl where presetid=? and typecd=? and did=? and en=?";
var getTbl_cnt=sql.query(getTbl,[presetid,typecd,did,en],"getbl_r");
if(getTbl_cnt==0){
    sys.setRetData("2","获取预设表失败");
    return;
    // sys.setRetData("1","没有查找到preseid对应的表");
    // return;
}
var sorting = sys.result.getbl_r[0].sorting;
// //presetid对应的sys_pl_init_data有数据时不可删除
// var selSql = "select presetid from sys_pl_init_data where presetid=? and sorting=?";
// var selSql_cnt = sql.query(selSql,[presetid,sorting],"selsql_r");
// if(selSql_cnt>0){
//     sys.setRetData("1","表里有"+selSql_cnt+"条数据，请先删除数据再删除表");
//     return;
// }
//删除presetid对应的sys_pl_init_data中的数据
var delDataSql="delete from sys_pl_init_data where presetid=? and sorting=?";
sql.update(delDataSql,[presetid,sorting]);
//删除presetid对应的sys_pl_init_tbl中的记录
var delSql = "delete from sys_pl_init_tbl where presetid=? and sorting=?";

//参数
var params=[presetid,sorting];

sql.update(delSql,params);

sys.setRetData("0");