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
//id:selectapi
//name:获取当前系统角色的Api
//测试url：
var openid=sys.request.openid;
var org=sys.request.org;
var sysid=sys.request.sysid;
var status = sys.request.status;
// var orgid = sys.request.orgid;
var roleid = sys.request.roleid;
var apiid = sys.request.apiid;
var moduleid = sys.request.moduleid;
var appid = sys.request.appid;
var pagenum = sys.request.pagenum;
var pagesize = sys.request.pagesize;
var pNDefualt = 1;//默认pagenum值
var PSDefualt = 10;//默认pagesize值

  //查询 sys_system 表
  //判断不为空的字段
if(sysid == null){
  sys.setRetData("1");
  return;
}
//获取用户机构类型
var org_type="";
{
    //获取用户机构列表
    var orglist=sys.getUserOrgList(openid);
    if(orglist != null){
        for(r in orglist){
            if(r.orgid==org){
                org_type=r.org_type;
            }
        }
    }
}

//如果是开发商机构，则先从本机构取api信息
if(org_type=="v"){
    var sqlSel;
//   var sqlWhere=" where 1=1 ";
   var paramSel = [sysid];
 
 sqlSel ="SELECT distinct s.sysid,r.roleid,a.apiid,(select apinm from sys_apis"+
 " where apiid=a.apiid and appid=a.appid and moduleid=a.moduleid) as apinm,"+
" a.moduleid,(select modulenm from sys_modules where appid=a.appid and "+
" moduleid=a.moduleid) as modulenm,a.appid,(select appnm from sys_apps "+
" where appid=a.appid) as appnm,(select help_info from sys_apis"+
" where apiid=a.apiid and appid=a.appid and moduleid=a.moduleid) as help_info,s.status "+ " from sys_system_role r , sys_system s ,sys_role_api a, sys_role d "+
" where r.sysid = s.sysid and s.status = '1' and  a.roleid=r.roleid "+
" and d.roleid=r.roleid and d.roleid=a.roleid  and s.sysid = ? ";

//  if (pagenum == null) {
//   	pagenum = pNDefualt;
//   }
//   if (pagesize == null) {
//   	pagesize = PSDefualt;
//   }
    // var queryPagingCount = sql.queryPaging(sqlSel,paramSel,pagenum,pagesize,"data");
    sql.query(sqlSel,paramSel,"data");
}
//获取本机构拥有的应用角色，开发商取的是sys_system_role中除去sys_role的，租户取的是sys_system_role中的
var approle=[];
{
    var selAppRole="";
    //是开发商
    if(org_type=="v"){
        selAppRole="select roleid from sys_system_role where roleid not in (select roleid from sys_role) and sysid=?";
        sql.query(selAppRole,[sysid],"approle");
    //是租户
    }else if(org_type=="t"){
        selAppRole="select roleid from sys_system_role where sysid=?";
        sql.query(selAppRole,[sysid],"approle");
    }
    approle=sys.result.approle;
}
//获取应用角色对应的applicationid
var appid_r=[];
{
    var selappid="select distinct a.applicationid from sys_pl_org_application a , sys_pl_biz_application b, sys_pl_role_release c where a.applicationid=b.applicationid and b.applicationid=c.applicationid and a.orgid=? and b.biz_status='20' and c.roleid in (select roleid from sys_system_role where sysid=?)";
    sql.query(selappid,[org,sysid],"appid_r");
    appid_r=sys.result.appid_r;
}
//从平台表中获取应用角色的api信息
var appRoleApi=[];
if(sys.size(approle)>0){
    var inwhere="";
    for(r in approle){
        inwhere=inwhere+",'"+r.roleid+"'";
    }
    inwhere=sys.subString(inwhere,1);
    var selAppRoleApi="select d.orgid,a.roleid,b.apiid,b.apiid apinm,b.moduleid,b.moduleid  modulenm,b.appid,b.appid appnm,b.help_info from sys_pl_role_release a,sys_pl_role_api_release b,sys_pl_org_application c,sys_pl_application_release d where c.orgid=? and c.applicationid=a.applicationid and c.applicationid=d.applicationid and a.roleid=b.roleid and a.roleid in ("+inwhere+")";
    sql.query(selAppRoleApi,[org],"approleapi");
    appRoleApi=sys.result.approleapi;
    //获取appnm,modulenm,apinm
    var selname="select a.appnm,b.modulenm,c.apinm from schema.sys_apps a,schema.sys_modules b,schema.sys_apis c where a.appid=b.appid and b.appid=c.appid and a.appid=c.appid and b.moduleid=c.moduleid and c.appid=? and c.moduleid=? and c.apiid=?";
    for(r in appRoleApi){
        selname=sys.replace(selname,"schema",r.orgid);
        se.query(selname,[r.appid,r.moduleid,r.apiid],"apiname");
        if(sys.size(sys.result.apiname)>0){
            map.put(r,"appnm",sys.result.apiname[0].appnm);
            map.put(r,"modulenm",sys.result.apiname[0].modulenm);
            map.put(r,"apinm",sys.result.apiname[0].apinm);
        }
    }
}
//从sys_pl_pub_api_release获取公共api
var pubApi=[];
if(sys.size(appid_r)>0){
    var inwhere_app="";
    for(r in appid_r){
        inwhere_app=inwhere_app+",'"+r.applicationid+"'";
    }
    inwhere_app=sys.subString(inwhere_app,1);
    var selPubApi="select b.orgid,a.appid,a.moduleid,a.apiid,a.help_info from sys_pl_pub_api_release a, sys_pl_org_application b , sys_pl_biz_application c where b.applicationid=c.applicationid and a.applicationid=b.applicationid and c.biz_status='20' and b.orgid=? and  b.applicationid in ("+inwhere_app+")";
    sql.query(selPubApi,[org],"pubapi");
    pubApi=sys.result.pubapi;
    //获取appnm,modulenm,apinm
    selname="select a.appnm,b.modulenm,c.apinm from schema.sys_apps a,schema.sys_modules b,schema.sys_apis c where a.appid=b.appid and b.appid=c.appid and a.appid=c.appid and b.moduleid=c.moduleid and c.appid=? and c.moduleid=? and c.apiid=?";
    for(r in pubApi){
        selname=sys.replace(selname,"schema",r.orgid);
        se.query(selname,[r.appid,r.moduleid,r.apiid],"apiname");
        if(sys.size(sys.result.apiname)>0){
            map.put(r,"appnm",sys.result.apiname[0].appnm);
            map.put(r,"modulenm",sys.result.apiname[0].modulenm);
            map.put(r,"apinm",sys.result.apiname[0].apinm);
            map.put(r,"ispub",true);
        }
    }
}
//合并data和appRoleApi
var result=[];
if(sys.result.data != null){
    for(r in sys.result.data){
        list.add(result,r);
    }
}
if(sys.size(appRoleApi)>0){
    for(r in appRoleApi){
        list.add(result,r);
    }
}
if(sys.size(pubApi)>0){
    for(r in pubApi){
        list.add(result,r);
    }
}
    
    //转换数据格式
    // var result = sys.result.data;
    // var result=[{"appid":"1","moduleid":"2","apiid":"3","appnm":"1n","modulenm":"2n","apinm":"3n"},{"appid":"11","moduleid":"22","apiid":"33","appnm":"11n","modulenm":"22n","apinm":"33n"},{"appid":"1","moduleid":"2","apiid":"3e","appnm":"1n","modulenm":"2n","apinm":"3en"}];
    //app
    var app_arr=[];
    for(r in result){
        var tmp = {"appid":r.appid,"appnm":r.appnm,"shownm":r.appnm};
        if(!list.contain(app_arr,tmp)){
            list.add(app_arr,tmp);
        }
    }
    //mod
    var mod_arr=[];
    for(r in result){
        var tmp = {"appid":r.appid,"appnm":r.appnm,"moduleid":r.moduleid,"modulenm":r.modulenm,"shownm":r.modulenm};
        if(!list.contain(mod_arr,tmp)){
            list.add(mod_arr,tmp);
        }
    }
    //api
    var api_arr=[];
    for(r in result){
        var tmp = {"appid":r.appid,"appnm":r.appnm,"moduleid":r.moduleid,"modulenm":r.modulenm,"apiid":r.apiid,"apinm":r.apinm,"shownm":r.apinm};
        if(!list.contain(api_arr,tmp)){
            map.put(tmp,"ispub",r.ispub==true ? true : false);
            map.put(tmp,"roleid",r.roleid);
            map.put(tmp,"orgid",r.orgid);
            map.put(tmp,"help_info",r.help_info);
            list.add(api_arr,tmp);
        }
    }
    
    sys.setRetList(mod_arr,api_arr,[["appid","appid"],["moduleid","moduleid"]],"children");
    sys.setRetList(app_arr,mod_arr,[["appid","appid"]],"children");
    sys.addRetData(app_arr,"result");
    sys.setRetData("0","","result");
    // sys.setRetData("0","","result");