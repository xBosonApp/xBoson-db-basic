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
var parentcd = sys.request.parentcd;    //parentcd有值时，是sys_md_mm001表
if(typecd == null){
    sys.setRetData("1");
    return;
}
var table="";
if(parentcd==null){
    //获取数据库表名称
    var gettable = "select datatable from sys_md_mm001 where typecd = ?";
    var cnt = sql.query(gettable, [typecd], "tableresult");
    var tableresult = sys.result.tableresult;
    
    if(cnt == 0){
        sys.setRetData("2");
        return;
    }
    table = tableresult[0].datatable;
}

// if(sys.trim(table) == ""){
//     sys.setRetData("2","根据typecd查出的datatable为空！");
//     return;
// }

//同步数据(暂时写固定数据)
if(sys.trim(table) == ""){
    var getdata = "select * from sys_md_mm001 where typecd = ? ";
    var num = sql.query(getdata,[typecd],"data");
    if(num == 0){
        sys.setRetData("2");
        return;
    }
    sys.setRetData("0","","data");
    return;
}
if(table == "sys_md_mm002"){
    var decd = sys.request.decd;
    var en = sys.request.en;
    if(decd == null||en == null){
        sys.setRetData("1","decd,en不可为空");
        return;
    }
    var getdata = "select typecd,decd,en,cn,mk,must,status,mark,sorting,elemtype,version from sys_md_mm002 where typecd = ? and decd = ? and en = ?";
    var num = sql.query(getdata,[typecd,decd,en],"data");
    if(num == 0){
        sys.setRetData("2");
        return;
    }
    sys.setRetData("0","","data");
    return;
}
if(table == "sys_mdm003"){
    var decd = sys.request.decd;
    if(decd == null){
        sys.setRetData("1","decd不可为空");
        return;
    }
    var getdata = "select typecd,decd,en,cn,datatype,numrange,format,unit,(select typenm from sys_mdm001 where typecd=dict) dictnm,dict,status,mark,isstd,version from sys_mdm003 where typecd = ? and decd = ?";
    var num = sql.query(getdata,[typecd,decd],"data");
    if(num == 0){
        sys.setRetData("2");
        return;
    }
    // for(r in sys.result.data){
    //     if(r.dict!=""){
    //         map.put(r,"dictnm",r.dict+"-"+r.dictnm);    
    //     }
    // }
    sys.setRetData("0","","data");
    return;
}