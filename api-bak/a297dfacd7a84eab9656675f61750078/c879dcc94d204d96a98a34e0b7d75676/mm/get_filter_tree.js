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
var keywords = sys.request.keywords;
var versions = sys.request.versions;
var status = sys.request.status;

var param1 =[];
var param2 =[];

var sql = "SELECT typecd,parentcd,typenm,datatable,status,version FROM sys_md_mm001 where 1=1 ";
var sql_in = " union SELECT typecd,parentcd,typenm,datatable,status,version FROM sys_md_mm001 where typecd in( select distinct typecd from sys_md_mm002 where 1=1 ";


if(keywords!=null){
  sql = sql + " and (typecd like ? or typenm like ? )";
  sql_in = sql_in + " and decd like ? or en like ? or cn like ? ";
  list.add(param1,'%'+keywords+'%');
  list.add(param1,'%'+keywords+'%');
  list.add(param2,'%'+keywords+'%');
  list.add(param2,'%'+keywords+'%');
  list.add(param2,'%'+keywords+'%');
}
if(versions!=null){
  sql = sql + " and version = ? ";
  sql_in = sql_in + " and version = ? ";
  list.add(param1,versions);
  list.add(param2,versions);
}
if(status!=null){
  sql = sql + " and status = ? ";
  sql_in = sql_in + " and status = ? ";
  list.add(param1,status);
  list.add(param2,status);
}

var param = [];
for(p in param1){
  list.add(param,p);
}
for(p in param2){
  list.add(param,p);
}

sql = sql + sql_in +")";
sql.query(sql,param,"data");
var result = sys.result.data;

// 所有Tree数据
var allTreeSql="select typecd,parentcd,typenm,datatable,status,version from sys_md_mm001";
sql.query(allTreeSql,null,"allR");
var allR=sys.result.allR;

//返回关联的Tree数据
var data = sys.getRelatedTreeData(allR,result,"typecd","parentcd");
  
for(r in data){
    if(r.typecd=="DE"){
        map.put(r,"open",true);
        //break;
    }
    //添加shownm
    if(r.datatable==""){
      map.put(r,"shownm",r.typecd);
    }else{
      map.put(r,"shownm",r.typecd+r.datatable);
    }
    //添加isParent
    // if(r.isparent != "0"){
    //     map.put(r,"isParent",true);
    // }else{
    //     map.put(r,"isParent",false);
    // }
    //添加nodenm
    if(r.datatable=="sys_md_mm002"){
      map.put(r,"nodenm",r.typenm);
    }else{
      map.put(r,"nodenm",r.typecd+" "+r.typenm+" "+r.version);
    }
    map.put(r,"optype","1");
}
sys.addRetData(data, "result");
sys.setRetData("0","","result");