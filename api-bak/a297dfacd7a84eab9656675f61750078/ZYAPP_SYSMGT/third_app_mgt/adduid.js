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
  //接口名称：添加托管用户信息
  //接口URL： adduid

  // HTTP 请求参数
  var tp_appid = sys.request.tp_appid;
  //var pid = sys.request.pid;
  var uid = sys.request.uid;
  var userid = sys.request.userid;
  var status = sys.request.status;

  var sql="select pid from sys_userinfo where userid = ?";
    sql.query(sql,[userid],"pidI");
    var pidI = sys.result.pidI;
    if(sys.size(pidI)==0||pidI ==null){
        sys.setRetData("2");
        return;
    }
    
    var pid= pidI[0].pid;
    
  //插入sys_pl_tp_app_uid表
 if(tp_appid==null||userid==null||uid==null||status==null){
    sys.setRetData("1");
    return;
}

var sqlSel = "SELECT COUNT(*) CNT FROM sys_pl_tp_app_uid WHERE tp_appid = ? and pid = ?";
    var paramSel = [tp_appid,pid];   
    var resultCounta = sql.query(sqlSel,paramSel,"datasourceset");
    
    var selResult = sys.result.datasourceset;
    var selCount = "";
    for (r in selResult) {
      selCount = r.cnt;
    }
    if (selCount != "0") {//已存在该主键
      sys.setRetData("8");
      return;
    }
    var sqlIns="INSERT INTO sys_pl_tp_app_uid (tp_appid,pid,uid,status,createdt,updatedt) values(?,?,?,?,?,?)";
    var dt = sys.getCurrentTimeString();
    var paramIns=[tp_appid,pid,uid,status,dt,dt];
    var insCount = sql.update(sqlIns,paramIns);
    if (insCount == 0) {
      sys.setRetData("5");
      return;
    }
  //更新sys_pl_tp_app时间  
  var sqlM_B_T = "UPDATE sys_pl_tp_app SET updatedt=? WHERE tp_appid = ?";
  var paramUpdDt = [dt,tp_appid];
  var insCountT = sql.update(sqlM_B_T,paramUpdDt,"1");//开启事务
  
  if (insCount > 0 && insCountT > 0) {
    sql.commit();//提交事务
    sys.setRetData("0");
  }else {
    sys.setRetData("5");
    sql.rollback();//回滚事务
  }
    sys.setRetData("0");