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
// 接口调接口用
// 获取参数
var openid=sys.request.openid;
var typecd=sys.request.typecd;  //类别编码
var operation_type=sys.request.operation_type;  //操作类型 metadata001
var before_json=sys.request.before_json;
var after_json=sys.request.after_json;

var userid=sys.getUserIdByOpenId(openid);
var pid=sys.getUserPID(openid);

if(typecd==null||operation_type==null){
    sys.setRetData("1");
    return;
}

var ins = "insert into sys_md_mm006 (id,typecd,operation_type,before_json,after_json,userid,pid,createdt) values (?,?,?,?,?,?,?,?)";
var params = [sys.nextId(),typecd,operation_type,before_json,after_json,userid,pid,sys.currentTimeString()];

sql.update(ins,params);

sys.setRetData("0");