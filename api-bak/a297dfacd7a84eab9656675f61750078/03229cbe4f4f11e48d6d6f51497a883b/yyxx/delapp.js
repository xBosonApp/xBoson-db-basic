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
//只允许删除空APP

var appid=sys.request.appid;
if(appid==null){
    sys.setRetData("1");
    return;
}

//1.检查app是否存在
var cnt=sql.query("select appid from sys_apps where appid=?",[appid]);
if(cnt!=1){
    sys.setRetData("2");
    return;
}
//2.检查app下是否有模块
cnt=sql.query("select moduleid from sys_modules where appid=?",[appid]);
if(cnt>0){
    sys.setRetData("2","APP下有模块，不允许删除！");
    return;
}
//删除app
sql.update("delete from sys_apps where appid=?",[appid]);
sys.setRetData("0");