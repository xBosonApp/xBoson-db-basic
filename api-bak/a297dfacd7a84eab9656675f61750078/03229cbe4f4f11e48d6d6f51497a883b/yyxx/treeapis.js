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
// 根据用户个人权限显示能看到的APP列表，仅平台管理员可以查询到IDE，MENU和智云系统管理，授权管理应用
  // HTTP 请求参数
  var id = sys.request.id;
  var status = sys.request.status;
  var orgid = sys.request.org;
  var openid=sys.request.openid;
  //获得当前登录用户的pid
  var pid=sys.getUserPID(openid);
  
  var roleid=sys.request.roleid;
  if(roleid == null){
      sys.setRetData("1");
      return;
  }
  if (id == null) {
    id = "";
  }
  var sql = "";
  var param = [];
  var queryIds = strutil.split(id, "@");
  var len = queryIds.~size;
  switch (len) {
    case 1:
      if (id == "") {
        // APP
//   var adminFlag = sys.getUserAdminFlag(openid,orgid);
        sql="select app.appid someid,'' belongto,app.appid,app.appid showid,app.appnm,app.about,app.status,app.createdt,app.updatedt from "+orgid+".sys_apps app,";
    sql=sql+"( select distinct sys_role_api.appid appid";
    sql=sql+"  from "+orgid+".sys_role_api sys_role_api,"+orgid+".sys_role sys_role, (";
    sql=sql+"    ( select roleid roleid from "+orgid+".sys_user_role ";
    sql=sql+"      where pid=? and status='1'";
    sql=sql+"    ) union (";
    sql=sql+"      select sys_dept_role.roleid roleid";
    sql=sql+"      from "+orgid+".sys_dept_role sys_dept_role,"+orgid+".sys_user_dept sys_user_dept,"+orgid+".mdm_dept mdm_dept,"+orgid+".mdm_org mdm_org";
    sql=sql+"      where sys_dept_role.deptid=sys_user_dept.deptid";
    sql=sql+"      and sys_user_dept.pid=?";
    sql=sql+"      and sys_user_dept.deptid=mdm_dept.deptid";
    sql=sql+"      and mdm_dept.orgid=mdm_org.orgid";
    sql=sql+"      and sys_dept_role.status='1'";
    sql=sql+"      and sys_user_dept.status='1'";
    sql=sql+"      and mdm_dept.status='1'";
    sql=sql+"      and mdm_org.status='1' ) ) role";
    sql=sql+"  where sys_role_api.roleid=role.roleid";
    if(roleid!=null){
        sql=sql+"  and sys_role.roleid=?";
    }
    
    sql=sql+"  and sys_role_api.roleid=sys_role.roleid";
    sql=sql+"  and sys_role.orgid=?";
    sql=sql+"  and sys_role.status='1'";
    sql=sql+"  and sys_role_api.status='1'";
    sql=sql+") role_app where app.appflag='0' and app.appid=role_app.appid ";
    //     if (adminFlag!='1') {
    // sql=sql+"and app.appid<>'ZYAPP_IDE' and app.appid<>'ZYAPP_MENU' and app.appid<>'ZYAPP_SYSMGT' and app.appid<>'auth' ";
    //     }
        @param.add(pid);
        @param.add(pid);
        if(roleid!=null){
            @param.add(roleid);
        }
        
        @param.add(orgid);
        if (status != null) {
          sql = sql + "and app.status = ? ";
          @param.add(status);
        }
        sql = sql + "order by app.appnm";
      } else {
        // 模块
        var appid = id;
        //判断数据库类型
        var dbType = se.dbType();  // 01 MySQL, 02 SQLServer, 03 Oracle, 04 DB2
        if(dbType == "01"){
          sql = "select concat(appid,'@',moduleid) someid, concat(appid) belongto, appid, moduleid,moduleid showid, concat(modulenm) appnm, about, status, createdt, updatedt ,modulenm ,auflag from "+orgid+".sys_modules where (auflag = '0' or auflag = '2') and appid = ? ";  
        }else if(dbType == "02"){
           sql = "select appid + '@'+ moduleid someid, appid as belongto, appid, moduleid,moduleid showid, modulenm as appnm, about, status, createdt, updatedt ,modulenm ,auflag from "+orgid+".sys_modules where (auflag = '0' or auflag = '2') and appid = ? "; 
        }else if(dbType == "03"){
           sql = "select appid||'@'||moduleid someid, appid as belongto, appid, moduleid,moduleid showid, modulenm as appnm, about, status, createdt, updatedt ,modulenm ,auflag from "+orgid+".sys_modules where (auflag = '0' or auflag = '2') and appid = ? "; 
        }
        @param.add(appid);
        if (status != null) {
          sql = sql + "and status = ? ";
          @param.add(status);
        }
        sql = sql + "order by appnm ";
      }
      break;
    case 2:
      // API
      var appid = queryIds[0];
      var moduleid = queryIds[1];
      //判断数据库类型
       var dbType = se.dbType();  // 01 MySQL, 02 SQLServer, 03 Oracle, 04 DB2
       if(dbType == "01"){
         sql = "select concat(appid,'@',moduleid,'@',apiid) someid, concat(appid,'@',moduleid) belongto, appid, moduleid, apiid, apiid showid, apinm appnm, sys_apis.contentid, sys_apis.status, sys_apis.createdt, sys_apis.updatedt,apinm,op_type optype,sys_api_content.stability from "+orgid+".sys_apis sys_apis , "+orgid+".sys_api_content sys_api_content where sys_apis.contentid=sys_api_content.contentid  and appid = ? and moduleid = ? ";
        }else if(dbType == "02"){
         sql = "select appid + '@' + moduleid+ '@'+ apiid someid, appid+'@'+moduleid  belongto, appid, moduleid, apiid, apiid showid, apinm appnm, sys_apis.contentid, sys_apis.status, sys_apis.createdt, sys_apis.updatedt,apinm,op_type optype,sys_api_content.stability from "+orgid+".sys_apis sys_apis , "+orgid+".sys_api_content sys_api_content where sys_apis.contentid=sys_api_content.contentid  and appid = ? and moduleid = ? ";   
        }else if(dbType == "03"){
        sql = "select appid|| '@'|| moduleid ||'@'+ apiid someid, appid|| '@'|| moduleid  belongto, appid, moduleid, apiid, apiid showid, apinm appnm, sys_apis.contentid, sys_apis.status, sys_apis.createdt, sys_apis.updatedt,apinm,op_type optype,sys_api_content.stability from "+orgid+".sys_apis sys_apis , "+orgid+".sys_api_content sys_api_content where sys_apis.contentid=sys_api_content.contentid  and appid = ? and moduleid = ? ";    
        }
      @param.add(appid);
      @param.add(moduleid);
      if (status != null) {
        sql = sql + " where sys_apis.status = ? ";
        @param.add(status);
      }
      sql = sql + "order by appnm ";
      break;
    case 3:
      // API 历史
      var appid = queryIds[0];
      var moduleid = queryIds[1];
      var apiid = queryIds[2];
       //判断数据库类型
       var dbType = se.dbType();  // 01 MySQL, 02 SQLServer, 03 Oracle, 04 DB2
       if(dbType == "01"){
      sql = "select concat(appid,'@',moduleid,'@',apiid,'@',hisid) someid, concat(appid,'@',moduleid,'@',apiid) belongto, hisid, appid, moduleid, apiid,apinm,apiid showid,apis.status,apihis.updatedt,apihis.updatedt appnm,updatecmt,apihis.stability,apis.op_type from "+orgid+".sys_api_his_content apihis , "+orgid+".sys_apis apis where apis.contentid = apihis.contentid  and appid = ? and moduleid = ? and apiid = ?";
       }else if(dbType == "02"){
        sql = "select appid + '@'+ moduleid+ '@'+ apiid + '@'+ hisid someid,appid+'@'+ moduleid + '@'+ apiid belongto, hisid, appid, moduleid, apiid,apinm,apiid showid,apis.status,apihis.updatedt,apihis.updatedt appnm,updatecmt,apihis.stability,apis.op_type from "+orgid+".sys_api_his_content apihis , "+orgid+".sys_apis apis where apis.contentid = apihis.contentid  and appid = ? and moduleid = ? and apiid = ?";   
       }else if(dbType == "03"){
        sql = "select appid||'@'||moduleid ||'@'|| apiid ||'@'||hisid someid, appid|| '@'|| moduleid ||'@'|| apiid belongto, hisid, appid, moduleid, apiid,apinm,apiid showid,apis.status,apihis.updatedt,apihis.updatedt appnm,updatecmt,apihis.stability,apis.op_type from "+orgid+".sys_api_his_content apihis , "+orgid+".sys_apis apis where apis.contentid = apihis.contentid  and appid = ? and moduleid = ? and apiid = ?";   
       }
      @param.add(appid);
      @param.add(moduleid);
      @param.add(apiid);
      sql = sql + " order by apihis.updatedt desc ";
      break;
    default:
      sys.setRetData("2");
      return;
  }
  sql.query(sql, param, "value");
  var value = sys.result.value;
    //为tree节点显示的name加上（稳定性状态）
  if(len == 3 || len == 2){
      for(v in value){
          var _tmp = se.getCache(_CACHE_REGION_MDM_, _ORGID_PLATFORM_+":ZR.0030");
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
  }
  sys.setRetData("0", "", "value");