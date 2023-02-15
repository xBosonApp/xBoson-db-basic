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
var openid=sys.request.openid;
var typecd=sys.request.typecd;  //如果传此参数，则返回此typecd的optype{0,1}
// if(typecd==null){
//     sys.setRetData("1");
//     return;
// }
var pid= openid ? sys.getUserPID(openid) : sys.getUserPID();

//获取所有业务权限
sql.query("select typecd,parentcd from sys_bm001",null,"allTypecdR");
var allTypecdMap={};
for(r in sys.result.allTypecdR){
    map.put(allTypecdMap,r.typecd,r.parentcd);
}

//获取用户业务模型权限信息（sys_role_model）
sql.query("select typecd from sys_role_model where roleid in (select roleid from sys_user_role where pid=?) or roleid in (select roleid from sys_dept_role where deptid in (select deptid from sys_user_dept where pid=?))",[pid,pid],"user_authR");
var typecdArr=[];
for(r in sys.result.user_authR){
    if(!list.contain(typecdArr,r.typecd)){
        list.add(typecdArr,r.typecd);    
    }
}
//获取在MDDM.MDM.AUTH下的typecd
var typecdArr2=[];
var tmpTypecd="";
for(r in typecdArr){
    tmpTypecd=r;
    while(true){
        if(tmpTypecd==null){
            break;    
        }
        if(tmpTypecd=="MDDM.MDM.AUTH"){
            list.add(typecdArr2,r);
            break;
        }
        tmpTypecd=allTypecdMap[tmpTypecd];
    }
}
var start=date.currentTimeMillis();
//执行typecdArr2的业务模型typecd，获取返回结果
var authRes=[];
for(r in typecdArr2){
    var res=http.platformGet({"app":"c770045becc04c7583f626faacd3b456","mod":"commapi","api":"exc_select"},{"modolcd":r});
    if(res.data.ret=="0"){
        for(rr in res.data.data){
            list.add(authRes,{"typecd":rr.typecd,"optype":rr.optype});
        }
    }
}
if(sys.size(authRes)==0){
    sys.addRetData(false,"enable");
    sys.setRetData("0","","enable");
    return;
}
sys.printValue(date.currentTimeMillis()-start);
var authResMap={};
var authResTypecdArr=[];
for(r in authRes){
    map.put(authResMap,r.typecd,r.optype);
    list.add(authResTypecdArr,r.typecd);
}

start=date.currentTimeMillis();
//获取所有主数据typecd
sql.query("select typecd,parentcd from sys_mdm001",null,"allMdmTypecdR");
var allMdmTypecdMap={};
for(r in sys.result.allMdmTypecdR){
    map.put(allMdmTypecdMap,r.typecd,r.parentcd);
}
sys.printValue(authResTypecdArr);
//获取所有authResTypecdArr下层的节点(包括自身)
var resultTypecdArr=[],_resultTypecdArr0=[];
tmpTypecd="";
for(r in sys.result.allMdmTypecdR){
    tmpTypecd=r.typecd;
    while(true){
        if(tmpTypecd==null){
            break;
        }
        if(list.contain(authResTypecdArr,tmpTypecd)){
            list.add(resultTypecdArr,{"typecd":r.typecd,"optype":authResMap[tmpTypecd]});
            list.add(_resultTypecdArr0,r.typecd);
            break;
        }
        //向上递归
        tmpTypecd=allMdmTypecdMap[tmpTypecd];
    }
}
//获取所有authResTypecdArr上层的节点
tmpTypecd="";
for(r in authResTypecdArr){
    tmpTypecd=allMdmTypecdMap[r];
    while(true){
        if(tmpTypecd==null){
            break;
        }
        if(!list.contain(_resultTypecdArr0,tmpTypecd)){
            list.add(_resultTypecdArr0,tmpTypecd);
            list.add(resultTypecdArr,{"typecd":tmpTypecd});    
        }
        tmpTypecd=allMdmTypecdMap[tmpTypecd];
    }
}
sys.printValue(date.currentTimeMillis()-start);
//resultMap resultList
var resultMap={},resultList=[];
for(r in resultTypecdArr){
    map.put(resultMap,r.typecd,r.optype);
    list.add(resultList,r.typecd);
}
if(typecd==null){
    sys.addRetData(true,"enable");
    sys.addRetData(resultTypecdArr,"result");
    sys.addRetData(resultMap,"resultMap");
    sys.addRetData(resultList,"resultList");
    sys.setRetData("0","","result","resultMap","resultList","enable");
}else{
    sys.addRetData(true,"enable");
    sys.addRetData(resultMap[typecd],"optype");
    sys.setRetData("0","","optype","enable");
}