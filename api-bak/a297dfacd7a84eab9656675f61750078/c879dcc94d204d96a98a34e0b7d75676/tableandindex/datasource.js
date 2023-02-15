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
//id:datasource
//name: 数据源下拉菜单
var org = sys.request.org;
var openid=sys.request.openid;

//获取机构所属的数据源
//var getdb = "select did,dn from sys_pl_drm_ds001 where owner=? and status='1'";
var getdb = `
SELECT 
    a.did, a.dn, b.de0810013j orgname
FROM
    sys_pl_drm_ds001 a
        LEFT JOIN
    mdm_org b ON a.owner = b.orgid
Where
    a.owner = ?
    AND a.status = '1'
`

var cnt=sql.query(getdb, [org]);
var result=sys.result.result;

//获取平台在用的数据源
// var getplatdb = "select did,dn from sys_pl_drm_ds001 where did=? and status='1'";
// var getplatdb_cnt = sql.query(getplatdb,["00000000000000000000000000000000"],"plat_drm");
// if(getplatdb_cnt == 0){
//     sys.setRetData("2","异常，没有获取到平台数据源！");
//     return;
// }
// var plat_drm = sys.result.plat_drm;

var data = [];

    
for(r in result){
    var full = r.dn +' ('+ r.orgname +')';
    var tmp = {"id": r.did, "name": full, "text": full};
    list.add(data, tmp);
}

//不是平台调用接口时，也返回平台数据源（00000000000000000000000000000000）
if(!se.isPlatformOrg()){
    var orgList=sys.getUserOrgList(openid);
    if(orgList==null){
        sys.setRetDate("2","获取用户机构列表异常！");
        return;
    }
    for(r in orgList){
        if(r.orgid==org){
            var tmp = {"id":"00000000000000000000000000000000", "name":r.orgnm, "text":r.orgnm+"(00000000000000000000000000000000)"};
            list.add(data, tmp);
            break;
        }
    }
}

sys.addRetData(data,"data");
sys.setRetData("0","","data");