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
var instanceid = sys.request.instanceid;  //节点ID
var select2 = [];
if(instanceid == null){
    // 节点
    var node = "select a.id,a.ip,a.host,a.port,b.userid from sys_eeb_work_node a left join sys_pl_user_node b on a.id=b.nodeid";
    sql.query(node,null,"node");
    for(r in sys.result.node){
        list.add(select2,{
            "id": r.id,
            "name": r.ip+"("+r.userid+")",
            "text": r.ip+"("+r.userid+")"+"("+r.id+")"
        });
    }
}else{
    // 采集点
    var jobgroup = "select id,name from sys_eeb_jobgroup where wid=?";
    sql.query(jobgroup,[instanceid],"jobgroup");
    for(r in sys.result.jobgroup){
        list.add(select2,{
            "id": r.id,
            "name": r.name,
            "text": r.name+"("+r.id+")"
        });
    }
}
sys.addRetData(select2,"result");
sys.setRetData("0","","result");