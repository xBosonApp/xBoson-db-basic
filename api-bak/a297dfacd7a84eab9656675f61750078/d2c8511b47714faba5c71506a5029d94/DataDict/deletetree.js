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
//获取参数

var typecd = sys.request.typecd;

var org = sys.request.org;

if(typecd==null){
    sys.setRetData("1");
    return;
}

// var typecd_lc=sys.toUpperCase(typecd);
// if(typecd_lc=="MDDM.MDM.AUTH" || typecd_lc=="BM.MDDM" || typecd_lc=="BM.DMLM" || typecd_lc=="BM"){
//     sys.setRetData("2","此节点不可以删除");
//     return;
// }

// 只删除最底层类别索引
var gettree = "select typecd,parentcd from sys_mdm001 where parentcd=? ";

var gettree_cnt = sql.query(gettree,[typecd],"tree");

var tree = sys.result.tree;

if(sys.size(tree)!=0) {
    sys.setRetData("2","只允许删除底层节点");
    return;
}
//根据typecd类别信息
var gettypecd = "select typecd,parentcd,typenm,shortkey,standard,datatable,url,version,status,mark from sys_mdm001 where typecd=?";
var gettypecd_cnt = sql.query(gettypecd,[typecd],"typecdR");
if(gettypecd_cnt == 0 ){
    sys.setRetData("2","此类别编码不存在！");
    return;
}
var typecdR=sys.result.typecdR;
//判断关联的datatable是否有数据
if(sys.trim(typecdR[0].datatable) != ""){
    try{
        var check="select typecd from "+typecdR[0].datatable+" where typecd=?";
        var cnt = sql.query(check,[typecd],"checkdata");
        if(cnt > 0){
            sys.setRetData("1","此条记录对应的表里有数据，不可删除！");
            return;
        }
    }catch(e){}
}
// sys.printValue(tree[0].typecd);

var delsql = "delete from sys_mdm001 where typecd=?";
var delsql_cnt = sql.update(delsql,[typecd]);
//记录日志
var before_json={
    "typecd":typecd,
    "parentcd":typecdR[0].parentcd,
    "typenm":typecdR[0].typenm,
    "shortkey":typecdR[0].shortkey,
    "standard":typecdR[0].standard,
    "datatable":typecdR[0].datatable,
    "url":typecdR[0].url,
    "version":typecdR[0].version,
    "status":typecdR[0].status,
    "mark":typecdR[0].mark
};
var after_json={};
var log_res = http.platformPost({"app":"d2c8511b47714faba5c71506a5029d94","mod":"operation_log","api":"record_log"},{
    "typecd":typecd,
    "operation_type":"00103",
    "before_json":sys.jsonFromInstance(before_json),
    "after_json":sys.jsonFromInstance(after_json)
});
if(log_res.data.ret!="0"){
    sys.setRetData(log_res.data.ret,log_res.data.msg);
    return;
}
//删除数据字典缓存
if(delsql_cnt == 1){
    se.delCache(_CACHE_REGION_MDM_, org+":"+typecd);
}else{
    sys.setRetData("2");
}

sys.setRetData("0");