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
//接口名称：添加机构信息
  //接口URL： addorginfo

  // HTTP 请求参数
  var orgid = sys.getUUID();
  var de0810013j = sys.request.de0810013j;
  var de0810011 = sys.request.de0810011;
  var de0810052 = sys.request.de0810052;
  var de0810022 = sys.request.de0810022;
  var de0201039f_pid = sys.request.de0201039f_pid;
  var de0201039f = sys.request.de0201039f;
  var de0810081 = sys.request.de0810081;
  var de0810024 = sys.request.de0810024;
  var de0810027 = sys.request.de0810027;
  var de0810028 = sys.request.de0810028;
  var de0810016 = sys.request.de0810016;
  var reg_org = sys.request.reg_org;
  var reg_cd = sys.request.reg_cd;
  var de0810082 = sys.request.de0810082;
  var de020100905 = sys.request.de020100905;
  var de020100906 = sys.request.de020100906;
  var de020100901 = sys.request.de020100901;
  var de020100902 = sys.request.de020100902;
  var de020100903 = sys.request.de020100903;
  var de020100904 = sys.request.de020100904;
  var de0201038 = sys.request.de0201038;
  var de0201047 = sys.request.de0201047;
  var de0201010 = sys.request.de0201010;
  var de0201008 = sys.request.de0201008;
  var de0201012 = sys.request.de0201012;
  var de0201054 = sys.request.de0201054;
  var de0201046 = sys.request.de0201046;
  var de0810009 = sys.request.de0810009;
  var de0810029 = sys.request.de0810029;
  var de0810010 = sys.request.de0810010;
  var de0810046 = sys.request.de0810046;
  var higher_orgid = sys.request.higher_orgid;
  var nationality_cd = sys.request.nationality_cd;
  var de0201039t = sys.request.de0201039t;
  var de0810013t = sys.request.de0810013t;
  var de0201039tx = sys.request.de0201039tx;
  var de0900053 = sys.request.de0900053;
  var de0810001 = sys.request.de0810001;
  var de0810005 = sys.request.de0810005;
  var de0810006 = sys.request.de0810006;
  var de0810008 = sys.request.de0810008;
  var de0810030 = sys.request.de0810030;
  var de0810031 = sys.request.de0810031;
  var de0810032 = sys.request.de0810032;
  var de0810041 = sys.request.de0810041;
  var de0810044 = sys.request.de0810044;
  var de0810050 = sys.request.de0810050;
  var de0810051 = sys.request.de0810051;
  var de0810043 = sys.request.de0810043;
  var category = sys.request.category;
  var status = sys.request.status;
  var pagenum = sys.request.pagenum;
  var pagesize = sys.request.pagesize;
  var openId = sys.request.openid;
  var pId = sys.getUserPID(openId);
  var org = sys.request.org;
  var org_type=sys.request.org_type;

  //插入mdm_personal_info表
  var dt = sys.getCurrentTimeString();//获取当前时间
  //去掉多余的字符时间字段
  if(de0810009!=null){
      de0810009=sys.replace(de0810009,"-","");
  }
  var params=[orgid,de0810013j,de0810011,de0810052,de0810022,de0201039f_pid,de0201039f,de0810081,de0810024,de0810027,
            de0810028,de0810016,reg_org,reg_cd,de0810082,de020100905,de020100906,de020100901,de020100902,de020100903,
            de020100904,de0201038,de0201047,de0201010,de0201008,de0201012,de0201054,de0201046,de0810009,de0810029,
            de0810010,de0810046,higher_orgid,nationality_cd,de0201039t,de0810013t,de0201039tx,de0900053,de0810001,
            de0810005,de0810006,de0810008,de0810030,de0810031,de0810032,de0810041,de0810044,de0810050,de0810051,
            de0810043,category,status,org,pId,org,pId,dt,dt];

  var sql="insert into mdm_org (orgid,de0810013j,de0810011,de0810052,de0810022,de0201039f_pid,de0201039f,de0810081,"+
          "de0810024,de0810027,de0810028,de0810016,reg_org,reg_cd,de0810082,de020100905,de020100906,de020100901,de020100902,"+
          "de020100903,de020100904,de0201038,de0201047,de0201010,de0201008,de0201012,de0201054,de0201046,de0810009,"+
          "de0810029,de0810010,de0810046,higher_orgid,nationality_cd,de0201039t,de0810013t,de0201039tx,de0900053,de0810001,"+
          "de0810005,de0810006,de0810008,de0810030,de0810031,de0810032,de0810041,de0810044,de0810050,de0810051,de0810043,"+
          "category,status,create_orgid,create_pid,update_orgid,update_pid,createdt,updatedt) values(?,?,?,?,?,?,?,?,?,?,"+
          "?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
 
  //判断主键是否重复
  var sqlSel="select orgid from mdm_org where orgid = ? ";
  var param=[orgid];
  var countSel=sql.query(sqlSel,param);
  if(countSel>=1){
    sys.setRetData("6");
    return;
  }
  var sql1="insert into sys_tenant (orgid,init_db,org_type,pid,status,createdt,updatedt) values (?,?,?,?,?,?,?)";
 var param1=[orgid,"0",org_type,pId,status,dt,dt];
  var insM_B_T =sql.update(sql1,param1);
  var count = sql.update(sql,params);
  if (count == 0) {
    sys.setRetData("5");
    return;
  }
 if (insM_B_T == 0) {
    sys.setRetData("5");
    return;
  }
  sys.setRetData("0");
//   sys.setDict("mdm_org");