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
/*
liufengyuan 
201504010
*/
var openid = sys.request.openid;
var userid = sys.getUserIdByOpenId(openid);
var modstatus = sys.request.modstatus;
var domain = sys.request.siteid;
var token = sys.request.token;
var dt = sys.currentTimeString();//获取当前时间
var hiscache = {org:token,pid:userid};

if(modstatus==null||domain==null){
    sys.setRetData("1");
    return;
}
if("i"==modstatus){
    if(0<sql.update("insert  into  sys_pl_domain_info(domain_2, orgid, updatedt, createdt)  values(?,?,?,?)",[domain,token,dt,dt],1)){
        se.setCache("dsWebSLDCache",domain,hiscache,0);
        sql.commit();
        sys.setRetData("0");
        return;
    }
}
if("u"==modstatus){
    se.setCache("dsWebSLDCache",domain,hiscache,0);
    sys.setRetData("0");
    return;
}

if("d"==modstatus){
    if(0<sql.update("delete from sys_pl_domain_info where domain_2 = ? and orgid = ?",[domain,token],1)){
        se.delCache("dsWebSLDCache",domain);
        sql.commit();
        sys.setRetData("0");
        return;
    }
}
sys.printValue(sql.update("delete from sys_pl_domain_info where domain_2 = ? and orgid = ?",[domain,token],1));
sql.rollback();
sys.setRetData("1","保存失败！");