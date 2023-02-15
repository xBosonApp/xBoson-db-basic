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
//   var sql = "SELECT typecd,parentcd,typenm,datatable,url uri,concat(typecd,'(',ifnull(datatable,''),')') shownm FROM sys_mdm001";
// //   var sql = "SELECT typecd,parentcd,typenm,datatable,url uri,concat(typecd,'(',ifnull(datatable,''),')') shownm FROM testmdm001";
//   var param = [];
//   sql.query(sql,param);
//   var result = sys.result.result;
//   list.add(result,{typecd:0,parentcd:0,typenm:"",shownm:"",open:true,uri:"",datatable:""});
//   //将datatable字段为空的节点设为isParent
// //   for(r in result){
// //       if(sys.trim(r.datatable)==""){
// //           map.put(r,"isParent",true);
// //       }
// //   }
//   sys.setRetData("0","","result");
  
  
//异步加载
var parentcd=sys.request.typecd;
var sql="select typecd,parentcd,typenm,shortkey,standard,datatable,url uri,version,status,mark,createdt,updatedt,(select count(*) from sys_mdm001 where parentcd=a.typecd) isparent from sys_mdm001 a where ";
if(parentcd==null){
    sql=sql+" parentcd='ROOT' or typecd='ROOT'";
    sql.query(sql,null,"data");
    for(r in sys.result.data){
        if(r.typecd=="ROOT"){
            map.put(r,"open",true);
            break;
        }
    }
}else{
    sql=sql+" parentcd=?";
    sql.query(sql,[parentcd],"data");
}
var data=sys.result.data;
for(d in data){
  //添加shownm（即title）
  if(d.datatable==""){
      map.put(d,"shownm",d.typecd);
  }else{
      map.put(d,"shownm",d.typecd+"("+d.datatable+")");
  }
  //添加nodenm
  if(d.datatable=="sys_mdm002"){
    map.put(d,"nodenm",d.typecd+" "+d.typenm+" "+d.version);
  }else{
    // ROOT根节点以外显示typecd
    if (d.typecd == "ROOT") {
      map.put(d,"nodenm",d.typenm);
    } else {
      map.put(d,"nodenm",d.typecd+" "+d.typenm);
    }
  }
  //添加isParent
  if(d.isparent != "0"){
      map.put(d,"isParent",true);
  }else{
      map.put(d,"isParent",false);
  }
  //添加optype
  map.put(d,"optype","1");
}
  
//权限过滤
var data2=[];
var res=http.platformGet({"app":"d2c8511b47714faba5c71506a5029d94","mod":"mdmauth","api":"gettypecdauth"});
if(res.data.ret=="0"){
    var resultMap=res.data.resultMap;
    var resultList=res.data.resultList;
    //res.data.enable=false时不进行权限过滤
    if(res.data.enable && resultList){
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

sys.printValue(sys.result.result)
sys.addRetData(data2,"result");
sys.setRetData("0","","result");