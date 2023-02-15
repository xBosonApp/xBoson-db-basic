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
var sql = "SELECT a.typecd,a.parentcd,a.typenm,a.datatable, b.en tables, a.status FROM sys_md_mm001 a LEFT JOIN sys_md_mm003 b on a.typecd = b.typecd order by a.typecd";
var param = [];
sql.query(sql,param,"data");
var data = sys.result.data;
var result = [], tmpList=[];
//typecd去重复
for(r in data){
    if(list.contain(tmpList,r.typecd)){
        for(tmp_r in result){
            if(tmp_r.typecd==r.typecd){
                if(!sys.contain(tmp_r.shownm,r.tables)){
                    map.put(tmp_r,"shownm",tmp_r.shownm+"-("+r.tables+")");    
                }
                break;
            }
        }
    }else{
        if(r.tables!=""){
            map.put(r,"shownm",r.typecd+"("+r.tables+")");
        }else{
            map.put(r,"shownm",r.typecd);
        }
        // 节点显示code和名称
        map.put(r,"typenm", r.typecd + " "+ r.typenm);
        list.add(result,r);
        list.add(tmpList,r.typecd);
    }
}
  //添加根节点
//   list.add(tmpList,{typecd:0,parentcd:0,typenm:"",shownm:"",open:true,datatable:""});
sys.addRetData(result, "result");
sys.setRetData("0","","result");
  
  
  //异步加载
//   var parentcd=sys.request.parentcd;
//   if(parentcd==null){
//       parentcd="0";
//   }
//   var sql = "SELECT a.typecd,a.parentcd,a.typenm,a.datatable, b.en tables, (select count(*) from sys_md_mm001 where parentcd=a.typecd) isparent FROM sys_md_mm001 a LEFT JOIN sys_md_mm003 b on a.typecd = b.typecd where a.parentcd=? ";
//   var param = [parentcd];
//   sql.query(sql,param,"data");
//   var data = sys.result.data;
//   var tmpList = [];
//   //typecd去重复
//   for(r in data){
//       var num = 0;
//       for(a in tmpList){
//           if(a.typecd == r.typecd){
//               num = num + 1;
//           }
//       }
//       if(num == 0){
//           //添加shownm
//           if(sys.trim(r.datatable) == ""){
//               map.put(r,"shownm",r.typecd);
//           }else{
//               map.put(r,"shownm",r.typecd+"("+r.datatable+")");
//           }
//           //添加isParent
//           if(r.isparent != "0"){
//               map.put(r,"isParent",true);
//           }else{
//               map.put(r,"isParent",false);
//           }
//           list.add(tmpList,r);
//       }
//   }
//   //添加根节点
// //   list.add(tmpList,{typecd:0,parentcd:0,typenm:"",shownm:"",open:true,datatable:""});
//   sys.addRetData(tmpList, "result");
//   sys.setRetData("0","","result");