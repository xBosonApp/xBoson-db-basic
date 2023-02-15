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
//id:copypreset
//name:复制预设

var presetid=sys.request.presetid;
if(presetid==null){
    sys.setRetData("1","预设ID未指定");
    return;
}

var dt=date.currentTimeString();
var uuid=sys.uuid();

//select语句
var selSql1 = "select presetid,sorting,typecd,did,en,status,createdt,updatedt from sys_pl_init_tbl where presetid=?";
var selSql2 = "SELECT presetid,sorting,data_sorting,en00,en01,en02,en03,en04,en05,en06,en07,en08,en09,en10,en11,en12,en13,en14,en15,en16,en17,en18,en19,en20,en21,en22,en23,en24,status,createdt,updatedt FROM sys_pl_init_data where presetid=?";
var selSql3 = "select presetid,presetnm from sys_pl_init_preset where presetid=?";

//insert语句
var inSql1 = "insert into sys_pl_init_tbl(presetid,sorting,typecd,did,en,status,createdt,updatedt) values(?,?,?,?,?,?,?,?) ";
var inSql2 = "insert into sys_pl_init_data(presetid,sorting,data_sorting,en00,en01,en02,en03,en04,en05,en06,en07,en08,en09,en10,en11,en12,en13,en14,en15,en16,en17,en18,en19,en20,en21,en22,en23,en24,status,createdt,updatedt) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ";

//查询数据
var cnt = sql.query(selSql1,[presetid],"result1");
// if(cnt==0){
//     sys.setRetData("2","未发现将要复制的初始化数据");
//     return;
// }
var result1=sys.result.result1;

cnt = sql.query(selSql2,[presetid],"result2");
// if(cnt==0){
//     sys.setRetData("2");
//     return;
// }
var result2=sys.result.result2;

cnt = sql.query(selSql3,[presetid],"res3");
if(cnt==0){
    sys.setRetData("2","未发现将要复制的初始化数据");
    return;
}
var res3=sys.result.res3[0];

//插入数据
var param1=[];
var param2=[];
//创建日期，修改日期取select出的
for(res1 in result1){
    list.add(param1,[uuid,res1.sorting,res1.typecd,res1.did,res1.en,res1.status,res1.createdt,res1.updatedt]);
}
for(res2 in result2){
    list.add(param2,[uuid,res2.sorting,res2.data_sorting,res2.en00,res2.en01,res2.en02,res2.en03,res2.en04,res2.en05,res2.en06,res2.en07,res2.en08,res2.en09,res2.en10,res2.en11,res2.en12,res2.en13,res2.en14,res2.en15,res2.en16,res2.en17,res2.en18,res2.en19,res2.en20,res2.en21,res2.en22,res2.en23,res2.en24,res2.status,res2.createdt,res2.updatedt]);
}
if (sys.size(param1) > 0) {
  sql.updateBatch(inSql1,param1,"1");
}
if (sys.size(param2) > 0) {
  sql.updateBatch(inSql2,param2,"1");
}

//插入预设表一条数据
var inSql3="insert into sys_pl_init_preset(presetid,presetnm,status,mark,createdt,updatedt) values (?,?,?,?,?,?)";
var param3=[uuid,res3.presetnm+"-复制["+dt+"]（最新）","1",null,dt,dt];
sql.update(inSql3,param3,"1");

sql.commit();
sys.setRetData("0");