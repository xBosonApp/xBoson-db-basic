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
//接口编写人：王莹莹
  //测试URI：http://192.168.7.120:8088/ds/api/addsysteminfo?app=ZYAPP_SYSMGT&mod=system_mgt&org=a297dfacd7a84eab9656675f61750078&openid=F4B34B09DC647AF07644C9285E50761EF2E506E3B63DC4A8217C1FCC1A90707C&s=d&mdk=558b87b0755c425aa8d3b0c115b92bd6&userkeylocal=df33d825fa3244fc92fbb39f290b06b9&sysid=1&sysnm=wyy测试&status=1
  //接口名称：添加系统信息
  //接口URL： addsysteminfo

  // HTTP 请求参数
  var sysid = sys.getUUID();
  var sysnm = sys.request.sysnm;
  var ip = sys.request.ip;
  var port = sys.request.port;
  var uri = sys.request.uri;
  var inner_flag = sys.request.inner_flag;
  var orgid =sys.request.org;
  var pid = sys.request.pid;
  var sys_desc = sys.request.sys_desc;
  var status = sys.request.status;
  var pagenum = sys.request.pagenum;
  var pagesize = sys.request.pagesize;

  //插入sys_system表
  var dt = sys.getCurrentTimeString();//获取当前时间
  var params=[sysid,sysnm,ip,port,uri,inner_flag,orgid,pid,sys_desc,status,dt,dt];
  var sql="insert into sys_system (sysid,sysnm,ip,port,uri,inner_flag,orgid,pid,sys_desc,status,createdt,updatedt)"+
          " values (?,?,?,?,?,?,?,?,?,?,?,?)";
 //判断数据库中不允许为空的字段 
 if(sysid==null||sysnm==null||status==null){
      sys.setRetData("1");
      return;
  }
  //判断主键是否重复
  var sqlSel="select sysid from sys_system where sysid = ? ";
  var param=[sysid];
  var countSel=sql.query(sqlSel,param);
  if(countSel>=1){
    sys.setRetData("6");
    return;
  }
  var count = sql.update(sql,params);
  if (count == 0) {
    sys.setRetData("5");
    return;
  }
  //更新缓存
    var sysinfoSql=se.getCache(_CACHE_REGION_SYS_SQL_,"sys0002");
    var cnt=sql.query(sysinfoSql,[sysid],"sysinfo");
    var sysinfo=sys.result.sysinfo;
    if(cnt>0){
        se.setCache(_CACHE_REGION_SYSTEM_,sysid,sysinfo[0],0);
    }
  sys.setRetData("0");