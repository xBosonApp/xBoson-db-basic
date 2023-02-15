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
var keywords=sys.request.keywords;  //搜索关键词
var versions=sys.request.versions;  //搜索关键词
var status=sys.request.status;  //搜索关键词

//查询所有代码啊详细信息内容
var sql_xx = "select distinct typecd from sys_mdm002 where 1=1";
var sql_ml = "select distinct typecd from sys_mdm001 where 1=1";
var param_xx = [];
var param_ml = [];
if(keywords!=null){
  sql_xx = sql_xx +" and ( dictcd like ? or dictnm like ? or mark like ? )";
  sql_ml = sql_ml +" and ( typecd like ? or typenm like ? or mark like ? )";
  list.add(param_xx,"%"+keywords+"%");
  list.add(param_xx,"%"+keywords+"%");
  list.add(param_xx,"%"+keywords+"%");
  
  list.add(param_ml,"%"+keywords+"%");
  list.add(param_ml,"%"+keywords+"%");
  list.add(param_ml,"%"+keywords+"%");
}
if(versions!=null){
  sql_xx = sql_xx +" and version = ? ";
  list.add(param_xx,versions);
  
  sql_ml = sql_ml +" and version = ? ";
  list.add(param_ml,versions);
}
if(status!=null){
  sql_xx = sql_xx +" and status = ? ";
  list.add(param_xx,status);
  
  sql_ml = sql_ml +" and status = ? ";
  list.add(param_ml,status);
}

sql.query(sql_xx,param_xx,"res_xx");
var res_xx = sys.result.res_xx;

sql.query(sql_ml,param_ml,"res_ml");
var res_ml = sys.result.res_ml;

// 所有Tree数据
var allTreeSql="select typecd,parentcd,typenm,datatable,url uri from sys_mdm001";
sql.query(allTreeSql,null,"allR");
var allR=sys.result.allR;

// 与关键词匹配的节点
var relatedSql="select a.typecd,a.parentcd,a.typenm,a.datatable,a.url uri,(select count(*) from sys_mdm001 where parentcd=a.typecd) isparent from sys_mdm001 a where 1=1 ";
var param_real = [];
var types = "";
for(var ml in res_ml){
  var val = ml.typecd;
  if(!list.contain(param_real,val)){
    list.add(param_real,val);
    types = types + ",'" +val+"'";
  }
}
for(var xx in res_xx){
  var val = xx.typecd;
  if(!list.contain(param_real,val)){
    list.add(param_real,val);
    types = types + ",'" +val+"'";
  }
}
var data= [];
if(types!=""){
  types = sys.subString(types,1);
  relatedSql = relatedSql + "and a.typecd in ("+types+")";
  sql.query(relatedSql,[],"relatedR");
  var relatedR = sys.result.relatedR; 
  //返回关联的Tree数据
  data = sys.getRelatedTreeData(allR,relatedR,"typecd","parentcd");
}

for(r in data){
    if(r.typecd=="ROOT"){
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
    if(r.isparent != "0"){
        map.put(r,"isParent",true);
    }else{
        map.put(r,"isParent",false);
    }
    //添加nodenm
    if(r.datatable=="sys_mdm002"){
        map.put(r,"nodenm",r.typecd+" "+r.typenm+" "+r.version);
    }else{
        map.put(r,"nodenm",r.typenm);
    }
    map.put(r,"optype","1");
}

//权限过滤
var data2=[];
var res=http.platformGet({"app":"d2c8511b47714faba5c71506a5029d94","mod":"mdmauth","api":"gettypecdauth"});
if(res.data.ret=="0"){
    var resultMap=res.data.resultMap;
    var resultList=res.data.resultList;
    //res.data.enable=false时不进行权限过滤
    if(res.data.enable){
        for(r in data){
            if(list.contain(resultList,r.typecd)){
                map.put(r,"optype",resultMap[r.typecd]);  //节点只读或编辑
                list.add(data2,r);
            }
        }
    }else{
        data2=data;
    }
}else{
    sys.setRetData(res.data.ret,"权限执行异常："+res.data.msg);
    return;
}
sys.addRetData(data2,"result");
sys.setRetData("0","","result");