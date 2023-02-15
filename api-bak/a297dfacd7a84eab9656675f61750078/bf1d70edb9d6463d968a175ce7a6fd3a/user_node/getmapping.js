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
var openid = sys.request.openid;
// 获取userid
var userid = sys.getUserIdByOpenId(openid);

// sql语句
var sql = "select nodeid from sys_pl_user_node where userid=? and state='1'";
var params = [userid];

var count = sql.query(sql,params,"data");
if(count==0){
    sys.setRetData("2","用户未注册！");
    return;
}

var result = [];
for(r in sys.result.data){
    list.add(result,r.nodeid);
}
sys.addRetData(result,"result");
sys.setRetData("0","","result");