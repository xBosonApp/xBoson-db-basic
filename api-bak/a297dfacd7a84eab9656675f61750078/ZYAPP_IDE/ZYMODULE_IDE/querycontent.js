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
//id:querycontent
//name:根据关键字查询所有api内容
//var orgid=sys.request.org;
var appid=sys.request.appid;
var keyword=sys.request.content;    //搜索关键字
var casesensitive=sys.request.casesensitive;    //是否区分大小写

var pid=sys.getUserPID();
var roleid=sys.request.roleid;  //项目组的角色ID
if(roleid == null){
  sys.setRetData("1", "项目未指定");
  return;
}
var adminFlag=sys.getUserAdminFlag();
//角色app映射
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
    // sql=sql+"  and sys_role.roleid=?";
    // sql=sql+"  and sys_role_api.roleid=sys_role.roleid";
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

var param=[roleid];
//平台管理员查所有项目
if(adminFlag=="1" || adminFlag=="3" || adminFlag=="5"){
  sql="(select appid from sys_apps) role_app";
  param=[];
}

var allapi="select apis.appid,apps.appnm apprealnm,apps.about appabout,apps.appflag,apps.status appstatus,apps.createdt appcreatedt,apps.updatedt appupdatedt,apis.moduleid,modu.modulenm,modu.about modabout,modu.auflag,modu.status modstatus,modu.createdt  modcreatedt,modu.updatedt modupdatedt,apis.apiid,apinm,apinm as appnm,op_type   optype,apis.contentid,apis.status,apis.createdt,apis.updatedt,sys_api_content.content,sys_api_content.zip,sys_api_content.stability from sys_apis apis,sys_api_content,sys_apps apps,"+sql+" ,sys_modules modu where apps.appid=apis.appid and apis.contentid=sys_api_content.contentid  and modu.moduleid=apis.moduleid and modu.appid=apis.appid and role_app.appid=apis.appid ";

if(appid!=null){
  allapi=allapi+" and apis.appid=? ";
  list.add(param, appid);
}
// if (adminFlag!='1') {
//     allapi=allapi+" apis.appid<>'ZYAPP_IDE' and apis.appid<>'ZYAPP_MENU' and apis.appid<>'ZYAPP_SYSMGT' and  apis.appid<>'auth'";
// }else{
    // allapi=allapi+" 1=1 ";
// }

// sql.query(allapi,param,"res");
se.query(allapi,param,"res");
// sys.printValue(sys.result.res)
// sys.printValue(allapi)

var test=null;
var res=sys.result.res;
//为tree节点显示的name加上（稳定性状态）
var _tmp = se.getCache(_CACHE_REGION_MDM_, _ORGID_PLATFORM_+":ZR.0030");
for(v in res){
  var _name = "";
  if(_tmp != null){
      for(t in _tmp){
          if(t.id == v.stability){
              _name = t.name;
          }
      }
  }
  _name = "("+_name+")"+v.appnm;
  map.put(v,"appnm", _name);
}
//是否区分大小写
if(casesensitive=="false"){
    test=ide.searchApiContent(keyword,res,false);
}else{
    test=ide.searchApiContent(keyword,res,true);
}
//如果没有匹配项则返回
if(test==null){
    sys.addRetData([],"result");
    sys.setRetData("0","","result");
    return;
}
//将数据组装成tree数据源
var treeApp=[];
var treeMod=[];
var treeApi=[];

for(r in test){
    //test里的api name增加stability信息
    var temapi={"someid":r.appid+"@"+r.moduleid+"@"+r.apiid,"appid":r.appid,"apprealnm":r.apprealnm,"appabout":r.appabout,"appflag":r.appflag,"appstatus":r.appstatus,"appcreatedt":r.appcreatedt,"appupdatedt":r.appupdatedt,"moduleid":r.moduleid,"modulenm":r.modulenm,"modabout":r.modabout,"auflag":r.auflag,"modstatus":r.modstatus,"modcreatedt":r.modcreatedt,"modupdatedt":r.modupdatedt,"apiid":r.apiid,"apinm":r.apinm,"appnm":r.appnm,"optype":r.optype,"contentid":r.contentid,"status":r.status,"createdt":r.createdt,"updatedt":r.updatedt,"isParent":true,"showid":r.apiid};
    @treeApi.add(temapi);
    //向treeApp装数据
    var temapp={"appid":r.appid,"appnm":r.apprealnm,"isParent":true,"someid":r.appid,"about":r.appabout,"status":r.appstatus,"createdt":r.appcreatedt,"updatedt":r.appupdatedt,"open":true,"showid":r.appid};
    if(treeApp.~size==0){
          @treeApp.add(temapp);
      }else{
          var exist=false;
          for(at in treeApp){
             if(at.appid==temapp.appid){
              exist=true;
             }
          }
         if(!exist){
           @treeApp.add(temapp); 
         }
      }
      
    var modtemp={"appid":r.appid,"moduleid":r.moduleid,"modulenm":r.modulenm,"appnm":r.modulenm,"isParent":true,"someid":r.appid+"@"+r.moduleid,"auflag":r.auflag,"about":r.modabout,"status":r.modstatus,"createdt":r.modcreatedt,"updatedt":r.modupdatedt,"open":true,"showid":r.moduleid};
      if(treeMod.~size==0){
          @treeMod.add(modtemp);
      }else{
          var exist=false;
          for(mt in treeMod){
            if(mt.moduleid==modtemp.moduleid && mt.appid==modtemp.appid){
              exist=true;
            }
          }
          if(!exist){
            @treeMod.add(modtemp);
          }
      }
}
sys.setRetList(treeMod,treeApi,[["moduleid","moduleid"],["appid","appid"]],"children");
sys.setRetList(treeApp,treeMod,[["appid","appid"]],"children");

sys.addRetData(treeApp,"result");
sys.setRetData("0","","result");