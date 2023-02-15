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
// http://localhost:8080/ds/ide/app?app=mdm&org=zr&s=d&openid=dean&type=0&appid=z&nm=znm&about=about&appflag=0&status=1
  // http://localhost:8080/ds/ide/app?app=mdm&org=zr&s=d&openid=dean&type=1&appid=z&nm=znm1&about=about1&appflag=0&status=1
//tfgfg2
  // HTTP 请求参数
  var type = sys.request.type;
  var appId = sys.uuid();
  var appId_u=sys.request.appid;
  var appNm = sys.request.appnm;
  var about = sys.request.about;
  var appFlag = sys.request.appflag;
  var status = sys.request.status;
  var roleid=sys.request.roleid;
  // 验证必要参数
  if (type == null) {
    sys.setRetData("1");
    return;
  }

  // 验证操作类型
  if (type != "0" && type != "1") {
    sys.setRetData("2");
    return;
  }
  //设置返回数据
  var set=[];
  var ret=[];
  // 验证 APPID 是否已经存在
  var sqlAppCnt = "select count(*) cnt from sys_apps where appid = ? ";
  var paramAppCnt = [appId];
  sql.query(sqlAppCnt, paramAppCnt, "appcnt");
  var appCntRet = sys.result.appcnt;
  var appCnt = "";
  for (acr in appCntRet) {
    appCnt = acr.cnt;
  }

  var sqlApp = "";
  var param = [];
  if (type == "0") {  // 创建操作
  
    // //不允许创建APP
    // sys.setRetData("900");
    // return;
    // 存在：返回错误，处理结束 
    if (appCnt != "0") {
      sys.setRetData(6);
      return;
    }

    // 根据请求数据向 apps 表中插入一条新数据
    sqlApp = "insert into sys_apps (appid, appnm, about, appflag, status, createdt, updatedt) values (?, ?, ?, ?, ?, ?, ?)";
    var currentTime = sys.getCurrentTimeString();
    if (appFlag == null) {
      appFlag = "0";
    }
    if (status == null) {
      status = "1";
    }
    param = [appId, appNm, about, appFlag, status, currentTime, currentTime];
    set=[{"appid":appId,"appnm":appNm,"about":about,"appflag":appFlag,"status":status,"createdt":currentTime,"updatedt":sys.getCurrentTimeString(),"someid":appId,"isParent":true}];
    
    //将创建的app付给项目角色id
    // var authRoleSql="insert into sys_role_api (roleid,appid,moduleid,apiid,status,createdt,updatedt) values (?,?,?,?,?,?,?)";
    // sql.update(authRoleSql,[roleid,appId,"","","1",currentTime,currentTime]);
    
  } else if (type == "1") { // 更新操作
    // 不存在：返回错误，处理结束 

    // 根据请求数据更新 apps 数据
    sqlApp = "update sys_apps set ";
    if (appNm != null) {
      sqlApp = sqlApp + "appnm = ?, ";
      @param.add(appNm);
    }
    if (about != null) {
      sqlApp = sqlApp + "about = ?, ";
      @param.add(about);
    }
    if (appFlag != null) {
      sqlApp = sqlApp + "appflag = ?, ";
      @param.add(appFlag);
    }
    if (status != null) {
      sqlApp = sqlApp + "status = ?, ";
      @param.add(status);
    }
    sqlApp = sqlApp + "updatedt = ? where appid = ?";
    @param.add(sys.getCurrentTimeString());
    @param.add(appId_u);
    set=[{"appid":appId_u,"appnm":appNm,"about":about,"appflag":appFlag,"status":status,"updatedt":sys.getCurrentTimeString(),"someid":appId_u,"isParent":true}];
  }

  // 执行更新
  var updCnt = sql.update(sqlApp, param);
  if (updCnt > 0) {
      if(type =='0'){
    sys.setAppCache(appId);
      }else if(type=='1'){
          sys.setAppCache(appId_u);
      }
    //返回数据
    sys.addRetData(set,"result");
    sys.setRetData("0","","result");
  } else {
    sys.setRetData("5");
  }