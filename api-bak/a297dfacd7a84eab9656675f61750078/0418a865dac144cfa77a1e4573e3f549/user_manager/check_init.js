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
//id:check_init
//name:检查租户是否初始化

var orgid=sys.request.orgid;
if(orgid==null){
    sys.setRetData("1");
    return;
}

var check_init = "select init_db,presetid from sys_tenant where orgid=?";

var cnt=sql.query(check_init,[orgid]);

if(cnt==0){
    sys.setRetData("2");
    return;
}

var result=sys.result.result;

//增加flag字段，0：未初始化，1：已初始化
for(r in result){
    if(r.init_db == "0"){
        map.put(r,"flag","0");
    }
    if(r.init_db == "1"){
        map.put(r,"flag","1");
    }
}

sys.setRetData("0","","result");