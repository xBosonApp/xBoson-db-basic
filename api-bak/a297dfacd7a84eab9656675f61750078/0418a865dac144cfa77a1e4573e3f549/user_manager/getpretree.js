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
//id:getpretree
//name:获取预设表tree

var presetid=sys.request.presetid;  //预设ID

if(presetid==null){
    sys.setRetData("1");
    return;
}
//获取预设表
var getTbl = "select presetid,sorting,typecd,did,en,createdt from sys_pl_init_tbl where presetid=? and status='1'";

sql.query(getTbl,[presetid],"pretbl_r");

var pretbl_r=sys.result.pretbl_r;


var gettype="select a.typecd, a.parentcd, a.typenm, a.datatable, b.en, b.did from sys_md_mm001 a left join sys_md_mm003 b on a.typecd=b.typecd where a.typecd like 'DS.SYS%' and a.status='1' and (b.did='00000000000000000000000000000000' or b.did is null)";
sql.query(gettype,[],"typeinfo_r");
var typeinfo_r=sys.result.typeinfo_r;

//从typeinfo_r中筛选pretbl_r
//还没完成，暂时只筛选最底层
var result=[];
// var tmp = [];
for(r in pretbl_r){
    for(t in typeinfo_r){
        if(t.typecd==r.typecd && t.did==r.did && t.en==r.en ){
          // if (!list.contain(tmp,t)) {//强制去重
            map.put(t,"createdt",r.createdt);
            list.add(result,t);
            // list.add(tmp,t);
          // }
        }else if(sys.startWith(r.typecd,t.typecd) && (!list.contain(result,t)) && r.typecd!=t.typecd){
          // if (!list.contain(tmp,t)) {//强制去重
            list.add(result,t);
            // list.add(tmp,t);
          // }
        }
    }
}
//比较sys_pl_init_tbl中的createdt和sys_md_mm002中的updatedt
var getupdatedt="select updatedt from sys_md_mm002 where typecd=? order by updatedt desc";
for(r in result){
    var _cnt=sql.query(getupdatedt,[r.typecd],"tmp_r");
    if(_cnt==0){
        map.put(r,"shownm",r.en);
        continue;
    }
    if(sys.result.tmp_r[0].updatedt != null && r.createdt!=null && sys.result.tmp_r[0].updatedt>r.createdt){
        map.put(r,"table_change",true);
    }
    map.put(r,"shownm",r.en);
}

sys.addRetData(result,"result");
sys.setRetData("0","","result");