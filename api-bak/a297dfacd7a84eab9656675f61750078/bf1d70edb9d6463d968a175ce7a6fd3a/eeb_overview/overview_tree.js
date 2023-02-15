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
//用户ID-节点
sql.query("select a.id,a.state,a.ip,a.host,a.port,a.info,a.lastout,b.userid,b.lastdt from sys_eeb_work_node a left join sys_pl_user_node b on a.id=b.nodeid",null,"user_nodeR");

//run_conf-流程图
sql.query("select a.id,a.name,a.type,a.wid,b.userid from sys_eeb_run_conf a left join sys_pl_user_node b on a.wid=b.nodeid",null,"run_confR");

//jobgroup-采集点
sql.query("select a.id,a.name,a.type,a.wid,b.userid from sys_eeb_jobgroup a left join sys_pl_user_node b on a.wid=b.nodeid",null,"jobgroupR");

//varnish-特例
sql.query("select a.vid,a.name,a.wid,a.rid,b.name rname,c.userid from sys_eeb_varnish a left join sys_eeb_run_conf b on a.rid=b.id left join sys_pl_user_node c on a.wid=c.nodeid",null,"varnishR");

//sche-作业计划
sql.query("select a.id,a.rid,a.gid,a.vid,a.name,a.task_time,a.cycle,a.run_times,a.run_end_time,a.intervall,a.json,b.wid,c.userid from sys_eeb_sche a left join sys_eeb_run_conf b on a.rid=b.id left join sys_pl_user_node c on b.wid=c.nodeid",null,"scheR");

var result=[
    {
        "treeid":"ETL",
        "treepid":"0",
        "treename":"ETL节点"
    },
    {
        "treeid":"ESB",
        "treepid":"0",
        "treename":"ESB节点"
    }
];
//用户ID-节点
for(r in sys.result.user_nodeR){
    var tmpMap1={},tmpMap2={};
    map.putAll(tmpMap1,r);
    map.putAll(tmpMap2,r);
    
    map.put(tmpMap1,"treeid","ETL"+r.userid+r.id);
    map.put(tmpMap1,"treepid","ETL");
    map.put(tmpMap1,"treename",r.userid+"("+r.ip+")");
    
    list.add(result,tmpMap1);
    list.add(result,{
        "treeid":"ETL"+r.userid+r.id+"run_conf",
        "treepid":"ETL"+r.userid+r.id,
        "treename":"流程图"
    });
    list.add(result,{
        "treeid":"ETL"+r.userid+r.id+"sche",
        "treepid":"ETL"+r.userid+r.id,
        "treename":"作业计划"
    });
    list.add(result,{
        "treeid":"ETL"+r.userid+r.id+"jobgroup",
        "treepid":"ETL"+r.userid+r.id,
        "treename":"采集点"
    });
    list.add(result,{
        "treeid":"ETL"+r.userid+r.id+"varnish",
        "treepid":"ETL"+r.userid+r.id,
        "treename":"特例"
    });
    
    map.put(tmpMap2,"treeid","ESB"+r.userid+r.id);
    map.put(tmpMap2,"treepid","ESB");
    map.put(tmpMap2,"treename",r.userid+"("+r.ip+")");
    
    list.add(result,tmpMap2);
    list.add(result,{
        "treeid":"ESB"+r.userid+r.id+"run_conf",
        "treepid":"ESB"+r.userid+r.id,
        "treename":"流程图"
    });
}

//run_conf-流程图
for(r in sys.result.run_confR){
    //ETL
    if(r.type=="1"){
        list.add(result,{
            "id":r.id,
            "name":r.name,
            "type":r.type,
            "wid":r.wid,
            "userid":r.userid,
            "treeid":r.id,
            "treepid":"ETL"+r.userid+r.wid+"run_conf",
            "treename":r.name
        });
    }
    //ESB
    else if(r.type=="2"){
        list.add(result,{
            "id":r.id,
            "name":r.name,
            "type":r.type,
            "wid":r.wid,
            "userid":r.userid,
            "treeid":r.id,
            "treepid":"ESB"+r.userid+r.wid+"run_conf",
            "treename":r.name
        });
    }
}

//jobgroup-采集点
for(r in sys.result.jobgroupR){
    list.add(result,{
        "id":r.id,
        "name":r.name,
        "type":r.type,
        "wid":r.wid,
        "userid":r.userid,
        "treeid":r.id,
        "treepid":"ETL"+r.userid+r.wid+"jobgroup",
        "treename":r.name
    });
}

//varnish-特例
for(r in sys.result.varnishR){
    list.add(result,{
        "vid":r.vid,
        "name":r.name,
        "wid":r.wid,
        "rid":r.rid,
        "rname":r.rname,
        "userid":r.userid,
        "treeid":r.vid,
        "treepid":"ETL"+r.userid+r.wid+"varnish",
        "treename":r.name
    });
}

//sche-作业计划
for(r in sys.result.scheR){
    map.put(r,"treeid",r.id);
    map.put(r,"treepid","ETL"+r.userid+r.wid+"sche");
    map.put(r,"treename",r.name);
    list.add(result,r);
}

sys.addRetData(result,"result");
sys.setRetData("0","","result");