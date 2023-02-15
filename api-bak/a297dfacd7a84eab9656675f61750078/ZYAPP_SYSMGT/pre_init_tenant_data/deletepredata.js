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
//id:deletepredata
//name:删除多条预设数据

var presetid=sys.request.presetid;      //预设ID
var sorting=sys.request.sorting;    //顺序号
var datasorting=sys.request.datasorting;    //以逗号分隔的字符串

if(presetid==null || sorting==null || datasorting==null){
    sys.setRetData("1");
    return;
}
//判断预设是否已被使用
var checkSql = "select orgid from sys_tenant where presetid=?";
var checkSql_cnt=sql.query(checkSql,[presetid]);
if(checkSql_cnt>0){
    sys.setRetData("1","预设已使用，不可删除");
    return;
}
//删除sql
var delSql="delete from sys_pl_init_data where presetid=? and sorting=? and data_sorting=?";

//批量参数
var params=[];

var ds_arr=sys.split(datasorting,",");

for(r in ds_arr){
    if(sys.trim(r)==""){
        sys.setRetData("2","参数错误"+datasorting);
        return;
    }
    var tmp=[presetid,sorting,r];
    list.add(params,tmp);
}

//批量删除
sql.updateBatch(delSql,params);

sys.setRetData("0");