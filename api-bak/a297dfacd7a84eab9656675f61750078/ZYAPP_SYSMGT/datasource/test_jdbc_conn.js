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
var did  = sys.request.did;    //数据源id
var user_name = sys.request.user_name;    //db用户名
var pass = sys.request.pass;  //db密码
var url  = sys.request.url;    //jdbc url
var port = sys.request.port;
var host = sys.request.host;
var type = sys.request.type;
var dbname = sys.request.db;

// isconn 1:有效 0:无效
var result=[{"isconn":"1","message":""}];

try{
  do {
    var a=1;    //此行代码防止try-catch的bug
    if (did != null) {
      sql.connection(did);
      break;
    }
    
    if (type) {
      if (type == 1000) { // mongoDB
        if (!check_user(true)) return;
        var mongodb = require('mongodb');
        var url = ['mongodb://'];
        if (user_name || pass) {
          url.push(user_name, ':', pass, '@');
        }
        url.push(host, ':', port, '/', dbname, '?serverSelectionTimeoutMS=3000');
        var client = mongodb.connect(url.join(''));
        client.dbs();
        break;
      } 
      else { // DBMS
        if (!check_user()) return;
        var url = sql.connection(type, host, parseInt(port) || -1, dbname, user_name, pass);
        sys.put('jdbc_url', url);
        break;
      }
    }
    
    if (url) {
      if (!check_user()) return;
      sql.connection(url, user_name, pass);
      break;
    }
    
    sys.setRetData("1", "JDBC URL, 或数据源ID(did), 或数据库类型不可为空");
    return;
  } while(false);
}catch(e){
  //sys.printValue(e);
  map.put(result[0],"isconn", "0");
  map.put(result[0],"message", e.cause ? e.cause.message : e.message);
}

sys.addRetData(result,"result");
sys.setRetData("0","","result");


function check_user(skippass) {
  if (pass == '********') {
    sys.setRetData("1", "密码已经被保护,修改设置须提供正确的密码或留空");
    return false;
  }
  if (!skippass) {
    if (user_name==null || pass==null) {
      sys.setRetData("1", "用户名，密码不可为空");
      return false;
    }
  }
  return true;
}