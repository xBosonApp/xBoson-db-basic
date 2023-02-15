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
//id: setmenuroleid
//name: 为指定菜单添加角色

var org=sys.request.org;
var openid=sys.request.openid;
var menuid_i=sys.request.menuid_i;  //向roleid追加角色的menuid
var menuid_d=sys.request.menuid_d;  //向roleid减去角色的menuid
var roleid=sys.request.roleid;

/*if(menuid_i==null && menuid_d==null){
    sys.setRetData("0");
    return;
}*/
//adminflag
var adminflag=sys.getUserAdminFlag(openid,org);
//如果是普通用户，不返回数据
// if(adminflag!="1"&&adminflag!="3"&&adminflag!="5"){
//     sys.setRetData("1100");
//     return;
// }
//menuid_i和menuid_d必须是底层菜单，检查是否是底层菜单
var check="select menuid from sys_menu where 1=1 and ( ";
var wheremenuid="";
var menuid_i_arr=[];
var menuid_d_arr=[];
if(menuid_i!=null){
    menuid_i_arr=sys.split(menuid_i,",");
}
if(menuid_d!=null){
    menuid_d_arr=sys.split(menuid_d,",");
}
if(sys.size(menuid_i_arr)>0 && menuid_i_arr[0]!=null){
    for(r in menuid_i_arr){
        wheremenuid=wheremenuid+" p_menuid = '"+r+"' or";
    }
}

if(sys.size(menuid_d_arr)>0 && menuid_d_arr[0]!=null){
    for(r in menuid_d_arr){
        wheremenuid=wheremenuid+" p_menuid = '"+r+"' or";
    }
}
var cnt=0;
if(wheremenuid!=""){
    wheremenuid=sys.subStringTo(wheremenuid,0,sys.length(wheremenuid)-2)+")";  
    cnt = sql.query(check+wheremenuid,[],"checkmenuid");
}else{
    sys.setRetData("0");
    return;
}
if(cnt>0){
    sys.setRetData("2","menuid_i或者menuid_d参数不正确！");
    return;
}
//检查menuid结束

var menuinfoSql="select roleid,status from sys_menu where menuid=?";
var insert_role1="update sys_menu set roleid=?, status='1' where menuid=?";
var insert_role2="update sys_menu set status='1' where menuid=?";
//勾上时操作
if(sys.size(menuid_i_arr)!=0 && menuid_i_arr[0] != null){
    for(r in menuid_i_arr){
        sql.query(menuinfoSql,[r],"menuinfo");
        var menuinfo=sys.result.menuinfo;
        
        if(sys.size(menuinfo)==0){
            sys.setRetData("2","接口异常，菜单ID："+r+"不存在！");
            return;
        }
        var status=menuinfo[0].status;
        var roleidstr=menuinfo[0].roleid;
        
        if(sys.contain(roleidstr, roleid)){
            sql.update(insert_role2,[r],"1");    
        }else{
            //添加roleid
            if(roleidstr==null || roleidstr==""){
                roleidstr=roleid;
            }else{
                roleidstr=roleidstr+","+roleid;
            }
            sql.update(insert_role1,[roleidstr,r],"1");
        }
    }
}
//取消勾上时操作
var update_roleid="update sys_menu set roleid=? where menuid=? and orgid=?";

if(sys.size(menuid_d_arr)!=0 && menuid_d_arr[0] != null){
    for(r in menuid_d_arr){
        sql.query(menuinfoSql,[r],"menuinfo");
        var menuinfo=sys.result.menuinfo;
        
        var roleidstr=menuinfo[0].roleid;
        var newroleidStr="";
        //移除roleidstr中的roleid
        if(sys.startWith(roleidstr,roleid)){
            if(sys.contain(roleidstr,",")){
                newroleidStr=sys.subString(roleidstr,sys.length(roleid)+1);
            }else{
                newroleidStr=null;
            }
        }else{
            newroleidStr=sys.replace(roleidstr,","+roleid,"");
        }
        sql.update(update_roleid,[newroleidStr,r,org],"1");
    }
}
sql.commit();
sys.setRetData("0");