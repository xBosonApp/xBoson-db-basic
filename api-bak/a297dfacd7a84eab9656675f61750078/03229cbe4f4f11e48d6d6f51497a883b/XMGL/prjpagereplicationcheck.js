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
//prjpagereplicationcheck
var pageid=sys.request.pageid;
if(pageid==null){
    sys.setRetData("1","验证页面ID为空");
    return;
}
sql.query("select pageid from sys_page where pageid=?",[pageid]);
var ret = sys.result["result"];
if (sys.size(ret) > 0) {
    sys.setRetData("8","页面ID "+pageid+" 已存在");//数据已存在
} else {
    sys.setRetData("11","页面ID "+pageid+" 不存在");//数据不存在
}