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
// rolemodels 角色模型列表
var roleid = sys.request.roleid;
if (roleid == null) {
  sys.setRetData("1","未指定角色");
  return;
}

//------------------copied and modified from:
//c879dcc94d204d96a98a34e0b7d75676/outdatasource/getdedstree
//auth/role_model/getrolemodeltree
//auth/role_model/getcheckinfo

//获取数据集tree
var gettree = "select typecd,parentcd,typenm,shortkey,standard,datatable,version,status,mark,typenm shownm from sys_md_mm001";
sql.query(gettree,[],"data");
var data = sys.result.data;
var result1 = [];   //数据集tree
var tmpMap={};  //typecd,parentcd映射
for(r in data){
    map.put(tmpMap,r.typecd,r.parentcd);
}

for(r in data){
    map.put(r,"click",false);
    var _typecd=r.typecd;
    var _typecd_nocase=sys.toLowerCase(r.typecd);
    while(true){
        if(_typecd_nocase=="de"){
            break;
        } else if(_typecd_nocase=="ds"){
            list.add(result1,r);
            break;
        }
        
        if(tmpMap[_typecd]!=null){
          _typecd=tmpMap[_typecd];
          _typecd_nocase=sys.toLowerCase(_typecd);
        } else {
          break;
        }
    }
}
//------------------
var result=result1;
var arr=[];
for(i in result){
    if(i.typecd=='DS')
    continue;
    if(i.parentcd=='DS')
    map.put(i,'parentcd','BM.DMLM');
    list.add(arr,i);
}
var sql1="select typecd,parentcd,typenm from sys_bm001";
var sql3="select modolcd typecd,modolnm typenm,dstypecd parentcd, '1' as ismodel from sys_bm002 where status='1'";
sql.query(sql1,null,'data');
sql.query(sql3,null,'data2');

var array=[];
for(n in arr){
    list.add(array,n);
}
for(v in sys.result.data){
    if(v.typecd=='BM')
    continue;
    list.add(array,v);
}
for(v in sys.result.data2){
    list.add(array,v);
}

// 过滤array
// 获取视图模型ID，维度模型ID
sql.query("select a.typecd,b.parentcd,b.typenm,'1' as ismodel from sys_bm003 a,sys_bm001 b where a.typecd=b.typecd and a.status='1' and b.status='1'",null,"bm003");
sql.query("select a.typecd,b.parentcd,b.typenm,'1' as ismodel from sys_bm004 a,sys_bm001 b where a.typecd=b.typecd and a.status='1' and b.status='1'",null,"bm004");
var tmpArr = [];
list.addAll(tmpArr,sys.result.bm003);
list.addAll(tmpArr,sys.result.bm004);
list.addAll(tmpArr,sys.result.data2);

var sqls="select typecd from sys_role_model where roleid=? and status='1'";
sql.query(sqls,[roleid],"rolemodels");

// for (pRow in tmpArr) {
//   for (cRow in sys.result.rolemodels) {
//     if (pRow.typecd==cRow.typecd) {
//       map.put(pRow,"checked", "true");
//       break;
//     }
//   }
// }

array = sys.getRelatedTreeData(array,tmpArr,"typecd","parentcd");
for (pRow in array) {
  for (cRow in sys.result.rolemodels) {
    if (pRow.typecd==cRow.typecd) {
      map.put(pRow,"checked", "true");
      break;
    }
  }
}
var resultTree = sys.transformTreeData(array,"typecd","parentcd","children");
sys.addRetData(resultTree,"result");
sys.setRetData("0","","result");