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
var did=sys.request.did;
var flg_str=sys.request.flg;    //以逗号分隔的字符串
// var sqltype=sys.request.sqltype;
if(did==null || flg_str==null){
    sys.setRetData("1");
    return;
}
var flg_array0=sys.split(flg_str,",");
var flg_array=["D","I","U","S"];

var result=[];
for(flg in flg_array0){
    
    sys.printValue(result);
    if(!list.contain(flg_array,flg)){
        sys.setRetData("2",flg+"字符错误");
        return;
    }
    if(flg=="D" || flg=="I" || flg=="U"){
        var sql_org = "select a.modolcd id, a.modolnm name, a.modolnm text, b.typenm from sys_bm002 a,sys_md_mm001 b where a.did=? and a.sqltype=? and a.dstypecd=b.typecd and a.status='1' and b.status='1'";
        var param=[did,flg];
        sql.query(sql_org,param,"res");
        for(r in sys.result.res){
            list.add(result,{
                id:r.id,
                name:r.name+"("+r.typenm+")",
                text:r.name+"("+r.typenm+")"
            });
        }
    }
    
    if(flg=="S"){
        var sql_org="select a.typecd id,(select typenm from sys_bm001 where typecd=a.typecd and status='1') name from sys_bm003 a where a.status='1' and a.did=?";
        var param=[did];
        sql.query(sql_org,param,"res");
        for(r in sys.result.res){
            list.add(result,r);
        }
    }
}
sys.addRetData(result,"result");
sys.setRetData("0","","result");