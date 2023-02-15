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
//api转开发
var pid = sys.getUserPID(sys.request.openid);
var nodes = sys.request.nodesRes;
var params = [];
var params2 = [];
var dt = sql.currentDBTimeString();
var sqls =" ";
sys.printValue(nodes);
if(null==nodes){ sys.setRetData("0","未执行任何修改！"); return ;}

for( i in sys.split(nodes,","))
{
    var data = [];//sys_api_his_content
    var data2 = [];//sys_api_content
    var tmp = sys.split(i,"--");
    list.add(data,sys.uuid());
    list.add(data,pid);
    list.add(data,tmp[0]);
    list.add(data,tmp[1]);
    list.add(data,tmp[2]);
    list.add(params,data);
    
    list.add(data2,dt);
    list.add(data2,pid);
    list.add(data2,tmp[0]);
    list.add(data2,tmp[1]);
    list.add(data2,tmp[2]);
    list.add(params2,data2);
}

sqls="insert into sys_api_his_content(hisid, contentid, stability, updatecmt, pid, updatedt, content) select ? hisid, contentid, stability, updatecmt, ? pid, updatedt, content from sys_api_content where contentid=(SELECT distinct contentid FROM sys_apis WHERE appid=? and moduleid=? and apiid=? )";
sql.updateBatch(sqls, params,"1");

sqls =" UPDATE sys_api_content SET stability='00',updatedt=?,pid=?,updatecmt='转开发' WHERE contentid = (SELECT distinct contentid FROM sys_apis WHERE appid=? and moduleid=? and apiid=? ) ";
sql.updateBatch(sqls, params2,"1");

sql.commit();
sys.setRetData("0");