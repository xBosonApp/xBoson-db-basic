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
//id:getdstree
//name:获取数据集tree

//修改时获取tree时传presetid参数
var presetid = sys.request.presetid;

//预设id对应的表集合
var table_r = [];
if(presetid != null){
    //获取此预设id，sys_pl_init_tbl中的表
    var getTbl = "select presetid,sorting,typecd,did,en,status,createdt,updatedt from sys_pl_init_tbl where presetid=?";
    sql.query(getTbl,[presetid],"table_r");
    table_r=sys.result.table_r;
}

var getTree = "select a.typecd, a.parentcd, a.typenm, a.datatable, b.en, b.did from sys_md_mm001 a left join sys_md_mm003 b on a.typecd=b.typecd where a.status='1'";

var getTree_cnt = sql.query(getTree,[],"data");

var data = sys.result.data;

//过滤结果集
var result = [];
for(r in data){
    if(sys.startWith(r.typecd,"DS.SYS")){
        if(r.did == "00000000000000000000000000000000" || r.did==""){
            map.put(r,"shownm",r.en);
            //table_r与data比较
            for(tr in table_r){
                if(tr.en == r.en){
                    map.put(r,"exist_table",true);
                    map.put(r,"createdt",tr.createdt);
                //tr.typecd!=r.typecd 防止一个数据集多个表重复操作
                }else if(sys.startWith(tr.typecd,r.typecd) && tr.typecd!=r.typecd){
                    map.put(r,"exist_table",true);
                }
            }
            list.add(result,r);
        }
    }
}

//比较sys_pl_init_tbl中的createdt和sys_md_mm002中的updatedt
var getupdatedt="select updatedt from sys_md_mm002 where typecd=? order by updatedt desc";
for(r in result){
    var _cnt=sql.query(getupdatedt,[r.typecd],"tmp_r");
    if(_cnt==0){
        continue;
    }
    if(sys.result.tmp_r[0].updatedt != null && r.createdt != null && sys.result.tmp_r[0].updatedt>r.createdt){
        map.put(r,"table_change",true);
    }
}

sys.addRetData(result,"result");
sys.setRetData("0","","result");