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
//获取tree数据（where datatable=sys_mdm003）
//getmetadatatree

var sql = "SELECT typecd,parentcd,typenm,datatable FROM sys_md_mm001 where datatable='sys_mdm003'";
  var param = [];
  sql.query(sql,param,"result0");
  var result = sys.result.result0;
  
  var sql1 = "select typecd,parentcd,typenm,datatable from sys_md_mm001";
  sql.query(sql1,[],"result1");
  var result1 = sys.result.result1;
     var result2=sys.getRelatedTreeData(result1,result,"typecd","parentcd");
//   var result3 = sys.transformTreeData(result2,"typecd","parentcd","children");
  //添加根节点
//   list.add(result,{typecd:0,parentcd:0,typenm:"",shownm:"",open:true});
  for(r in result2){
      map.put(r,"shownm",r.typecd+"("+r.datatable+")");
  }
  sys.addRetData(result2,"result");
  sys.setRetData("0","","result");
// var tmp = [];
// var flag = true;
// while(flag){
//  var i=0;
//  for(r in result){
//     var flg = false;
//     for(a in result){
//         if(r.parentcd == a.typecd){
//             flg = true;
//         }
//     }
//     for(b in tmp){
//         if(r.parentcd == b.typecd){
//             flg = true;
//         }
//     }
//     if(!flg){
//         for(ad in result1){
//             if(ad.typecd == r.parentcd){
//                 list.add(tmp, ad);
//                 i=1;
//                 break;
//             }
//         }
//     }
//  }
//  for(t in tmp){
//     list.add(result,t);
//  }
//  if(i==0){
//     flag = false;
//  }
// }

// sys.addRetData(result,"result");
// sys.setRetData("0","","result");