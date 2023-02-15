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
//id:getuserinfo
//name:获取用户基本信息
//url:http://192.168.7.120/ds/api/getuserinfo?org=zr&openid=admin&app=auth&mod=login&s=d

var openid=sys.request.openid;

if(openid==null){
    sys.setRetData("1");
    return;
}

var pid=sys.getUserPID(openid);
if(pid==null){
    sys.setRetData("2");
    return;
}

//从userinfo ,personal info表
var sql2="select a.userid,a.multiflag,a.image_path,a.status,a.createdt,a.updatedt,b.de0201039 name,b.de0201040 gender,b.de0201005 birthday,b.de0201015 country,b.de0201025 nation,b.de0201018 marital,";
sql2=sql2+" b.de0201030 idcard,b.de0201010 phonenumber,b.de0201012 email from sys_userinfo a, mdm_personal_info b where a.pid=b.pid and a.pid=?";
var param2=[pid];
sql.query(sql2,param2);
sys.setRetData("0","","result");