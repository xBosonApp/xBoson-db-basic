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
var orgid=sys.request.orgid;

//删除此机构关联到平台的数据
//sys_pl_drm_ds001, sys_system, sys_pl_org_application, sys_pl_application_release, 等
{
    //
    //数据源表
    var sqldel0="delete from sys_pl_drm_ds001 where owner=?";
    //系统信息表
    var sqldel1="delete from sys_system where orgid=?";
    //应用发布历史表
    var sqldel4="delete from sys_pl_application_release_his where applicationid in (select applicationid from sys_pl_application_release where orgid=?)";
    //标准应用表
    var sqldel5="delete from sys_pl_biz_application where applicationid in (select applicationid from sys_pl_application_release where orgid=?)";
    //菜单发布表
    var sqldel6="delete from sys_pl_menu_release where applicationid in (select applicationid from sys_pl_application_release where orgid=?)";
    //公共api发布表
    var sqldel7="delete from sys_pl_menu_release where applicationid in (select applicationid from sys_pl_application_release where orgid=?)";
    //角色api发布表
    var sqldel8="delete from sys_pl_role_api_release where roleid in (select roleid from sys_pl_role_release where applicationid in (select applicationid from sys_pl_application_release where orgid=?))";
    //角色发布表
    var sqldel9="delete from sys_pl_role_release where applicationid in (select applicationid from sys_pl_application_release where orgid=?)";
    //应用发布表
    var sqldel3="delete from sys_pl_application_release where orgid=?";
    //第三方应用注册表
    var sqldel2="delete from sys_pl_tp_app where orgid=?";
    try{
        var num0=sql.update(sqldel0,[orgid],"1");
        var num1=sql.update(sqldel1,[orgid],"1");
        
        var num4=sql.update(sqldel4,[orgid],"1");
        var num5=sql.update(sqldel5,[orgid],"1");
        var num6=sql.update(sqldel6,[orgid],"1");
        var num7=sql.update(sqldel7,[orgid],"1");
        var num8=sql.update(sqldel8,[orgid],"1");
        var num9=sql.update(sqldel9,[orgid],"1");
        var num3=sql.update(sqldel3,[orgid],"1");
        var num2=sql.update(sqldel2,[orgid],"1");
        //测试用
        num0=num0+num1+num2+num3+num4+num5+num6+num7+num8+num9;
        if(num0>50){
            sys.setRetData("2","删除数据太多，请检查，异常");
            return;
        }else{
            sql.commit();
        }
        sys.setRetData("0");
    }catch(e){
        sql.rollback();
        sys.setRetData("2","清除机构在平台的旧数据异常");
        return;
    }
}