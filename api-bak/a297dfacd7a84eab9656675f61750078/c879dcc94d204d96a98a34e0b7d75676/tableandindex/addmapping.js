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
var org = sys.request.org;
var typecd = sys.request.typecd;  //模型编码
var did = sys.request.did;      //数据源id
var en = sys.request.en;        //要创建的表英文名称
var cn = sys.request.cn;        //要创建的表中文名称
var status = sys.request.status;
var mark = sys.request.mark;
var version = sys.request.version;

var create_model = sys.request.create_model;  //是否同时创建操纵模型  [1,0]
if(status == null){
    status = "1";
}
if(version == null){
    version = "v1.0";
}
//验证参数
if(typecd==null || did == null || en == null ){
    sys.setRetData("1");
    return;
}
var dt = sys.currentTimeString();

//主键是否存在
if(sql.query("select 1 from sys_md_mm003 where typecd=? and did=? and en=?",[typecd,did,en])>0){
    sys.setRetData("2","此数据集和表映射已存在！");
    return;
}
//向sys_md_mm003中插入一条数据
var insert003 = "insert into sys_md_mm003 (typecd,did,en,cn,status,mark,createdt,updatedt) values (?,?,?,?,?,?,?)";
var insertparams = [typecd,did,en,cn,status,mark,dt,dt];
sql.update(insert003,insertparams);

//操作数据集日志
http.platformGet({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"mm","api":"cachedatasetinfo"},{"typecd":typecd});
sys.setRetData("0");

// //创建默认操纵模型
// if(create_model=="1"){
//     try{
//         var res=http.platformGet({"app":"c770045becc04c7583f626faacd3b456","mod":"dmlm","api":"generate_default"},{
//             "typecd":typecd,
//             "did":did,
//             "en":en
//         });
//         if(res.data.ret!="0"){
//             sys.setRetData("2","生成默认操纵模型失败!"+res.data.msg);
//         }
//     }catch(e){
//         sys.setRetData("2","生成默认操纵模型异常!");
//     }
// }