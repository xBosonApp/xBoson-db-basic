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
// 只允许删除空模块

var appid = sys.request.appid;
var moduleid = sys.request.moduleid;
if(appid==null||moduleid == null){
    sys.setRetData("1");
    return;
}
//1.检查模块是否存在
var cnt=sql.query("select moduleid from sys_modules where appid=? and moduleid=?",[appid,moduleid]);
if(cnt!=1){
    sys.setRetData("2");
    return;
}
//2.判断模块下是否有API
cnt=sql.query("select apiid from sys_apis where appid=? and moduleid=?",[appid,moduleid]);
if(cnt>0){
    sys.setRetData("2","模块下有API，不允许删除！");
    return;
}
//删除模块
sql.update("delete from sys_modules where appid=? and moduleid=?",[appid,moduleid]);
sys.setRetData("0");