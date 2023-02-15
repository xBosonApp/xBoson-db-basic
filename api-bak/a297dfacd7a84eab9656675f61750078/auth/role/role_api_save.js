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
//id: role_api_save
//name:保存角色权限
//参数:roleid,appid,moduleid,id
var org=sys.request.org;
var roleid=sys.request.roleid;
var appid=sys.request.appid;
var typecd=sys.request.typecd;
var moduleid=sys.request.moduleid;
var date2=sys.currentTimeString();
var app_t3=sys.request.app_t3;  //存放只有app层的appid
var id=sys.request.id;
if(roleid==null){
  sys.setRetData("1","角色ID为空");
  return;
}
var sqlrole="delete from sys_role_model where roleid=?";
sql.update(sqlrole,[roleid],"1");

if(typecd!=null){
    var typecd_arr=strutil.split(typecd,",");
    var modelparam=[];
    var sqlrole2="insert into sys_role_model (roleid,typecd,status,createdt,updatedt) values(?,?,?,?,?)";
    var status=1;
     var i=0;
    var typecdlent=typecd_arr.~size;
    while(i<typecdlent){
      modelparam=[roleid,typecd_arr[i],status,date2,date2];
      sql.update(sqlrole2,modelparam,"1");
      i=i+1;
    }
}



//保存之前先删除对应roleid的appid等信息
var param1=[roleid];
var sql1="delete from sys_role_api where roleid=?";
sql.update(sql1,param1,"1");


//第三方应用保存(只有app时的保存)
if (app_t3 != null) {
    var app_t3array=strutil.split(app_t3,",");
    if(app_t3array.~size>0){
      var j=0;
      var lent1=app_t3array.~size;
      var sql_t3="insert into sys_role_api (roleid,appid,moduleid,apiid,status,createdt,updatedt) values (?,?,'','','1',?,?)";
      while(j<lent1){
        var param_t3=[roleid,app_t3array[j],date2,date2];
        sql.update(sql_t3,param_t3,"1");
        j=j+1;
      }
    }
}
//当保存角色api，只有两级，app，mod时，没有其他的api时
if(id==null){
  id="";
}
if(appid!=null && moduleid!=null){
  var appid_array=strutil.split(appid,",");
  var moduleid_array=strutil.split(moduleid,",");
  var id_array=strutil.split(id,",");
  
  //添加对应roleid的appid等信息
  var param2=[];
  var sql2="insert into sys_role_api (roleid,appid,moduleid,apiid,status,createdt,updatedt) values (?,?,?,?,?,?,?)";
  var status="1";
  //api保存
  if(sys.size(appid_array)==sys.size(moduleid_array) && sys.size(moduleid_array)==sys.size(id_array)){
    var i=0;
    var lent=appid_array.~size;
    while(i<lent){
      param2=[roleid,appid_array[i],moduleid_array[i],id_array[i],status,date2,date2];
      sql.update(sql2,param2,"1");
      i=i+1;
    }
  } else {
    sql.rollback();
    sys.setRetData("2", "APP,模块,API数量不匹配");
    return;
  }
}
// 更新角色表的更新时间
var sqlUdp = "update sys_role set updatedt = ? where roleid = ?";
sql.update(sqlUdp,[date2,roleid],"1");

// 提交事务
sql.commit();

// 更新缓存
// orgid : roleid + appid + moduleid + apiid
var sqlOrgRoleApi = se.getCache(_CACHE_REGION_SYS_SQL_, "auth0002");
sql.query(sqlOrgRoleApi, null, "allrole");
var allrole=sys.result["allrole"];
for (row in allrole) {
  var app_mod_api = sys.toLowerCase(row["appid"] + row["moduleid"] + row["apiid"]);
  se.setCache(_CACHE_REGION_SYS_AUTHORITY_, org + ":" + row["roleid"] + ":" + app_mod_api, 0, 0);
}
// orgid : roleid + typecd
if(typecd!=null){
    sql.query("select typecd from sys_role_model where roleid=?",[roleid],"rolemodel");
    for(row in sys.result.rolemodel){
        se.setCache(_CACHE_REGION_SYS_AUTHORITY_, org + ":" + roleid + ":" + row["typecd"],0,0);
    }
}

sys.setRetData("0");