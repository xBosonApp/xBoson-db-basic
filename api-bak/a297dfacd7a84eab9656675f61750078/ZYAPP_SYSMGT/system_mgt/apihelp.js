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
//接口名称：获取api帮助信息一览 
  //接口URL：apihelp

  // HTTP 请求参数
  var appid = sys.request.appid;
  var moduleid = sys.request.moduleid;
  var apiid = sys.request.apiid;
  
  //查询 sys_apis 表
   var sqlSel;
   sqlSel ="SELECT help_info from sys_apis where appid = ? and moduleid =? and apiid =? ";
   var paramSel = [appid,moduleid,apiid];
   sql.query(sqlSel,paramSel,"result");
    sys.setRetData("0","","result");