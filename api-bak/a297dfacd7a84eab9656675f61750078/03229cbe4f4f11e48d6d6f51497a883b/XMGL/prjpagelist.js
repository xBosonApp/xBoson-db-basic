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
var prjid = sys.request.prjid;
var pageid = sys.request.pageid;
var pagenm = sys.request.pagenm;
var page_path = sys.request.page_path;
var pagenum = sys.request.pagenum;
var pagesize = sys.request.pagesize;
var count = sys.request.count;
if (prjid == null) {
  sys.setRetData("1", "项目ID为空");
  return;
}
var sql = "select pageid,pagenm,page_path from sys_page where prjid=? and status='1'";
var param = [prjid];
if (pageid != null) {
  sql = sql + " and pageid like ?";
  list.add(param, "%" + pageid + "%");
}
if (pagenm != null) {
  sql = sql + " and pagenm like ?";
  list.add(param, "%" + pagenm + "%");
}
if (page_path != null) {
  sql = sql + " and page_path like ?";
  list.add(param, "%" + page_path + "%");
}
if (pagesize == null) {
  pagesize = 10;
}
if (pagenum == null) {
  pagenum = 1;
}
sql = sql + " order by pageid";
sql.queryPaging(sql, param, pagenum, pagesize, "result", count);

var pagesSize = sys.size(sys.result.result);
if (pagesSize > 0) {
  var cnt = 0;
  var sqlMenuTmp = "";
  var sqlPageNextTmp = "";
  while (cnt < pagesSize) {
    var rowPageid = sys.result.result[cnt].pageid;
    cnt++;
    if (cnt == pagesSize) {
      sqlMenuTmp = sqlMenuTmp + " pageid='" + rowPageid + "'";
      sqlPageNextTmp = sqlPageNextTmp + " n.next_pageid='" + rowPageid + "'";
    } else {
      sqlMenuTmp = sqlMenuTmp + " pageid='" + rowPageid + "' or";
      sqlPageNextTmp = sqlPageNextTmp + " n.next_pageid='" + rowPageid + "' or";
    }
  }
  // 使用该page的menu
  var sqlMenu = "select pageid,menunm from sys_menu where" + sqlMenuTmp + " order by pageid";
  sql.query(sqlMenu, null, "menu");
  // 关联该page的page
  var sqlPageNext = "select n.next_pageid,p.pageid,p.pagenm from sys_page_next n,sys_page p where (" + sqlPageNextTmp + ") and n.pageid=p.pageid order by p.pageid";
  sql.query(sqlPageNext, null, "page");

  if (sys.size(sys.result.menu) > 0) {
    sys.setRetList(sys.result.result,sys.result.menu,[["pageid","pageid"]],"menuchildren");
  }
  if (sys.size(sys.result.page) > 0) {
    sys.setRetList(sys.result.result,sys.result.page,[["pageid","next_pageid"]],"pagechildren");
  }
}
sys.setRetData("0", "", "result");