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
// id: gettables
// name: 获取用户物理表

var org = sys.request.org;
var openid=sys.request.openid;
var typecd = sys.request.typecd;
var pagesize = sys.request.pagesize;
var pagenum = sys.request.pagenum;
//查询条件
var en = sys.request.en;
var cn = sys.request.cn;

if(typecd == null){
    sys.setRetData("1","缺少必要参数");
    return;
}

var gettable = "select drm.did, drm.cn dbnm,mdm.typecd,mdm.en, mdm.cn, mdm.status, mdm.createdt, mdm.updatedt from sys_md_mm003 mdm, sys_pl_drm_ds001 drm where mdm.did = drm.did and mdm.typecd=? and drm.status = '1'";

var params = [typecd];
if(en != null){
    gettable = gettable + " and mdm.en like ?";
    list.add(params, "%"+en+"%");
}

if(cn != null){
    gettable = gettable + " and mdm.cn like ?";
    list.add(params, "%"+cn+"%");
}
if(pagesize == null){
    pagesize = 20;
}
if(pagenum == null){
    pagenum = 1;
}
var cnt = sql.queryPaging(gettable,params,pagenum,pagesize);

//00000000000000000000000000000000对应名称改为当前机构名
var orgList=sys.getUserOrgList(openid);
if(orgList!=null){
    var orgnm="";
    for(r in orgList){
        if(r.orgid==org){
            orgnm=r.orgnm;
            break;
        }
    }
    for(r in sys.result.result){
        if(r.did=="00000000000000000000000000000000"){
            map.put(r,"dbnm",orgnm);
        }
    }
}else{
    sys.setRetDate("2","获取用户机构列表异常！");
    return;
}

sys.setRetData("0","","result");