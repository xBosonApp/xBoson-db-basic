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
//清空平台数据字典缓存_CACHE_REGION_MDM_
se.delCache(_CACHE_REGION_MDM_);

// 使用单独连接避免替换 Schema
sql.connection("00000000000000000000000000000000");

//已初始化db的机构
var orgs=se.getCache(_CACHE_REGION_TENANT_,_CACHE_KEY_INIT_ORG_);

for(org in orgs){
    //判断数据库类型
    var dbType = se.dbType();
    //01 MySQL, 02 SQLServer, 03 Oracle, 04 DB2
    var sqlinfo1;
    //数据字典大类
    var sqltype1="select typecd,version from "+org+".sys_mdm001 where datatable='sys_mdm002' and status='1'";
    if(dbType == '01')
    {
     //数据字典详细
     sqlinfo1="select typecd, version, dictcd id, dictnm name, concat(dictnm, '(', ifnull(shortkey,''), ')') text from "+org+".sys_mdm002 where status='1' order by typecd asc,dictcd desc ";   
    }else if(dbType == '02'){
    //数据字典详细
     sqlinfo1="select typecd, version, dictcd id, dictnm name, dictnm + '(' + isnull(shortkey,'') + ')' text from "+org+".sys_mdm002 where status='1' order by typecd asc,dictcd desc ";    
    }else if(dbType == '03'){
    //数据字典详细
     sqlinfo1="select typecd, version, dictcd id, dictnm name, dictnm ||'('|| nvl(shortkey,'') || ')' text from "+org+".sys_mdm002 where status='1' order by typecd asc,dictcd desc ";    
    }
    
    //若机构没有sys_mdm001,sys_mdm002，则抛异常
    var iscatch=false;
    try{
        sql.query(sqltype1,null,"type");
        sql.query(sqlinfo1,null,"info");
    }catch(error){
        iscatch=true;
        sys.printValue(error);
    }
    if(iscatch){
        continue;
    }
    
    var typelist=sys.result["type"];
    var infolist=sys.result["info"];
    // //将typelist放到cnvlist中
    // var cnvlist=[];
    // for(r in typelist){
    //   list.add(cnvlist, r);
    // }
    // //拼接
    // for(r in cnvlist){
    //     var tmplist=[];
    //     for(info in infolist){
    //         var ismatched=true;
    //         if(r.typecd != info.typecd){
    //             ismatched=false;
    //         }
    //         if(ismatched){
    //             map.remove(info,"typecd");
    //             list.add(tmplist,info);
    //         }
    //     }
    //     if(sys.size(tmplist)>0){
    //         map.put(r,"children",tmplist);
    //     }
    // }
    // for(r in cnvlist){
    //   se.setCache(_CACHE_REGION_MDM_, r.typecd, r.children, 0);
    // }
    try{
    for (var i = sys.size(typelist) - 1; i >= 0; i--) {
      var rType = typelist[i];
      var tmplist=[];
      for (var j = sys.size(infolist) - 1; j >= 0; j--) {
        var rInfo = infolist[j];
        if (rType["typecd"] == rInfo["typecd"] && rType["version"] == rInfo["version"]) {
            map.remove(rInfo, "typecd");
            list.add(tmplist, rInfo);
            list.removeAt(infolist, j);
        }
      }
      if (sys.size(tmplist) > 0) {
        map.put(rType, "children", tmplist);
      }
    }
    for(r in typelist){
        // try{
            se.setCache(_CACHE_REGION_MDM_, org+":"+r["typecd"], r["children"], 0);
        // }catch(e){
        //     sys.printValue(e);
        // }
    }
    }catch(e){
        sys.printValue(e);
    }
}

se.setCache(_CACHE_REGION_MDM_, _CACHE_KEY_READY_, true, 0);