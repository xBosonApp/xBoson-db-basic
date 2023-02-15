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
var action = sys.request.action;

if (action=="get") {
  if (sys.getUserAdminFlag() == '1') {
    var s = 'Select * From sys_prj Order By updatedt desc';
    sql.query(s, [], "result");
  } else {
    //projects 获取项目列表
    // 当前登录用户所在用户组与项目的开发用户组匹配，即可列出该用户所在的所有项目
    // 此处未区分该用户是否是项目管理者
    // 业务上开发用户组只有一个角色而且是开发角色
    var strSql = "select prj.prjid,prj.prjnm,prj.prj_path,prj.ugid,prj.mark,prj.status,prj.createdt,role.roleid from sys_prj prj,sys_ug_user uguser,sys_ug ug,sys_role_ug ugrole,sys_role role where uguser.pid=? and uguser.ugid=prj.ugid and uguser.ugid=ug.ugid and uguser.ugid=ugrole.ugid and ugrole.roleid=role.roleid and role.role_type='02' and ug.status='1' and uguser.status='1' and ugrole.status='1' and role.status='1' ORDER by prj.updatedt desc";
    sql.query(strSql,[sys.getUserPID()],"result");
  }
  sys.setRetData("0","","result");
} 
else if (action=="add") {
    //id:additem
    //name:添加项目
    var prjnm = sys.request.prjnm;
    var prj_path = sys.request.prj_path;
    var ugid = sys.request.ugid;
    var newUg = false;
    if (ugid==null){
        ugid=sys.uuid();
        newUg = true;
    }
    var status= sys.request.status;
    //判断数据库中不允许为空的字段 
    if(prjnm==null||status==null|| prj_path == null){
      sys.setRetData("1", "项目名称、路径或描述未指定");
      return;
    }
    var mark = sys.request.mark;
    var orgid = sys.request.org;
    var pid=sys.getUserPID();
    var adminFlag=sys.getUserAdminFlag();
    //插入sys_role表
    var prjid=sys.uuid();
    var dt = date.currentTimeString();//获取当前时间

    var sqlPrj="insert into sys_prj (prjid,prjnm,prj_path,ugid,mark,status,createdt,updatedt) values (?,?,?,?,?,?,?,?)";
    var prjParams=[prjid,prjnm,prj_path,ugid,mark,"1",dt,dt];
    sql.update(sqlPrj,prjParams,"1");

    var pidList = [];
    if (newUg){
        var newUgSql="insert into sys_ug (ugid,ugnm,mark,status,createdt,updatedt) values (?,?,?,?,?,?)";
        sql.update(newUgSql,[ugid,prjnm+"开发用户组",prjnm+"开发用户组","1",dt,dt],"1");

        var roleid=sys.uuid();
        var params=[roleid,prjnm+"开发角色","1","02",prjnm+"开发角色",orgid,"1",dt,dt];
        var sql="insert into sys_role (roleid,rolenm,op_type,role_type,role_desc,orgid,status,createdt,updatedt) values (?,?,?,?,?,?,?,?,?)";
        sql.update(sql,params,"1");

        var sql2="insert into sys_role_ug (ugid,roleid,status,createdt,updatedt) values (?,?,?,?,?)";
        var params1=[ugid,roleid,"1",dt,dt];
        sql.update(sql2,params1,"1");

        sql.update("insert into sys_ug_user (ugid,pid,status,createdt,updatedt) values (?,?,?,?,?)",
            [ugid,pid,"1",dt,dt],"1");
        list.add(pidList,pid);

        //获取管理员pid
        //并将管理员放到项目人员里
        var adminPid = null;
        if(adminFlag=="1" || adminFlag=="3" || adminFlag=="5"){
        }else{
            var getManaPid = "select pid from sys_tenant_user where orgid=? and admin_flag  in ('1','3','5')";
            var count = sql.query(getManaPid,[orgid],"manapid");
            if(count == 1){
                adminPid = sys.result.manapid[0].pid;
                sql.update("insert into sys_ug_user (ugid,pid,status,createdt,updatedt) values (?,?,?,?,?)",
                    [ugid,adminPid,"1",dt,dt],"1");
                list.add(pidList,adminPid);
            }
        }
    } else {
        sql.query("select * from sys_ug_user where ugid=? and pid=?",[ugid,pid],"ug");
        var ug = sys.result.ug;
        if (ug == null || sys.size(ug) == 0) {
            sql.update("insert into sys_ug_user (ugid,pid,status,createdt,updatedt) values (?,?,?,?,?)",
                [ugid,pid,"1",dt,dt],"1");
            list.add(pidList,pid);
        }
    }

    sql.commit();

    //立即更新用户权限缓存
    var userIdInfo = sys.getUserIdByPID(pidList);
    var userIdList = [];
    for (var row in pidList) {
        list.add(userIdList, userIdInfo[row]);
    }
    se.reloadUserRole(userIdList);
    sys.setRetData("0");
} 
else if (action=="update") {
    var uPrjId = sys.request.prjid;
    var uPrjnm = sys.request.prjnm;
    var uStatus = sys.request.status;
    var uMark = sys.request.mark;

    if (uPrjId==null || uPrjnm==null || uStatus==null || uMark==null) {
        sys.setRetData("1", "项目名称、路径或描述未指定");
        return;
    }
    var dt = date.currentTimeString();//获取当前时间

    // 没有必要？即便项目停用也无需停用开发组的开发角色
    // sql.query("select rug.roleid from sys_prj prj,sys_ug ug,sys_role_ug rug where prj.prjid=? and prj.ugid=ug.ugid and ug.ugid=rug.ugid and ug.status='1' and prj.status='1' and rug.status='1'",[uPrjId],"prjrole");
    // if (!sys.isEmpty(sys.result["prjrole"])) {
    //   var roleid = sys.result["prjrole"][0]["roleid"];
    //   sql.query("select prj.prjid from sys_prj prj,sys_ug ug,sys_role_ug rug,sys_role role where prj.prjid<>? and rug.roleid=? and prj.ugid=ug.ugid and ug.ugid=rug.ugid and rug.roleid=role.roleid and ug.status='1' and prj.status='1' and rug.status='1' and role.status=?",[uPrjId,roleid,uStatus],"existingprj");
    //   // 没有其他有效的项目仍在使用同一个项目组，则停用该项目组角色并删除角色缓存
    //   if (sys.isEmpty(sys.result["existingprj"])) {
    //     sql.update("update sys_role set status=?,updatedt=?",[uStatus,dt],"1");
    //     //删除或追加角色缓存
    //     if (uStatus=='1') {
          
    //     }else{

    //     }
    //   }
    // }
    
    sql.update("update sys_prj set prjnm=?,status=?,mark=?,updatedt=? where prjid=?",
        [uPrjnm,uStatus,uMark,dt,uPrjId], "1");
    sql.commit();
    sys.setRetData("0");
} 
else {
  sys.setRetData("1", "无效的 action 参数");
}