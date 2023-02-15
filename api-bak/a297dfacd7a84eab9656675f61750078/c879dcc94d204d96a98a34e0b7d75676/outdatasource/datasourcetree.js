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
//id:datasourcetree
//name:数据源tree
sys.printValue("111111");
var openid=sys.request.openid;
var org = sys.request.org;
var gettree = "select did,dn,dbtype,en,cn,dn shownm from sys_pl_drm_ds001 where owner=? and status='1'";

sql.query(gettree,[org]);

var result = sys.result.result;

if(!se.isPlatformOrg()){
    var orgList=sys.getUserOrgList(openid);
    if(orgList==null){
        sys.setRetDate("2","获取用户机构列表异常！");
        return;
    }
    sys.printValue(orgList);
    for(r in orgList){
        if(r.orgid==org){
            list.add(result, {"did":"00000000000000000000000000000000","dn":r.orgnm,"shownm":r.orgnm});
            break;
        }
    }
}

for(r in result){
    map.put(r,"isParent",true);
    map.put(r,"flag","1");
}

sys.setRetData("0","","result");