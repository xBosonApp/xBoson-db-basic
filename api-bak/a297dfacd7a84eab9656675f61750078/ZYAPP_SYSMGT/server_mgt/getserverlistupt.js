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
//接口编写人:王莹莹
  //测试URI：http://192.168.7.120:8088/ds/api/getserverlistupt?app=ZYAPP_SYSMGT&mod=server_mgt&org=f6f4cbfd4e3340249ef1db13dbfe5b23&openid=B604D416976A87440615FF6CC509EC2EC4771B712ED4AB7C727999F85363F980&s=d&mdk=10c24f31ade64384b5a30046d68fa631&userkeylocal=99646b7b839e4777923690362e0a57d7&serverid=17e29d9b104d44a58fd0f2d9b14d8ccf
  //接口URL： getserverlistupt

  // HTTP 请求参数
  var serverid = sys.request.serverid;
  
  //查询 sys_server 表
  if (serverid != null) {
    var sql = "select serverid,servernm,server_v,server_type,server_type_detail,inner_ip,inner_port,outer_ip,"+
              "outer_port,mac,cpu_core_count,memory_size,disc_space,`virtual`,os,pic_pid,pic_name,pic_tel,"+
              "server_desc,in_use,abolish_time,status,createdt,updatedt from sys_server where serverid = ?";
    var param = [serverid];
    var query = sql.query(sql,param);
    sys.setRetData("0","","result");
  }else {
    sys.setRetData("1");
  }