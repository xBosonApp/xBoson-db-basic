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
//id:getuidlist
//name:获取托管用户一览
//编写人：王莹莹
//测试url：

var tp_appid=sys.request.tp_appid;
var pid=sys.request.pid;
var uid=sys.request.uid;
var status = sys.request.status;
var userid = sys.request.userid;
var pagenum = sys.request.pagenum;
var pagesize = sys.request.pagesize;
var pNDefualt = 1;//默认pagenum值
var PSDefualt = 10;//默认pagesize值

  //查询 sys_pl_tp_app_uid 表
   var sqlSel;
   var sqlWhere=" where 1=1 ";
   var paramSel = [];

 sqlSel ="SELECT a.tp_appid,a.pid,a.uid,o.userid,a.status,a.createdt,a.updatedt "+
" from sys_pl_tp_app_uid a left join sys_userinfo o on a.pid = o.pid and o.status = '1' ";
            
 if (pagenum == null) {
  	pagenum = pNDefualt;
  }
  if (pagesize == null) {
  	pagesize = PSDefualt;
  }
   /*var sqlWhere=sql +" WHERE a.tp_appid = ?";*/
   if (tp_appid != null) {
      sqlWhere = sqlWhere + " AND a.tp_appid = ? ";
      @paramSel.add(tp_appid);
   }
   if (uid != null) {
      sqlWhere = sqlWhere + " AND a.uid = ? ";
      @paramSel.add(uid);
   }
   if (userid != null) {
      sqlWhere = sqlWhere + " AND o.userid = ? ";
      @paramSel.add(userid);
   }
    
    if (status != null) {
      sqlWhere = sqlWhere + " AND a.status = ?";
      @paramSel.add(status);
    }
    sqlSel = sqlSel + sqlWhere;
    var queryPagingCount = sql.queryPaging(sqlSel,paramSel,pagenum,pagesize,"result");
    sys.setRetData("0","","result");