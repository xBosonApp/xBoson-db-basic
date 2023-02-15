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
//获取topic
var topic_r=[];
{
    var selTopics="select topic,typecd from sys_pl_log_topic where status='1'";
    sql.query(selTopics,null,"topic_r");
    topic_r=sys.result.topic_r;
}


//获取所有机构
var allOrgs_r=[];
var allOrgids=[];
{
    var selAllOrgs="select orgid,org_type,pid from sys_tenant where init_db='1' and status='1'";
    sql.query(selAllOrgs,null,"allorgs_r");
    allOrgs_r=sys.result.allorgs_r;
    //为allOrgids赋值
    for(r in allOrgs_r){
        list.add(allOrgids,r.orgid);
    }
}

//循环topic
var error_topic=[];    //异常的topic
for(r in topic_r){
    //检查r.topic是否为机构id
    var orgid=r.topic;
    if(!list.contain(allOrgids,r.topic)){
        orgid=_ORGID_PLATFORM_;
    }
    //获取topic对应的表
    var tblnm="";
    var getTbl="select en from "+orgid+".sys_md_mm003 where typecd=? and status='1' and did='00000000000000000000000000000000'";
    if(se.query(getTbl,[r.typecd],"tbl_r")==0){
        list.add(error_topic,r);
        continue;
    }
    tblnm=sys.result.tbl_r[0].en;
    //获取topic对应的表字段
    var fields=[];
    var getTblField="select decd,en,cn,mk,must,dv,sorting from "+orgid+".sys_md_mm002 where typecd=? and status='1' order by sorting";
    if(se.query(getTblField,[r.typecd],"tblfield_r")==0){
        list.add(error_topic,r);
        continue;
    }
    //为fields赋值
    for(tf in sys.result.tblfield_r){
        list.add(fields,tf.en);
    }
    sys.printValue(r.topic);
    sys.printValue(r.typecd);
    sys.printValue(tblnm);
    sys.printValue(fields);
    //调用se.logTopic方法
    se.logTopic(r.topic,r.typecd,tblnm,fields);
}
//返回异常的topic
sys.addRetData(error_topic,"error_topic");
sys.setRetData("0","","error_topic");