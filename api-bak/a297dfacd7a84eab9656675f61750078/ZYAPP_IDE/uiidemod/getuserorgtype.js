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
//id:getuserorgtype
//name:获取用户机构类型
var orgid=sys.request.orgid;
var openid=sys.request.openid;
var orglist=sys.getUserOrgList(openid);

//orglist为空，返回
if(orglist == null){
  orglist = [];
}

//(t:租户，v：开发商，p：平台)
var result=[];
for(row in orglist){
    if(row.orgid==orgid){
        //1. 平台
        if(se.isPlatformOrg(orgid)){
            list.add(result, {"orgid":row.orgid,"orgnm":row.orgnm,"org_type":"p"});
            break;
        }
        //2. 开发商
        if(row.org_type=='v'){
            list.add(result, {"orgid":row.orgid,"orgnm":row.orgnm,"org_type":"v"});
            break;
        }
        //3. 租户不返回
    }
}
if (sys.size(result) == 0) {
  sys.setRetData("1000");
} else {
  sys.addRetData(result,"result");
  sys.setRetData("0","","result");
}