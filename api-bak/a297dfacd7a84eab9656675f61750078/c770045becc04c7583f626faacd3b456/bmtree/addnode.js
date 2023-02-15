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
//id:addnode
//name:添加类别节点

var typecd=sys.request.typecd;
var parentcd=sys.request.parentcd;
var typenm=sys.request.typenm;
var shortkey=sys.request.shortkey;
var standard=sys.request.standard;
var datatable=sys.request.datatable;
var url=sys.request.url;
var version=sys.request.version;
var status=sys.request.status;
var mark=sys.request.mark;
var dt=sys.currentTimeString();

if(typecd==null || parentcd==null || typenm==null || standard==null || status==null){
    sys.setRetData("1");
    return;
}
//检查主键是否重复
// var cnt = sql.query("select typecd from sys_bm001 where typecd=?",[typecd]);
// if(cnt > 0){
//     sys.setRetData("2","类别编码已存在！");
//     return;
// }
// 检查模型ID是否存在
var check_res = http.platformGet({"app":"c770045becc04c7583f626faacd3b456","mod":"auth","api":"unique_check"},{"typecd":typecd});
if(check_res["data"].ret == "0"){
    if(check_res["data"].result[0].isUnique){
    }else{
        sys.setRetData("2","类别编码已存在，请更换类别编码");
        return;
    }
}else{
    sys.setRetData(check_res["data"].ret,check_res["data"].msg);
    return;
}
var sql="insert into sys_bm001(status,mark,createdt,updatedt,typecd,parentcd,typenm,shortkey,standard,datatable,url,version) values (?,?,?,?,?,?,?,?,?,?,?,?)";
//生成快捷码
if(shortkey==null){
    shortkey=sys.getPinyinFirstLetter(typenm);
}
var params=[status,mark,dt,dt,typecd,parentcd,typenm,shortkey,standard,datatable,url,version];

sql.update(sql,params);
var data={"typecd":typecd,"parentcd":parentcd,"typenm":typenm,"datatable":datatable,"uri":url};
sys.addRetData(data,"data");
sys.setRetData("0","","data");