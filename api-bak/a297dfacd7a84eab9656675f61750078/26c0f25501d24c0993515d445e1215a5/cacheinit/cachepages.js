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
// 清空已有缓存
se.delCache(_CACHE_REGION_PAGE_);
//获取所有初始化db的机构
var orgs = se.getCache(_CACHE_REGION_TENANT_,_CACHE_KEY_INIT_ORG_);

// 使用单独连接避免替换 Schema
sql.connection("00000000000000000000000000000000");

// ----缓存所有机构页面信息 开始----
// 为菜单获取pageid所对应的page_path使用，与API:prjpagemaint的结构基本相同，考虑不必要缓存元素对应的API和模型服务
for (org in orgs) {
  //页面信息
  sql.query("select pageid,pagenm,prjid,page_path,status from "+org+".sys_page",null,"pageinfo");
  // 页面元素信息
  sql.query("select pageid,elementid,elementnm from "+org+".sys_page_element order by pageid,elementid",null,"elementinfo");
  // 下级页面信息
  sql.query("select next.pageid pageid,next.next_pageid next_pageid,page.pagenm pagenm from "+org+".sys_page_next next,"+org+".sys_page page where next.next_pageid=page.pageid order by pageid",null,"nextpages");
  var pages = sys.result["pageinfo"];
  var elements = sys.result["elementinfo"];
  var nexts = sys.result["nextpages"];
  sys.setRetList(pages, elements, [["pageid", "pageid"]], "elementinfo");
  sys.setRetList(pages, nexts, [["pageid", "pageid"]], "nextpages");
  for (row in pages) {
    // orgid:pagid - page object
    se.setCache(_CACHE_REGION_PAGE_, org + ":" + row["pageid"], row, 0);
  }
}
// ----缓存所有机构页面信息 结束----
se.setCache(_CACHE_REGION_PAGE_, _CACHE_KEY_READY_, true, 0);
sys.setRetData("0");