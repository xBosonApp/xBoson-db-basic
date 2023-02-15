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
  //测试URI：http://192.168.7.223:8080/ds/api/getserverlist?app=ZYAPP_SYSMGT&mod=server_mgt&org=f6f4cbfd4e3340249ef1db13dbfe5b23&openid=878597661364ED0CF906C50D21F91F8724E80D57B32ED546C98BCE1D392B3440&s=d&mdk=9c3a17284bb744db98971ec9886547af&userkeylocal=675cb8601a134add97c37f22bbe88a34
  //接口名称：获取服务器信息一览 
  //接口URL：getserverlist

  // HTTP 请求参数
  var serverid = sys.request.serverid;
  var servernm = sys.request.servernm;
  var server_type = sys.request.server_type;
  var virtual = sys.request.virtual;
  var in_use = sys.request.in_use;
  var status = sys.request.status;
  var pagenum = sys.request.pagenum;
  var pagesize = sys.request.pagesize;
  var pNDefualt = 1;//默认pagenum值
  var PSDefualt = 10;//默认pagesize值

  //查询 sys_server 表
  var sqlSel = "SELECT a.serverid,a.servernm,a.server_v,a.server_type,a.server_type_detail,a.inner_ip,a.inner_port,a.outer_ip,a.outer_port,"+
               "a.mac,a.cpu_core_count,a.memory_size,a.disc_space,a.virtual,a.os,a.pic_pid,a.pic_name,a.pic_tel,a.server_desc,a.in_use,"+
               "a.abolish_time,a.status,a.createdt,a.updatedt from sys_server a"; 
 if (pagenum == null) {
  	pagenum = pNDefualt;
  }
  if (pagesize == null) {
  	pagesize = PSDefualt;
  }
  var sqlWhere=" where 1=1 ";
  var paramSel = [];
   if (serverid != null) {
      sqlWhere = sqlWhere + " AND a.serverid like ? ";
      @paramSel.add("%"+serverid+"%");
   }
   if (servernm != null) {
      sqlWhere = sqlWhere + " AND a.servernm like ? ";
      @paramSel.add("%"+servernm+"%");
   }
   if (server_type != null) {
      sqlWhere = sqlWhere + " AND a.server_type = ?";
      @paramSel.add(server_type);
    }
    if (virtual != null) {
      sqlWhere = sqlWhere + " AND a.virtual = ?";
      @paramSel.add(virtual);
    }
    if (in_use != null) {
      sqlWhere = sqlWhere + " AND a.in_use = ?";
      @paramSel.add(in_use);
    }
    if (status != null) {
      sqlWhere = sqlWhere + " AND a.status = ?";
      @paramSel.add(status);
    }
    
    sqlSel = sqlSel + sqlWhere;
    var queryPagingCount = sql.queryPaging(sqlSel,paramSel,pagenum,pagesize,"result");
    sys.setRetData("0","","result");