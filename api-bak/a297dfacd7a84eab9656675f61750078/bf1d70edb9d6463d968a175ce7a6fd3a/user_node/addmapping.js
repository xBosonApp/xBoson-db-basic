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
// 参数
var userid=sys.request.userid;
var nodeid=sys.request.nodeid;
// 验证参数
if(userid==null||nodeid==null){
    sys.setRetData("1");
    return;
}
var dt=sys.currentTimeString();
// 判断用户是否存在
var chkuser = "select userid from sys_userinfo where userid=?";
var count = sql.query(chkuser,[userid],"chk_r");
if(count == 0){
    sys.setRetData("2","用户不存在");
    return;
}
// 检查节点是否已被其他用户注册
if(sql.query("select userid from sys_pl_user_node where userid!=? and nodeid=?",[userid,nodeid])>0){
    sys.setRetData("2","此集群节点已被其他用户注册！");
    return;
}
// 检查主键是否存在
var chkpk="select userid from sys_pl_user_node where userid=? and nodeid=?";
count=sql.query(chkpk,[userid,nodeid],"chkpk_r");
if(count > 0){
    // 更新最后登陆时间
    var upd = "update sys_pl_user_node set lastdt=?,updatedt=? where userid=? and nodeid=?";
    sql.update(upd,[dt,dt,userid,nodeid]);
    sys.setRetData("0","您已注册此集群节点！");
    return;
}
// sql语句
var sql = "insert into sys_pl_user_node (userid,nodeid,lastdt,state,createdt,updatedt) values (?,?,?,?,?,?)";
// sql参数
var params = [userid,nodeid,dt,'1',dt,dt];
// 执行sql
sql.update(sql,params);
// 返回msg
sys.setRetData("0");