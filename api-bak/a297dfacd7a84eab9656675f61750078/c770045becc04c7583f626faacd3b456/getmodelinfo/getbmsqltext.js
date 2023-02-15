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
var modolcd=sys.request.modolcd;
// var flg=sys.request.flg;
var flg="";
if(modolcd==null){
    sys.setRetData("1");
    return;
}

//获取modolcd在哪个表
var sql0="select modolcd from sys_bm002 where modolcd=?";   //操纵模型
var sql1="select typecd from sys_bm003 where typecd=?"; //多维模型-数据视图
var sql2="select typecd from sys_bm004 where typecd=?"; //多维模型-维度视图
var cnt=sql.query(sql0,[modolcd],"chk_r");
if(cnt>0){
    flg="D,I,U";
}else{
    cnt=sql.query(sql1,[modolcd],"chk_r");
    if(cnt>0){
        flg="S";
    }else{
        cnt=sql.query(sql2,[modolcd],"chk_r");
        if(cnt>0){
            flg="SS";
        }else{
            sys.setRetData("2",modolcd+"不存在");
            return;
        }
    }
}
if(flg=="D,I,U"){
    var sql_org = "select sqltype,sqltext,typecontent from sys_bm002 where modolcd=? and status='1'";
    var param=[modolcd];
    sql.query(sql_org,param);
    sys.setRetData("0","","result");
}

if(flg=="S"){
    var sql_org = "select 'S' as sqltype,sqltext,typecontent from sys_bm003 where typecd=? and status='1'";
    var param=[modolcd];
    sql.query(sql_org,param);
    sys.setRetData("0","","result");
}

if(flg=="SS"){
    var sql_org = "select 'SS' as sqltype,typecontent from sys_bm004 where typecd=? and status='1'";
    var param=[modolcd];
    sql.query(sql_org,param);
    sys.setRetData("0","","result");
}