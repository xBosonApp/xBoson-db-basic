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
//id:getmdm002tree
//name: 获取tree数据 datatable=sys_mdm002
//返回两种类型数据

var sqlAll = "select typecd,parentcd,typenm,datatable from sys_mdm001 where status = '1'";

sql.query(sqlAll,[],"alldata");

var alldata = sys.result.alldata;
for(r in alldata){
    map.put(r,"shownm",r.typecd+"-"+r.typenm);
}

if(sys.size(alldata)==0){
    // sys.addRetData([],"data");
    sys.addRetData([],"select2");
    sys.setRetData("0","","data","select2");
    return;
}

var sqldata = "select typecd,parentcd,typenm,datatable from sys_mdm001 where datatable = 'sys_mdm002' and status = '1'";

sql.query(sqldata,[],"subdata");

var subdata = sys.result.subdata;
for(r in subdata){
    map.put(r,"shownm",r.typecd+"-"+r.typenm);
}

//ztree数据格式
var result=sys.getRelatedTreeData(alldata,subdata,"typecd","parentcd");

//select2数据格式
var select2=[];
for(r in result){
    list.add(select2,{
        "pid":r.parentcd,
        "id":r.typecd,
        "name":r.typenm+"("+r.typecd+")",
        "text":r.typenm+"("+r.typecd+")",
        "disabled":r.datatable!="sys_mdm002"
    });
}

select2=sys.transformTreeData(select2,"id","pid","children");


// sys.addRetData(result,"data");
sys.addRetData(select2,"select2");
sys.setRetData("0","","data","select2");