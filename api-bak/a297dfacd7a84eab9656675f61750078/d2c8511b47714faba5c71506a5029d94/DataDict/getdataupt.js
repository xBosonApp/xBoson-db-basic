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
var typecd = sys.request.typecd;
if(typecd == null){
    sys.setRetData("1");
    return;
}
//获取数据库表名称
var gettable = "select datatable from sys_mdm001 where typecd = ?";
var cnt = sql.query(gettable, [typecd], "tableresult");
var tableresult = sys.result.tableresult;

if(cnt == 0){
    sys.setRetData("2");
    return;
}
var table = tableresult[0].datatable;
// if(sys.trim(table) == ""){
//     sys.setRetData("2","根据typecd查出的datatable为空！");
//     return;
// }

//同步数据(暂时写固定数据)
if(sys.trim(table) == ""){
    var getdata = "select * from sys_mdm001 where typecd = ? ";
    var num = sql.query(getdata,[typecd],"data");
    if(num == 0){
        sys.setRetData("2");
        return;
    }
    sys.setRetData("0","","data");
    return;
}
else if(table == "sys_mdm002"){
    var version=sys.request.version;
    var dictcd = sys.request.dictcd;
    if(version == null){
        sys.setRetData("1","version不可为空");
        return;
    }
    if(dictcd == null){
        sys.setRetData("1","dictcd不可为空");
        return;
    }
    var getdata = "select typecd,version, dictcd, dictnm, shortkey, status, mark from sys_mdm002 where typecd = ? and dictcd = ? and version=?";
    var num = sql.query(getdata,[typecd,dictcd,version],"data");
    if(num == 0){
        sys.setRetData("2");
        return;
    }
    sys.setRetData("0","","data");
    return;
}
// if(table == "sys_mdm003"){
//     var decd = sys.request.decd;
//     if(decd == null){
//         sys.setRetData("1","decd不可为空");
//         return;
//     }
//     var getdata = "select typecd,decd,en,cn,datatype,numrange,format,unit,dict,status,mark from sys_mdm003 where typecd = ? and decd = ?";
//     var num = sql.query(getdata,[typecd,decd],"data");
//     if(num == 0){
//         sys.setRetData("2");
//         return;
//     }
//     sys.setRetData("0","","data");
//     return;
// }
else if(table == "sys_pl_mdm004"){
    var dbtype = sys.request.dbtype;
    var class0 = sys.request.class;
    if(dbtype == null || class0 == null){
        sys.setRetData("1","dbtype,class不可为空");
        return;
    }
    var getdata = "select typecd,dbtype,class,sqltext,status,mark from sys_pl_mdm004 where typecd = ? and dbtype = ? and class = ?";
    var num = sql.query(getdata,[typecd,dbtype,class0],"data");
    if(num == 0){
        sys.setRetData("2");
        return;
    }
    sys.setRetData("0","","data");
    return;
}
// if(table == "sys_pl_mdm005"){
    
//     var pdatatype = sys.request.pdatatype;
//     var sdatatype = sys.request.sdatatype;
//     if(pdatatype == null || sdatatype == null){
//         sys.setRetData("1","pdatatype，sdatatype不可为空");
//         return;
//     }
//     var getdata = "select typecd, pdatatype, sdatatype, shortkey, status, mark from sys_pl_mdm005 where typecd = ? and pdatatype = ? and sdatatype = ?";
//     var num = sql.query(getdata,[typecd,pdatatype,sdatatype],"data");
//     if(num == 0){
//         sys.setRetData("2");
//         return;
//     }
//     sys.setRetData("0","","data");
//     return;
// }
else{
    //获取模型主键
    sql.query("select a.en from sys_md_mm002 a,sys_md_mm003 b where b.en=? and b.did=? and a.typecd=b.typecd and a.mk='1'",[table,"00000000000000000000000000000000"],"mk_r");
    if(sys.size(sys.result.mk_r)==0){
        sys.setRetData("2",table+"表不存在或没有主键！");
        return;
    }
    var getdata="select * from "+table+" where ";
    var params=[];
    for(r in sys.result.mk_r){
        getdata=getdata+" "+r.en+"=? and";
        list.add(params,sys.request[r.en]);
    }
    getdata=sys.subStringTo(getdata,0,sys.length(getdata)-3);
    sql.query(getdata,params,"data");
    sys.setRetData("0","","data");
}