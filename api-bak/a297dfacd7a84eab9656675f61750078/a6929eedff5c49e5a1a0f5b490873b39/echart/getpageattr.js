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
var pageid=sys.request.pageid,
    prjid=sys.request.prjid;
if(pageid==null){
    sys.setRetData("1","页面ID为空");
    return;
}
if(prjid==null){
    sys.setRetData("1","项目ID为空");
    return;
}

// 页面元素信息
sql.query("select elementid id,elementnm name,elementnm text from sys_page_element where pageid=? and elementid<>? order by pageid,elementid",[pageid,"0"],"elementinfo");


// 返回 页面信息，整合后的页面元素信息，下级页面信息
sys.setRetData("0","","elementinfo");