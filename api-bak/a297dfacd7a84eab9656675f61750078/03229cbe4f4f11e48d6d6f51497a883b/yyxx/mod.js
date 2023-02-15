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
// http://localhost:8080/ds/ide/mod?app=mdm&org=zr&s=d&openid=dean&type=0&appid=z&modid=z&nm=znm&about=about&status=1
  // http://localhost:8080/ds/ide/mod?app=mdm&org=zr&s=d&openid=dean&type=1&appid=z&modid=z&nm=znm1&about=about&status=1

  // HTTP 请求参数
  var type = sys.request.type;
  var appId = sys.request.appid;
  var modId = sys.request.moduleid;
  var modNm = sys.request.modulenm;
  var about = sys.request.about;
  var auflag = sys.request.auflag;
  var status = sys.request.status;
  var orgid=sys.request.org;
  var roleid=sys.request.roleid;

  // 验证必要参数
  if (type == null || appId == null || modId == null || roleid == null) {
    sys.setRetData("1");
    return;
  }

  // 验证操作类型
  if (type != "0" && type != "1") {
    sys.setRetData("2");
    return;
  }
  //设置返回数据
  var ret=[];

  // 验证 APPID, ModuleID 是否已经存在
  var sqlModCnt = "select count(*) cnt from "+orgid+".sys_apps sys_apps, "+orgid+".sys_modules sys_modules where sys_apps.appid = sys_modules.appid and sys_apps.appflag = '0' and sys_modules.auflag = '0' and sys_modules.appid = ? and sys_modules.moduleid = ?";
  var paramModCnt = [appId, modId];
  sql.query(sqlModCnt, paramModCnt, "modcnt");
  var modCntRet = sys.result.modcnt;
  var modCnt = "";
  for (mcr in modCntRet) {
    modCnt = mcr.cnt;
  }

  var sqlMod = "";
  var param = [];

  if (type == "0") {  // 创建操作
  
    // //不允许创建模块
    // sys.setRetData("900");
    // return;
    // 存在：返回错误，处理结束 
    if (modCnt != "0") {
      sys.setRetData(6);
      return;
    }

    // 根据请求数据向 modules 表中插入一条新数据
    sqlMod = "insert into "+orgid+".sys_modules (appid, moduleid, modulenm, about, auflag, status, createdt, updatedt) values (?, ?, ?, ?, ?, ?, ?, ?);";
    var currentTime = sys.getCurrentTimeString();
    var newModStatus = status;
    if (newModStatus == null) {
      newModStatus = "1";
    }
    param = [appId, modId, modNm, about, auflag, newModStatus, currentTime, currentTime];
    ret=[{"appid":appId,"moduleid":modId,"modulenm":modNm,"about":about,"auflag":auflag,"status":status,"createdt":currentTime,"updatedt":sys.getCurrentTimeString(),"appnm":modNm,"someid":appId+"@"+modId,"isParent":true}];
    //将创建的mod付给项目角色id
    var authRoleSql="insert into sys_role_api (roleid,appid,moduleid,apiid,status,createdt,updatedt) values (?,?,?,?,?,?,?)";
    sql.update(authRoleSql,[roleid,appId,modId,"","1",currentTime,currentTime]);
  } else if (type == "1") { // 更新操作
    // 不存在：返回错误，处理结束 
    if (modCnt == "0") {
      sys.setRetData(6);
      return;
    }

    // 根据请求数据更新 modules 数据
    sqlMod = "update "+orgid+".sys_modules set ";
    if (modNm != null) {
      sqlMod = sqlMod + "modulenm = ?, ";
      @param.add(modNm);
    }
    if (about != null) {
      sqlMod = sqlMod + "about = ?, ";
      @param.add(about);
    }
    if (status != null) {
      sqlMod = sqlMod + "status = ?, ";
      @param.add(status);
    }
    sqlMod = sqlMod + "updatedt = ? ,auflag=? where appid = ? and moduleid = ?";
    @param.add(sys.getCurrentTimeString());
    @param.add(auflag);
    @param.add(appId);
    @param.add(modId);
    
    ret=[{"appid":appId,"moduleid":modId,"modulenm":modNm,"about":about,"auflag":auflag,"status":status,"updatedt":sys.getCurrentTimeString(),"appnm":modNm,"someid":appId+"@"+modId,"isParent":true}];
  }

  // 执行更新
  var updCnt = sql.update(sqlMod, param);
  if (updCnt > 0) {
    //返回修改或新增数据
    sys.addRetData(ret,"result");
    sys.setRetData("0","","result");
  } else {
    sys.setRetData("5");
  }