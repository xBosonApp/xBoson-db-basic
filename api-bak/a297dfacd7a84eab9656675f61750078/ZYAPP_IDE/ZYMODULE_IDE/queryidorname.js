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
//id:queryidorname
//name:根据id和name查找模块或api
//url:192.168.7.120:8088/ds/ide/queryidorname?
var org=sys.request.org;
var type=sys.request.type;  //mod：搜索模块，api：搜索api
var content=sys.request.content;    //关键字

var pid=sys.getUserPID();
var adminFlag=sys.getUserAdminFlag();
var roleid=sys.request.roleid;  //项目ID（角色ID）
if(roleid == null){
  sys.setRetData("1");
  return;
}
content="%"+content+"%";

    // 角色APP映射
var sql="";
    // sql=sql+"( select distinct sys_role_api.appid appid";
    // sql=sql+"  from sys_role_api,sys_role, (";
    // sql=sql+"    ( select roleid roleid from sys_user_role ";
    // sql=sql+"      where pid=? and status='1'";
    // sql=sql+"    ) union (";
    // sql=sql+"      select sys_dept_role.roleid roleid";
    // sql=sql+"      from sys_dept_role,sys_user_dept,mdm_dept,mdm_org";
    // sql=sql+"      where sys_dept_role.deptid=sys_user_dept.deptid";
    // sql=sql+"      and sys_user_dept.pid=?";
    // sql=sql+"      and sys_user_dept.deptid=mdm_dept.deptid";
    // sql=sql+"      and mdm_dept.orgid=mdm_org.orgid";
    // sql=sql+"      and sys_dept_role.status='1'";
    // sql=sql+"      and sys_user_dept.status='1'";
    // sql=sql+"      and mdm_dept.status='1'";
    // sql=sql+"      and mdm_org.status='1' ) ) role";
    // sql=sql+"  where sys_role_api.roleid=role.roleid";
    // sql=sql+"  and sys_role_api.roleid=sys_role.roleid";
    // sql=sql+"  and sys_role.roleid=?";  //项目ID
    // sql=sql+"  and sys_role.orgid=?";
    // sql=sql+"  and sys_role.status='1'";
    // sql=sql+"  and sys_role_api.status='1'";
    // sql=sql+") role_app ";

    sql=sql+"( select distinct sys_role_api.appid appid";
    sql=sql+"  from sys_role_api,sys_role ";
    sql=sql+"  where sys_role.roleid=?";
    sql=sql+"  and sys_role_api.roleid=sys_role.roleid";
    sql=sql+"  and sys_role.status='1'";
    sql=sql+"  and sys_role_api.status='1'";
    sql=sql+") role_app ";
//平台管理员查所有项目
if(adminFlag=="1" || adminFlag=="3" || adminFlag=="5"){
  sql="(select appid from sys_apps) role_app";
}
if(type=="mod"){
   //判断数据库类型
  var dbType = se.dbType();  // 01 MySQL, 02 SQLServer, 03 Oracle, 04 DB2
  var mod;
  if(dbType == "01"){
       mod="select temp.appid,apps.appnm apprealnm,apps.status appstatus,apps.about  appabout,apps.createdt appcreatedt,apps.updatedt appupdatedt,moduleid,modulenm,modulenm as appnm,temp.about,auflag,temp.status,temp.createdt,temp.updatedt,concat(temp.appid,'@',temp.moduleid) someid from sys_apps apps,";
    mod=mod+"(select modules.appid,moduleid,modulenm,modulenm as appnm,about,auflag,status,createdt,updatedt,concat(modules.appid,'@',moduleid) someid from sys_modules modules , "+sql+
    " where modules.appid=role_app.appid and (modules.moduleid like ? or modules.modulenm like ?)";  
    }else if(dbType == "02"){
        mod="select temp.appid,apps.appnm apprealnm,apps.status appstatus,apps.about  appabout,apps.createdt appcreatedt,apps.updatedt appupdatedt,moduleid,modulenm,modulenm as appnm,temp.about,auflag,temp.status,temp.createdt,temp.updatedt,temp.appid + '@' + temp.moduleid someid from sys_apps apps,";
    mod=mod+"(select modules.appid,moduleid,modulenm,modulenm as appnm,about,auflag,status,createdt,updatedt,modules.appid+'@'+ moduleid someid from sys_modules modules , "+sql+
    " where modules.appid=role_app.appid and (modules.moduleid like ? or modules.modulenm like ?)";   
    }else if(dbType == "03"){
      mod="select temp.appid,apps.appnm apprealnm,apps.status appstatus,apps.about  appabout,apps.createdt appcreatedt,apps.updatedt appupdatedt,moduleid,modulenm,modulenm as appnm,temp.about,auflag,temp.status,temp.createdt,temp.updatedt,temp.appid||'@'||temp.moduleid someid from sys_apps apps,";
    mod=mod+"(select modules.appid,moduleid,modulenm,modulenm as appnm,about,auflag,status,createdt,updatedt,modules.appid||'@'||moduleid someid from sys_modules modules , "+sql+
    " where modules.appid=role_app.appid and (modules.moduleid like ? or modules.modulenm like ?)";   
    }
    
    // if (adminFlag!='1') {
    // mod=mod+" and appid<>'ZYAPP_IDE' and appid<>'ZYAPP_MENU' and appid<>'ZYAPP_SYSMGT' and  appid<>'auth' ) temp";
    // }else{
        mod=mod+") temp";
    // }
    mod=mod+" where apps.appid=temp.appid ";
    var mod_param=[roleid,content,content];
    //平台管理员查所有项目
    if(adminFlag=="1" || adminFlag=="3" || adminFlag=="5"){
      mod_param=[content,content];
    }
    sql.query(mod,mod_param,"res");
    var res=sys.result.res;
    //添加isParent字段
    var temp=[];
    for(r in res){
        var tempObj={"appid":r.appid,"apprealnm":r.apprealnm,"moduleid":r.moduleid,"modulenm":r.modulenm,"appnm":r.appnm,"about":r.about,"auflag":r.auflag,"status":r.status,"isParent":true,"createdt":r.createdt,"updatedt":r.updatedt,"someid":r.someid,"appabout":r.appabout,"appstatus":r.appstatus,"appcreatedt":r.appcreatedt,"appupdated":r.appupdatedt,"showid":r.moduleid};
        @temp.add(tempObj);
    }
    //组装数据
    var apptemp=[];
    for(r in temp){
      var temap={"appid":r.appid,"appnm":r.apprealnm,"isParent":true,"someid":r.appid,"about":r.appabout,"status":r.appstatus,"createdt":r.appcreatedt,"updatedt":r.appupdatedt,"open":true,"showid":r.appid};
      if(apptemp.~size==0){
          @apptemp.add(temap);
      }else{
          var exist=false;
          for(at in apptemp){
             if(at.appid==temap.appid  && at.appid==temap.appid){
              exist=true;
             }
          }
         if(!exist){
           @apptemp.add(temap); 
         }
      }
    }
    sys.setRetList(apptemp,temp,[["appid","appid"]],"children");
    sys.addRetData(apptemp,"result");
    // sys.addRetData(temp,"result");
}else{
    //判断数据库类型
  var dbType = se.dbType();  // 01 MySQL, 02 SQLServer, 03 Oracle, 04 DB2
  var api;
  if(dbType == "01"){
     api="select temp.appid,apps.appnm apprealnm,apps.status appstatus,apps.about  appabout,apps.createdt appcreatedt,apps.updatedt appupdatedt,temp.moduleid,modules.modulenm,modules.auflag,modules.status  modstatus,modules.about modabout,modules.createdt modcreatedt,modules.updatedt modupdatedt,temp.apiid,apinm,temp.appnm,op_type,contentid,temp.status,temp.createdt,temp.updatedt,concat(temp.appid,'@',temp.moduleid,'@',temp.apiid) someid,temp.stability from sys_apps apps ,sys_modules modules, ";
    api=api+"(select apis.appid,apis.moduleid,apis.apiid,apinm,apinm as appnm,op_type,apis.contentid,apis.status,apis.createdt,apis.updatedt,concat(apis.appid,'@',apis.moduleid,'@',apis.apiid) someid,content.stability from sys_apis apis ,sys_api_content content, "
    +sql+
    "  where content.contentid=apis.contentid and apis.appid=role_app.appid and (apis.apiid like ? or apinm like ?)";
  }else if(dbType == "02"){
     api="select temp.appid,apps.appnm apprealnm,apps.status appstatus,apps.about  appabout,apps.createdt appcreatedt,apps.updatedt appupdatedt,temp.moduleid,modules.modulenm,modules.auflag,modules.status  modstatus,modules.about modabout,modules.createdt modcreatedt,modules.updatedt modupdatedt,temp.apiid,apinm,temp.appnm,op_type,contentid,temp.status,temp.createdt,temp.updatedt,temp.appid + '@' + temp.moduleid+ '@'+ temp.apiid  someid,temp.stability from sys_apps apps ,sys_modules modules, ";
    api=api+"(select apis.appid,apis.moduleid,apis.apiid,apinm,apinm as appnm,op_type,apis.contentid,apis.status,apis.createdt,apis.updatedt,apis.appid +'@'+ apis.moduleid+ '@'+ apis.apiid  someid,content.stability from sys_apis apis ,sys_api_content content, "
    +sql+
    "  where content.contentid=apis.contentid and apis.appid=role_app.appid and (apis.apiid like ? or apinm like ?)"; 
  }else if(dbType == "03"){
     api="select temp.appid,apps.appnm apprealnm,apps.status appstatus,apps.about  appabout,apps.createdt appcreatedt,apps.updatedt appupdatedt,temp.moduleid,modules.modulenm,modules.auflag,modules.status  modstatus,modules.about modabout,modules.createdt modcreatedt,modules.updatedt modupdatedt,temp.apiid,apinm,temp.appnm,op_type,contentid,temp.status,temp.createdt,temp.updatedt,temp.appid|| '@'|| temp.moduleid||'@'|| temp.apiid  someid,temp.stability from sys_apps apps ,sys_modules modules, ";
    api=api+"(select apis.appid,apis.moduleid,apis.apiid,apinm,apinm as appnm,op_type,apis.contentid,apis.status,apis.createdt,apis.updatedt,apis.appid ||'@'||apis.moduleid ||'@'|| apis.apiid  someid,content.stability from sys_apis apis ,sys_api_content content, "
    +sql+
    "  where content.contentid=apis.contentid and apis.appid=role_app.appid and (apis.apiid like ? or apinm like ?)"; 
  }
    // if (adminFlag!='1') {
    // api=api+" and apis.appid<>'ZYAPP_IDE' and apis.appid<>'ZYAPP_MENU' and apis.appid<>'ZYAPP_SYSMGT' and  apis.appid<>'auth' ) temp";
    // }else{
        api=api+") temp";
    // }
    // jym: 把表名放在 from 的开始, 使 sachme 替换正确
    api=api+" where apps.appid=temp.appid and modules.moduleid=temp.moduleid and apps.appid=modules.appid";
    var mod_param=[roleid,content,content];
    //平台管理员查所有项目
    if(adminFlag=="1" || adminFlag=="3" || adminFlag=="5"){
      mod_param=[content,content];
    }
    sql.query(api,mod_param,"res");
    var res=sys.result.res;
    
    //为tree节点显示的name加上（稳定性状态）
    var _tmp = se.getCache(_CACHE_REGION_MDM_, _ORGID_PLATFORM_+":ZR.0030");
    for(v in res){
      var _name = "";
      if(_tmp != null){
        for(t in _tmp){
          if(t.id == v.stability){
            _name = t.name;
            break;
          }
        }
      }
      _name = "("+_name+")"+v.appnm;
      map.put(v,"appnm", _name);
    }

  // for(v in res){
  //         var _tmp = se.getCache(_CACHE_REGION_MDM_, _ORGID_PLATFORM_+":ZR.0030");
  //         var _name = "";
  //         if(_tmp != null){
  //           for(t in _tmp){
  //                 if(t.id == v.stability){
  //                     _name = t.name;
  //                 }
  //             } 
  //         }
          
  //         _name = "("+_name+")"+v.appnm;
  //         map.put(v,"appnm", _name);
  // }
    //添加isParent字段
    var temp=[];
    for(r in res){
        var tempObj={"appid":r.appid,"apprealnm":r.apprealnm,"moduleid":r.moduleid,"modulenm":r.modulenm,"apiid":r.apiid,"apinm":r.apinm,"appnm":r.appnm,"optype":r.op_type,"contentid":r.contentid,"status":r.status,"isParent":true,"createdt":r.createdt,"updatedt":r.updatedt,"someid":r.someid,"appabout":r.appabout,"appstatus":r.appstatus,"appcreatedt":r.appcreatedt,"appupdated":r.appupdatedt,"modabout":r.modabout,"modstatus":r.modstatus,"modcreatedt":r.modcreatedt,"modupdatedt":r.modupdatedt,"auflag":r.auflag,"showid":r.apiid};
        @temp.add(tempObj);
    }
    //组装数据
    var apptemp=[], modtemp=[];
    for(r in temp){
      var temap={"appid":r.appid,"appnm":r.apprealnm,"isParent":true,"someid":r.appid,"about":r.appabout,"status":r.appstatus,"createdt":r.appcreatedt,"updatedt":r.appupdatedt,"open":true,"showid":r.appid};
      if(apptemp.~size==0){
          @apptemp.add(temap);
      }else{
          var exist=false;
          for(at in apptemp){
             if(at.appid==temap.appid){
              exist=true;
             }
          }
         if(!exist){
           @apptemp.add(temap); 
         }
      }
      
      temap={"appid":r.appid,"moduleid":r.moduleid,"modulenm":r.modulenm,"appnm":r.modulenm,"isParent":true,"someid":r.appid+"@"+r.moduleid,"auflag":r.auflag,"about":r.modabout,"status":r.modstatus,"createdt":r.modcreatedt,"updatedt":r.modupdatedt,"open":true,"showid":r.moduleid};
      if(modtemp.~size==0){
          @modtemp.add(temap);
      }else{
          var exist=false;
          for(mt in modtemp){
            if(mt.moduleid==temap.moduleid && mt.appid==temap.appid){
              exist=true;
            }
          }
          if(!exist){
            @modtemp.add(temap);
          }
      }
    }
    // sys.printValue(apptemp,modtemp); //测试
    sys.setRetList(modtemp,temp,[["moduleid","moduleid"],["appid","appid"]],"children");
    sys.setRetList(apptemp,modtemp,[["appid","appid"]],"children");
    sys.addRetData(apptemp,"result");
}
sys.setRetData("0","","result");