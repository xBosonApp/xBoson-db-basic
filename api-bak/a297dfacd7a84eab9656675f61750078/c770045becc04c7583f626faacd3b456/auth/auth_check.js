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
var openid = sys.request.openid;
var org = sys.request.org;
var uri = sys.request.__uri__;    // ds/api  or ds/pub
var sys_var = sys.request.sys;  // 是否系统调用
var typecd = sys.request.typecd;  //模型ID

var isAuth = false;    // 是否有权限
// 检查参数
if(typecd == null || uri == null){
    sys.setRetData("1");
    return;
}
// 模型是否存在
var modelinfo = se.getCache(_CACHE_REGION_BIZ_MODEL_,typecd);
if(modelinfo == null){
    sys.setRetData("2","模型不存在！");
    return;
}
// 非公共模型
if(sys.contain(uri,"/api/")){
    // 用户调用
    if(sys_var == null){
        var loginCache = se.getCache(_CACHE_REGION_LOGON_,openid);
        var userOrgRole = loginCache[_U_ORG_ROLE_ID_LIST_];
        //本机构角色验证
        for(r in userOrgRole){
            if(r["orgid"] == org){
                var tmp = se.getCache(_CACHE_REGION_SYS_AUTHORITY_,org+":"+r["roleid"]+":"+typecd);
                if(tmp != null){
                    isAuth = true;
                    break;
                }
            }
        }
        if(!isAuth){
            //已发布上线的应用的角色验证
            for(r in userOrgRole){
                if(r["orgid"] == org){
                    var tmp = se.getCache(_CACHE_REGION_SYS_AUTHORITY_,"application_normal:"+r["roleid"]+":"+typecd);
                    if(tmp != null){
                        isAuth = true;
                        break;
                    }
                }
            }
        }
    }
    // 系统调用
    else{
        var systemRole = se.getCache(_CACHE_REGION_SYS_AUTHORITY_,org+":systems:"+sys_var);
        for(r in systemRole){
            if(r["orgid"] == org){
                var tmp = se.getCache(_CACHE_REGION_SYS_AUTHORITY_,org+":"+r["roleid"]+":"+typecd);
                if(tmp != null){
                    isAuth = true;
                    break;
                }
            }
        }
    }
}
// 公共模型
else if(sys.contain(uri,"/pub/")){
    var tmp = se.getCache(_CACHE_REGION_SYS_AUTHORITY_,"application_pub:"+typecd);
    if(tmp != null){
        isAuth = true;
    }
}
sys.addRetData([{"isAuth":isAuth}],"result");
sys.setRetData("0","","result");