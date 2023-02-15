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
//uiauth UI权限验证及控制数据
var pageid=sys.request.pageid;
if (pageid==null) {
  sys.setRetData("1","权限验证页面未指定");
  return;
}
var ret=se.isAuthorizedUI(pageid);
if (ret==null) {
  var orgid=sys.request.org;
  var pageInfo=se.getCache(_CACHE_REGION_PAGE_,orgid+":"+pageid);
  if (pageInfo==null) {
    sys.setRetData("1111", "抱歉，您访问的页面不存在");
  } else {
    sys.setRetData("1110", "抱歉，您暂时没有被授权访问 "+pageInfo.pagenm);
  }
} else {
  sys.addRetData(ret);
  sys.setRetData("0",null,"result");
}