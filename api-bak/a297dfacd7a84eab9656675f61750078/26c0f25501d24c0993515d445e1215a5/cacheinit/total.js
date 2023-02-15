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
var log={};
var localdbconnApiInfo = {app:"26c0f25501d24c0993515d445e1215a5",mod:"cacheinit",api:"localdbconn",path:""};
var localdbconnParamInfo = {s:"d"};
var localdbconnRet = http.platformGet(localdbconnApiInfo, localdbconnParamInfo);
var localdbconnRetData = localdbconnRet["data"];
if (localdbconnRetData!=null && localdbconnRetData["ret"]=="0") {
  map.put(log,"刷新本地DB连接信息","刷新本地DB连接信息成功");
} else {
  map.put(log,"刷新本地DB连接信息","刷新本地DB连接信息失败！"+ localdbconnRetData);
  sys.addRetData([log],"result");
  sys.setRetData("1","刷新本地DB连接信息失败","result");
  return;
}

//缓存sql语句
var boolean=se.getCache(_CACHE_REGION_SYS_SQL_, _CACHE_KEY_READY_);
if(boolean==true){
  map.put(log,"sql语句","sql语句缓存已存在！");
}else{
  var apiInfo = {app:"26c0f25501d24c0993515d445e1215a5",mod:"cacheinit",api:"systemsqls",path:""};
  var paramInfo = {s:"d"};
  var platformGetRet = http.platformGet(apiInfo, paramInfo);
  var msg = platformGetRet["data"];
  var tmpboo=se.getCache(_CACHE_REGION_SYS_SQL_, _CACHE_KEY_READY_);
  if(tmpboo==true){
    map.put(log,"sql语句","sql语句缓存成功！"+msg);
  }else{
    map.put(log,"sql语句","sql语句缓存失败，需要停止本服务并尝试重新启动，请联系系统管理员！"+msg);
    sys.addRetData([log],"result");
    sys.setRetData("1","sql语句缓存失败","result");
    return;
  }
}
// 缓存系统配置属性信息
boolean=se.getCache(_CACHE_REGION_CONFIG_, _CACHE_KEY_READY_);
if(boolean==true){
    map.put(log,"系统配置属性信息","系统配置属性信息缓存已存在！");
}else{
  var apiInfo = {app:"26c0f25501d24c0993515d445e1215a5",mod:"cacheinit",api:"systemconfig",path:""};
  var paramInfo = {s:"d"};
  var platformGetRet = http.platformGet(apiInfo, paramInfo);
  var msg = platformGetRet["data"];
  var tmpboo=se.getCache(_CACHE_REGION_CONFIG_, _CACHE_KEY_READY_);
  if(tmpboo==true){
    map.put(log,"系统配置属性信息","系统配置属性信息缓存成功！");
  }else{
    map.put(log,"系统配置属性信息","系统配置属性信息缓存失败，需要停止本服务并尝试重新启动，请联系系统管理员！"+msg);
    sys.addRetData([log],"result");
    sys.setRetData("1","系统配置属性信息缓存失败","result");
    return;
  }
}
// 缓存租户信息
boolean=se.getCache(_CACHE_REGION_TENANT_, _CACHE_KEY_READY_);
if(boolean==true){
  map.put(log,"租户信息","租户信息缓存已存在！");
}else{
  var apiInfo = {app:"26c0f25501d24c0993515d445e1215a5",mod:"cacheinit",api:"systemtenants",path:""};
  var paramInfo = {s:"d"};
  var platformGetRet = http.platformGet(apiInfo, paramInfo);
  var msg = platformGetRet["data"];
  var tmpboo=se.getCache(_CACHE_REGION_TENANT_, _CACHE_KEY_READY_);
  if(tmpboo==true){
    map.put(log,"租户信息","租户信息缓存成功！");
  }else{
    map.put(log,"租户信息","租户信息缓存失败，需要停止本服务并尝试重新启动，请联系系统管理员！"+msg);
    sys.addRetData([log],"result");
    sys.setRetData("1","租户信息缓存失败","result");
    return;
  }
}
// 缓存数据连接服务信息
boolean=se.getCache(_CACHE_REGION_JDBC_CONNECTION_, _CACHE_KEY_READY_);
if(boolean==true){
  map.put(log,"数据连接服务信息","数据连接服务信息缓存已存在！");
}else{
  var apiInfo = {app:"26c0f25501d24c0993515d445e1215a5",mod:"cacheinit",api:"systemdbconnection",path:""};
  var paramInfo = {s:"d"};
  var platformGetRet = http.platformGet(apiInfo, paramInfo);
  var msg = platformGetRet["data"];
  var tmpboo=se.getCache(_CACHE_REGION_JDBC_CONNECTION_, _CACHE_KEY_READY_);
  if(tmpboo==true){
    map.put(log,"数据连接服务信息","数据连接服务信息缓存成功！");
  }else{
    map.put(log,"数据连接服务信息","数据连接服务信息缓存失败，需要停止本服务并尝试重新启动，请联系系统管理员！"+msg);
    sys.addRetData([log],"result");
    sys.setRetData("1","数据连接服务信息缓存失败","result");
    return;
  }
}
// 缓存数据集完整信息
boolean=se.getCache(_CACHE_REGION_DATASET_, _CACHE_KEY_READY_);
if(boolean==true){
  map.put(log,"数据集完整信息","数据集完整信息缓存已存在！");
}else{
  var apiInfo = {app:"26c0f25501d24c0993515d445e1215a5",mod:"cacheinit",api:"cachealldatasetinfo",path:""};
  var paramInfo = {s:"d"};
  var platformGetRet = http.platformGet(apiInfo, paramInfo);
  var msg = platformGetRet["data"];
  var tmpboo=se.getCache(_CACHE_REGION_DATASET_, _CACHE_KEY_READY_);
  if(tmpboo==true){
    map.put(log,"数据集完整信息","数据集完整信息缓存成功！"+msg);
  }else{
    map.put(log,"数据集完整信息","数据集完整信息缓存失败，需要停止本服务并尝试重新启动，请联系系统管理员！"+msg);
    sys.addRetData([log],"result");
    sys.setRetData("1","数据集完整信息缓存失败","result");
    return;
  }
}
// 缓存 API
boolean=se.getCache(_CACHE_REGION_API_, _CACHE_KEY_READY_);
if(boolean==true){
  map.put(log,"API","API缓存已存在！");
}else{
  var apiInfo = {app:"26c0f25501d24c0993515d445e1215a5",mod:"cacheinit",api:"systemapis",path:""};
  var paramInfo = {s:"d"};
  var platformGetRet = http.platformGet(apiInfo, paramInfo);
  var msg = platformGetRet["data"];
  var tmpboo=se.getCache(_CACHE_REGION_API_, _CACHE_KEY_READY_);
  if(tmpboo==true){
    map.put(log,"API","API信息缓存成功！");
  }else{
    map.put(log,"API","API信息缓存失败，需要停止本服务并尝试重新启动，请联系系统管理员！"+msg);
    sys.addRetData([log],"result");
    sys.setRetData("1","API信息缓存失败","result");
    return;
  }
}

//缓存平台数据字典
boolean=se.getCache(_CACHE_REGION_MDM_, _CACHE_KEY_READY_);
if(boolean==true){
  map.put(log,"平台数据字典","平台数据字典缓存已存在！");
}else{
  var apiInfo = {app:"26c0f25501d24c0993515d445e1215a5",mod:"cacheinit",api:"platdict",path:""};
  var paramInfo = {s:"d"};
  var platformGetRet = http.platformGet(apiInfo, paramInfo);
  var msg = platformGetRet["data"];
  var tmpboo=se.getCache(_CACHE_REGION_MDM_, _CACHE_KEY_READY_);
  if(tmpboo==true){
    map.put(log,"平台数据字典","平台数据字典缓存成功！");
  }else{
    map.put(log,"平台数据字典","平台数据字典缓存失败，需要停止本服务并尝试重新启动，请联系系统管理员！"+msg);
    sys.addRetData([log],"result");
    sys.setRetData("1","平台数据字典缓存失败"+msg,"result");
    return;
  }
}
// 缓存角色权限
// boolean=se.getCache(_CACHE_REGION_SYS_AUTHORITY_, _CACHE_KEY_READY_);
// if(boolean==true){
//   map.put(log,"角色权限","角色权限缓存已存在！");
// }else{
//   var apiInfo = {app:"26c0f25501d24c0993515d445e1215a5",mod:"cacheinit",api:"失败，",path:""};
//   var paramInfo = {s:"d"};
//   var platformGetRet = http.platformGet(apiInfo, paramInfo);
//   var msg = platformGetRet["data"];
//   var tmpboo=se.getCache(_CACHE_REGION_SYS_AUTHORITY_, _CACHE_KEY_READY_);
//   if(tmpboo==true){
//     map.put(log,"角色权限","角色权限缓存成功！"+msg);
//   }else{
//     map.put(log,"角色权限","角色权限缓存失败，需要停止本服务并尝试重新启动，请联系系统管理员！"+msg);
//     sys.addRetData([log],"result");
//     sys.setRetData("1","角色权限缓存失败","result");
//     return;
//   }
// }
boolean=se.getCache(_CACHE_REGION_RBAC_, _CACHE_KEY_READY_);
if(boolean==true){
  map.put(log,"角色权限","角色权限缓存已存在！");
}else{
  var apiInfo = {app:"26c0f25501d24c0993515d445e1215a5",mod:"cacheinit",api:"rbac",path:""};
  var paramInfo = {s:"d"};
  var platformGetRet = http.platformGet(apiInfo, paramInfo);
  var msg = platformGetRet["data"];
  var tmpboo=se.getCache(_CACHE_REGION_RBAC_, _CACHE_KEY_READY_);
  if(tmpboo==true){
    map.put(log,"角色权限","角色权限缓存成功！"+msg);
  }else{
    map.put(log,"角色权限","角色权限缓存失败，需要停止本服务并尝试重新启动，请联系系统管理员！"+msg);
    sys.addRetData([log],"result");
    sys.setRetData("1","角色权限缓存失败","result");
    return;
  }
}

// 缓存第三方应用信息
boolean=se.getCache(_CACHE_REGION_TP_APP_, _CACHE_KEY_READY_);
if(boolean==true){
  map.put(log,"第三方应用信息","第三方应用信息缓存已存在！");
}else{
  var apiInfo = {app:"26c0f25501d24c0993515d445e1215a5",mod:"cacheinit",api:"systemapps",path:""};
  var paramInfo = {s:"d"};
  var platformGetRet = http.platformGet(apiInfo, paramInfo);
  var msg = platformGetRet["data"];
  var tmpboo=se.getCache(_CACHE_REGION_TP_APP_, _CACHE_KEY_READY_);
  if(tmpboo==true){
    map.put(log,"第三方应用信息","第三方应用信息缓存成功！");
  }else{
    map.put(log,"第三方应用信息","第三方应用信息缓存失败，需要停止本服务并尝试重新启动，请联系系统管理员！"+msg);
    sys.addRetData([log],"result");
    sys.setRetData("1","第三方应用信息缓存失败","result");
    return;
  }
}
// 缓存系统信息
boolean=se.getCache(_CACHE_REGION_SYSTEM_, _CACHE_KEY_READY_);
if(boolean==true){
  map.put(log,"系统信息","系统信息缓存已存在！");
}else{
  var apiInfo = {app:"26c0f25501d24c0993515d445e1215a5",mod:"cacheinit",api:"systemsystems",path:""};
  var paramInfo = {s:"d"};
  var platformGetRet = http.platformGet(apiInfo, paramInfo);
  var msg = platformGetRet["data"];
  var tmpboo=se.getCache(_CACHE_REGION_SYSTEM_, _CACHE_KEY_READY_);
  if(tmpboo==true){
    map.put(log,"系统信息","系统信息缓存成功！");
  }else{
    map.put(log,"系统信息","系统信息缓存失败，需要停止本服务并尝试重新启动，请联系系统管理员！"+msg);
    sys.addRetData([log],"result");
    sys.setRetData("1","系统信息缓存失败","result");
    return;
  }
}
// 缓存业务模型信息
boolean=se.getCache(_CACHE_REGION_BIZ_MODEL_, _CACHE_KEY_READY_);
if(boolean==true){
  map.put(log,"业务模型信息","业务模型信息缓存已存在！");
}else{
  var apiInfo = {app:"26c0f25501d24c0993515d445e1215a5",mod:"cacheinit",api:"model_info",path:""};
  var paramInfo = {s:"d"};
  var platformGetRet = http.platformGet(apiInfo, paramInfo);
  var msg = platformGetRet["data"];
  var tmpboo=se.getCache(_CACHE_REGION_BIZ_MODEL_, _CACHE_KEY_READY_);
  if(tmpboo==true){
    map.put(log,"业务模型信息","业务模型信息缓存成功！");
  }else{
    map.put(log,"业务模型信息","业务模型信息缓存失败，需要停止本服务并尝试重新启动，请联系系统管理员！"+msg);
    sys.addRetData([log],"result");
    sys.setRetData("1","系统信息缓存失败","result");
    return;
  }
}
// 缓存页面信息
boolean=se.getCache(_CACHE_REGION_PAGE_, _CACHE_KEY_READY_);
if(boolean==true){
  map.put(log,"页面信息","页面信息缓存已存在！");
}else{
  var apiInfo = {app:"26c0f25501d24c0993515d445e1215a5",mod:"cacheinit",api:"cachepages",path:""};
  var paramInfo = {s:"d"};
  var platformGetRet = http.platformGet(apiInfo, paramInfo);
  var msg = platformGetRet["data"];
  var tmpboo=se.getCache(_CACHE_REGION_PAGE_, _CACHE_KEY_READY_);
  if(tmpboo==true){
    map.put(log,"页面信息","页面信息缓存成功！");
  }else{
    map.put(log,"页面信息","页面信息缓存失败，需要停止本服务并尝试重新启动，请联系系统管理员！"+msg);
    sys.addRetData([log],"result");
    sys.setRetData("1","系统信息缓存失败","result");
    return;
  }
}
sys.addRetData([log],"result");
sys.setRetData("0","","result");