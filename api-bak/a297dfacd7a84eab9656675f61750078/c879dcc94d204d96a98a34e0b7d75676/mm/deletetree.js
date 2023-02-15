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
//（最底层tree节点）
//获取参数
var openid = sys.request.openid;
var org = sys.request.org;
var typecd = sys.request.typecd;

var userid = sys.getUserIdByOpenId(openid);

var gettree = "select typecd from sys_md_mm001 where parentcd=? ";

var gettree_cnt = sql.query(gettree,[typecd],"tree");

var tree = sys.result.tree;

if(sys.size(tree)!=0) {
    sys.setRetData("2");
    return;
}
//根据typecd获取datatables
var gettypecd = "select typecd,parentcd,typenm,shortkey,standard,datatable,url,version,mark,status from sys_md_mm001 where typecd=?";
var gettypecd_cnt = sql.query(gettypecd,[typecd],"typecdR");
if(gettypecd_cnt == 0 ){
    sys.setRetData("2","此类别索引不存在！");
    return;
}
var typecdR=sys.result.typecdR;

//tree节点为数据元类别
if(typecdR[0].datatable == "sys_mdm003"){
    //检查数据元类别中是否有数据元
    var check="select typecd from sys_mdm003 where typecd=?";
    var cnt = sql.query(check,[typecd],"checkdata");
    if(cnt > 0){
        sys.setRetData("1","此数据元类别中存在数据元，不可删除！");
        return;
    }
}
//tree节点为数据集
else if(typecdR[0].datatable == "sys_md_mm002"){
    //检查是否存在物理表映射
    if(sql.query("select typecd from sys_md_mm003 where typecd=?",[typecd],"checkdata")>0){
        sys.setRetData("1","此数据集存在物理表，不可删除！");
        return;
    }
    //检查是否存在索引
    if(sql.query("select typecd from sys_md_mm004 where typecd=?",[typecd],"checkdata")>0){
        sys.setRetData("1","此数据集存在索引信息，不可删除！");
        return;
    }
    //此数据集不存在物理表和索引信息时,清空数据集字段
    sql.update("delete from sys_md_mm002 where typecd=?",[typecd],"1");
}
//tree节点为目录
else if(typecdR[0].datatable == ""){}

// sys.printValue(tree[0].typecd);

var delsql = "delete from sys_md_mm001 where typecd=?";
var delsql_cnt = sql.update(delsql,[typecd],"1");
sql.commit();

//记录日志
if(typecdR[0].datatable!=""){
    var op_type="";
    if(typecdR[0].datatable=="sys_mdm003"){
        op_type="00103";
    }else if(typecdR[0].datatable=="sys_md_mm002"){
        op_type="00203";
    }
    if(op_type!=""){
        var before_json={
            "typecd":typecd,
            "parentcd":typecdR[0].parentcd,
            "typenm":typecdR[0].typenm,
            "shortkey":typecdR[0].shortkey,
            "standard":typecdR[0].standard,
            "datatable":typecdR[0].datatable,
            "version":typecdR[0].version,
            "url":typecdR[0].url,
            "mark":typecdR[0].mark,
            "status":typecdR[0].status
        };
        // var dt=sys.currentTimeString();
        // sys.bizLog("DS.SYS.03.07","id",sys.nextId(),"operation_type","003","userid",userid,"createdt",dt,"before_json",sys.jsonFromInstance(before_json),"after_json","","orgid",org);
        var log_res = http.platformPost({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"operation_log","api":"record_log"},{
            "typecd":typecd,
            "operation_type":op_type,
            "before_json":sys.jsonFromInstance(before_json),
            "after_json":""
        });
        if(log_res.data.ret!="0"){
            sys.setRetData(log_res.data.ret,log_res.data.msg);
            return;
        }
    }
}
//操作数据集日志
http.platformGet({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"mm","api":"cachedatasetinfo"},{"typecd":typecd});
sys.setRetData("0");