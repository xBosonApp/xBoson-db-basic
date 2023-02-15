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
//id:getuserorg
//name:获取用户所属的机构 List
//测试url:

var openid=sys.request.openid;

if (!openid) {
  // 未设置openid 则使用当前用户id
  openid = sys.getUserIdByOpenId();
}

var userOrgList = sys.getUserOrgList(openid);
if(userOrgList == null){
    userOrgList = [];
}

// 是否平台机构
for(r in userOrgList){
    //判断org是否是平台
    var boolean=se.isPlatformOrg(r.orgid);
    map.put(r,"isplatorg",boolean);
}
sys.addRetData(userOrgList,"result");
sys.setRetData("0","","result");