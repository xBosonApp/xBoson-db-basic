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
  //测试URI：http://192.168.7.120:8088/ds/api/addserverinfo?app=ZYAPP_SYSMGT&mod=server_mgt&org=f6f4cbfd4e3340249ef1db13dbfe5b23&openid=B604D416976A87440615FF6CC509EC2EC4771B712ED4AB7C727999F85363F980&s=d&mdk=10c24f31ade64384b5a30046d68fa631&userkeylocal=99646b7b839e4777923690362e0a57d7&serverid=1&servernm=测试数据wyy&server_v=1&server_type=2&inner_port=1&inner_ip=123
  //接口名称：添加服务器信息
  //接口URL： addserverinfo

  // HTTP 请求参数
  var serverid = sys.getUUID();
  var servernm = sys.request.servernm;
  var server_v = sys.request.server_v;
  var server_type = sys.request.server_type;
  var server_type_detail = sys.request.server_type_detail;
  var inner_ip = sys.request.inner_ip;
  var inner_port = sys.request.inner_port;
  var outer_ip = sys.request.outer_ip;
  var outer_port = sys.request.outer_port;
  var mac = sys.request.mac;
  var cpu_core_count = sys.request.cpu_core_count;
  var memory_size = sys.request.memory_size;
  var disc_space = sys.request.disc_space;
  var virtual = sys.request.virtual;
  var os = sys.request.os;
  var pic_pid = sys.request.pic_pid;
  var pic_name = sys.request.pic_name;
  var pic_tel = sys.request.pic_tel;
  var server_desc = sys.request.server_desc;
  var in_use = sys.request.in_use;
  var abolish_time = null;
  var status = sys.request.status;
  var pagenum = sys.request.pagenum;
  var pagesize = sys.request.pagesize;
  //插入sys_server表
  var dt = sys.getCurrentTimeString();//获取当前时间
  var params=[serverid,servernm,server_v,server_type,server_type_detail,inner_ip,inner_port,outer_ip,outer_port,
            mac,cpu_core_count,memory_size,disc_space,virtual,os,pic_pid,pic_name,pic_tel,server_desc,in_use,
            abolish_time,status,dt,dt];
  if (in_use == "0") {
  abolish_time = sys.getCurrentTimeString();
   }
  if (in_use == "1") {
  abolish_time = null;
  }
  var sql="insert into sys_server (serverid,servernm,server_v,server_type,server_type_detail,inner_ip,inner_port,"+
          "outer_ip,outer_port,mac,cpu_core_count,memory_size,disc_space,`virtual`,os,pic_pid,pic_name,pic_tel,server_desc,"+
          "in_use,abolish_time,status,createdt,updatedt) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
 //判断数据库中不允许为空的字段 
 if(serverid==null||servernm==null||server_v==null||server_type==null||inner_ip==null||inner_port==null||status==null){
      sys.setRetData("1");
      return;
  }
  //判断主键是否重复
  var sqlSel="select serverid from sys_server where serverid = ? ";
  var param=[serverid];
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
  sys.setRetData("0");