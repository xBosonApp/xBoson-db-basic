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

//id:getsysorginfo
//name:获取系统所属机构信息
//url:http://192.168.7.120:8088/ds/api/getsysorginfo?app=ZYAPP_SYSMGT&mod=system_mgt&org=a297dfacd7a84eab9656675f61750078&openid=BD677776AEE22DE2034D7F1AECC3DB81355F405C8EDF540BA936B623B1057139&s=d&mdk=62016cfec92d453fb93a623ebe83ebfd&userkeylocal=d0c01698f5ae4df496fb0bcfba98bdd6&sysid=55d16b73b6db4101b66167a64e0f8fe8
var sysid=sys.request.sysid;
if (sysid == null) {
    sys.setRetData("1");
    return;
  }
var sql="select (case when de0810011 is null then de0810013j else de0810011 end) de0810013j,orgid from mdm_org "
+" where orgid in (select orgid from sys_system_role a , sys_role b where a.sysid = ? and a.roleid=b.roleid and a.status='1' and b.status='1')";
var param=[sysid];
sql.query(sql,param,"result");
sys.setRetData("0","","result");