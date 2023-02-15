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
//api下线
var pid = sys.getUserPID(sys.request.openid);
var org = sys.request.org;
var nodes = sys.request.nodesRes;
var params = [];
var dt = sql.currentDBTimeString();
var sqls =" ";
if(null==nodes){ sys.setRetData("0","未执行任何修改！"); return ;}

for( i in sys.split(nodes,",")){
    var tmp = sys.split(i,"--");
    list.add(params,tmp[0]+tmp[1]+tmp[2]);
    
    sqls = "SELECT 1 FROM sys_api_content a WHERE stability=50 AND EXISTS (SELECT contentid FROM sys_apis WHERE a.contentid=contentid AND appid=? and moduleid=? and apiid = ? )";
    if(0<sql.query(sqls,[tmp[0],tmp[1],tmp[2]])){
        //下线数据当前为上线状态
        var data = [];//sys_api_his_content
        var data2 = [];//sys_api_content
        list.add(data,sys.uuid());
        list.add(data,tmp[0]);
        list.add(data,tmp[1]);
        list.add(data,tmp[2]);
        
        list.add(data2,dt);
        list.add(data2,tmp[0]);
        list.add(data2,tmp[1]);
        list.add(data2,tmp[2]);
        
        sqls="insert into sys_api_his_content(hisid, contentid, stability, updatecmt, pid, updatedt, content) select ? hisid, contentid,stability, updatecmt,pid, updatedt, content from sys_api_content where contentid=(SELECT distinct contentid FROM sys_apis WHERE appid= ? and moduleid=? and apiid=? )";
        sql.update(sqls, data,"1");
        sqls =" UPDATE sys_api_content SET stability='60',updatedt=?,updatecmt='下线' WHERE contentid = (SELECT contentid FROM sys_apis WHERE appid=? and moduleid=? and apiid=? ) ";
         sql.update(sqls, data2,"1");
    } else {
        //下线数据当前为其他状态
        var data3 = [];
        list.add(data3,sys.uuid());
        list.add(data3,pid);
        list.add(data3,dt);
        list.add(data3,tmp[0]);
        list.add(data3,tmp[1]);
        list.add(data3,tmp[2]);
    //判断数据库类型
    var dbType = se.dbType();  // 01 MySQL, 02 SQLServer, 03 Oracle, 04 DB2
    if(dbType == "01"){
        sqls="insert into sys_api_his_content(hisid, contentid, stability, updatecmt, pid, updatedt, content) select ? hisid, contentid,'60' stability, '下线' updatecmt,? pid, ?, content from sys_api_his_content where stability=50 and contentid=(SELECT contentid FROM sys_apis where appid=? and moduleid=? and apiid=? ) order by updatedt desc limit 1 "; 
     }else if(dbType =="02"){
        sqls="insert top (1) into sys_api_his_content(hisid, contentid, stability, updatecmt, pid, updatedt, content) select ? hisid, contentid,'60' stability, '下线' updatecmt,? pid, ?, content from sys_api_his_content where stability=50 and contentid=(SELECT contentid FROM sys_apis where appid=? and moduleid=? and apiid=? ) order by updatedt desc ";  
     }else if(dbType =="03"){
       sqls="insert  into sys_api_his_content(hisid, contentid, stability, updatecmt, pid, updatedt, content) select ? hisid, contentid,'60' stability, '下线' updatecmt,? pid, ?, content from sys_api_his_content where stability=50 and contentid=(SELECT contentid FROM sys_apis where appid=? and moduleid=? and apiid=? ) order by updatedt desc and rownum <= 1 ";    
     }
        sql.update(sqls, data3 ,"1");
    }   
}
sql.commit();
if(0!=sys.size(params)){
    for(r in params){
        se.delCache(_CACHE_REGION_API_,sys.toLowerCase(r));
    }
}
sys.setRetData("0");