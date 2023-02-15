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
//name: 获取机构角色（包含通用角色）
var org=sys.request.org;
var openid=sys.request.openid;
var adminflag=sys.getUserAdminFlag(openid,org);

var getRole="select a.roleid id, a.rolenm name, a.rolenm text, a.role_type, b.dictnm  role_type_name from sys_role a, link_vender.sys_mdm002 b where b.typecd='ZR.0046' and a.role_type=b.dictcd and a.status='1' and b.status='1'";

var cnt=sql.query(getRole,[],"dbrole");
//db角色
var dbrole=sys.result.dbrole;
//转成树形结构 (以role_type分类)
var dbrole2=[];
for(r in dbrole){
    var isFind=false;   //角色类型
    for(_r in dbrole2){
        if(_r.id == r.role_type){
            isFind=true;
            break;
        }
    }
    if(isFind){
        for(_r in dbrole2){
            if(_r.id == r.role_type){
                list.add(_r.children,{
                    id:r.id,
                    name:r.name,
                    text:r.text
                });
            }
        }
    }else{
        list.add(dbrole2,{
            id:r.role_type,
            name:r.role_type_name,
            text:r.role_type_name+"("+r.role_type+")",
            disabled:true,
            children:[{
                id:r.id,
                name:r.name,
                text:r.text
            }]
        });
    }
}

//合并角色
// var rolelist=[];

// if(adminflag!='1'){
//     //平台通用角色
//     // var ret=sys.getCommonRoles(org);
//     // for(r in ret){
//     //     @r.put("text",r.name);
//     //     @rolelist.add(r);
//     // }
// }
//获取机构拥有的app的发布的角色
var getapps="select b.roleid id, b.rolenm name, b.rolenm text, c.applicationid, c.applicationnm from sys_pl_org_application a, sys_pl_role_release b, sys_pl_application_release c where a.applicationid=b.applicationid and b.applicationid=c.applicationid and a.status='1' and b.status='1' and c.status='1' and a.orgid = ? ";
sql.query(getapps,[org],"approle");
var approle=sys.result.approle;

var approle2 = [];
// 转成树形结构（以应用ID分类）
for(r in approle){
    var isFind=false;   //应用ID
    for(_r in approle2){
        if(_r.id == r.applicationid){
            isFind=true;
            break;
        }
    }
    if(isFind){
        for(_r in approle2){
            if(_r.id == r.applicationid){
                list.add(_r.children,{
                    id:r.id,
                    name:r.name,
                    text:r.text
                });
            }
        }
    }else{
        list.add(approle2,{
            id:r.applicationid,
            name:r.applicationnm,
            text:r.applicationnm+"("+r.applicationid+")",
            disabled:true,
            children:[{
                id:r.id,
                name:r.name,
                text:r.text
            }]
        });
    }
}

// for(d in dbrole){
//     @rolelist.add(d);
// }

var tmp = {id:'approle', name: '应用角色', text: '应用角色', disabled:true, children:approle2};

list.add(dbrole2,tmp);

sys.addRetData(dbrole2,"result");
sys.setRetData("0","","result");