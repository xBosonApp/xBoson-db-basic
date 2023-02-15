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
//id:deletepreset
//name:删除指定预设

var presetid=sys.request.presetid;

if(presetid==null){
    sys.setRetData("1");
    return;
}

//判断预设是否已被使用
var checkSql = "select a.orgid,b.de0810013j orgnm from sys_tenant a,mdm_org b where a.presetid=? and a.orgid=b.orgid";
var checkSql_cnt=sql.query(checkSql,[presetid]);
if(checkSql_cnt>0){
    sys.setRetData("1","预设已使用（"+sys.result.result[0].orgnm+"），不可删除");
    return;
}
// //sys_pl_init_tbl,sys_pl_init_data没有对应的数据时，才可删除
// var tblSql="select presetid from sys_pl_init_tbl where presetid=?";
// var tblSql_cnt=sql.query(tblSql,[presetid],"tbl_r");
// if(tblSql_cnt>0){
//     sys.setRetData("1","请先删除预设ID对应的表和数据，然后删除预设ID");
//     return;
// }

//删除data
var delDataSql="delete from sys_pl_init_data where presetid=?";
sql.update(delDataSql,[presetid]);
//删除tbl
var delTblSql="delete from sys_pl_init_tbl where presetid=?";
sql.update(delTblSql,[presetid]);
//删除预设Sql  显示格式
var delSql = "delete from sys_pl_init_preset where presetid=?";

//参数
var params = [presetid];

sql.update(delSql,params);

sys.setRetData("0");