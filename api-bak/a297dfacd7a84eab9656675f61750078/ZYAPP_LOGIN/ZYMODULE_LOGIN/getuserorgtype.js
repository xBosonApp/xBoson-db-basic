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
var openid=sys.request.openid;

if (!openid) {
  // 未设置openid 则使用当前用户id
  openid = sys.getUserIdByOpenId();
}

//获取用户机构列表
var org_type="";
var orglist=sys.getUserOrgList(openid);
if(orglist != null){
    for(r in orglist){
        if(r.orgid==org){
            org_type=r.org_type;
        }
    }
}
//判断org是否是平台
var boolean=se.isPlatformOrg();
var result = [{"isplatorg":boolean,"org_type":org_type}];
if(boolean){
    result = [{"isplatorg":boolean,"org_type":"p"}];
}

sys.addRetData(result,"result");

sys.setRetData("0","","result");