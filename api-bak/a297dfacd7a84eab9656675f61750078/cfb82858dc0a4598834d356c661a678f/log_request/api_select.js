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
var org=sys.request.org;
var appid=sys.request.appid;
var moduleid=sys.request.modid;

if(appid==null || moduleid==null){
    sys.setRetData("1");
    return;
}

var sql="select apiid id,apinm name from sys_apis where appid=? and moduleid=? order by apinm";

sql.query(sql,[appid,moduleid]);

for(r in sys.result.result){
    map.put(r,"text",r.id+r.name);
}

sys.setRetData("0","","result");