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
//添加菜单
var menuNm = sys.request.menunm;
var p_menuid = sys.request.p_menuid;
var uri = sys.request.uri;
var pageid= sys.request.pageid;
var menu_desc = sys.request.menu_desc;
var levels = sys.request.levels;
var menu_Icon = sys.request.menu_icon;
var prjid = sys.request.prjid;
var org = sys.request.org;

//插入sys_menu
if (menuNm == null || levels == null) {
  sys.setRetData("1");
  return;
}
//菜单层数最大为10层
if(sys.parseInt(levels) > 10){
  sys.setRetData("2","菜单层数最大为10层");
  return;
}
var menuId = sys.uuid();
//获取sorting_order
var getso="";
var socnt=0;
if(p_menuid!=null){
    getso="select menuid,sorting_order from sys_menu where p_menuid=? order by sorting_order desc";
    socnt=sql.query(getso,[p_menuid],"so_r");
}else{
    getso="select menuid,sorting_order from sys_menu where levels=1 order by sorting_order desc";
    socnt=sql.query(getso,[],"so_r");
}
var so_r=sys.result.so_r;
var sorting_order;
if(socnt==0){
    sorting_order=0;
}else{
    sorting_order=sys.parseInt(so_r[0].sorting_order)+1;
}

// var link_type = null;
// if (pageid!=null) {
//   link_type="1";
// } else if (uri!=null) {
//   if (sys.startWith(sys.toLowerCase(uri), "http")) {
//     link_type="2";
//   } else {
//     link_type="3";
//   }
// }
var dt = sys.currentTimeString();//获取当前时间
var sql_Ins = "insert into sys_menu (menuid,p_menuid,levels,menu_icon,menunm,pageid,uri,sorting_order,prjid,menu_desc,orgid,status,createdt,updatedt) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
var paramIns = [menuId,p_menuid,levels,menu_Icon,menuNm,pageid,uri,sorting_order,prjid,menu_desc,org,"1",dt,dt];
sql.update(sql_Ins,paramIns,"1");
//添加成功后如果添加的父菜单为无效，把父菜单等上级也改成有效
var id_array1=[menuId];
var sql1="select p_menuid from sys_menu where menuid = ? and status<>'1'";
var param1=[menuId];
var count1=sql.query(sql1,param1,"result11");
var result11=sys.result.result11;
if (sys.size(result11)>0){
if(result11[0].p_menuid!=''){
    list.add(id_array1, result11[0].p_menuid);
    param1=[result11[0].p_menuid];
    count1=sql.query(sql1,param1,"result22");
    var result22=sys.result.result22;
    if(result22[0].p_menuid!=''){
        list.add(id_array1, result22[0].p_menuid);
        param1=[result22[0].p_menuid];
        count1=sql.query(sql1,param1,"result33");
        var result33=sys.result.result33;
        if(result33[0].p_menuid!=''){
           list.add(id_array1, result33[0].p_menuid);
            param1=[result33[0].p_menuid];
            count1=sql.query(sql1,param1,"result44");
            var result44=sys.result.result44;
            if(result44[0].p_menuid!=''){
                list.add(id_array1, result44[0].p_menuid);
                param1=[result44[0].p_menuid];
                count1=sql.query(sql1,param1,"result55");
                var result55=sys.result.result55;
                if(result55[0].p_menuid!=''){
                    list.add(id_array1, result55[0].p_menuid);
                    param1=[result55[0].p_menuid];
                    count1=sql.query(sql1,param1,"result66");
                    var result66=sys.result.result66;
                    if(result66[0].p_menuid!=''){
                        list.add(id_array1, result66[0].p_menuid);
                        param1=[result66[0].p_menuid];
                        count1=sql.query(sql1,param1,"result77");
                        var result77=sys.result.result77;
                        if(result77[0].p_menuid!=''){
                            list.add(id_array1, result77[0].p_menuid);
                            param1=[result77[0].p_menuid];
                            count1=sql.query(sql1,param1,"result88");
                            var result88=sys.result.result88;
                            if(result88[0].p_menuid!=''){
                               list.add(id_array1, result88[0].p_menuid);
                                param1=[result88[0].p_menuid];
                                count1=sql.query(sql1,param1,"result99");
                                var result99=sys.result.result99;
                                if(result99[0].p_menuid!=''){
                                    list.add(id_array1, result99[0].p_menuid);
                                }
                            }
                        }
                    }
                }
            }
        }
    }   
}

var j=0;
var sql_d1="update sys_menu set status='1',updatedt=? where menuid=?";
var param_d1=[];
while(j<sys.size(id_array1)){
    param_d1=[dt,id_array1[j]];
    sql.update(sql_d1,param_d1,"1");
    j=j+1;
}
}
//添加成功后删除父菜单的app,mod,uri以及roleid
if(p_menuid!=null){
  var sql_d="update sys_menu set uri=null,pageid=null where menuid=?";
  var param_d=[p_menuid];
  sql.update(sql_d,param_d,"1");
}
sql.commit();

//status可能变更，所以更新缓存
var sqlRole="select ugrole.roleid roleid from sys_prj prj,sys_ug ug,sys_role_ug ugrole,sys_role role where prj.prjid=? and prj.ugid=ug.ugid and prj.ugid=ugrole.ugid and ugrole.roleid=role.roleid and prj.status='1' and ug.status='1' and ugrole.status='1' and role.status='1'";
sql.query(sqlRole, [prjid], "roleidSet");
var roleidSet = sys.result["roleidSet"];
if (!sys.isEmpty(roleidSet)) {
	var roleid=roleidSet[0]["roleid"];
	sql.query("select prj.prjid from sys_prj prj,sys_ug ug,sys_role_ug rug,sys_role role where rug.roleid=? and rug.ugid=prj.ugid and rug.ugid=ug.ugid and role.roleid=rug.roleid and prj.status='1' and ug.status='1' and rug.status='1' and role.status='1'",[roleid],"allprjwithsameug");
	var allprjwithsameug=sys.result["allprjwithsameug"];
	var sqlAllData="select menuid from sys_menu where menuid not in (select distinct p_menuid from sys_menu where p_menuid is not null) and status='1' and (";
	var l = sys.size(allprjwithsameug);
	for (var i=0;i<l;i++) {
	  if (i==l-1) {
	    sqlAllData=sqlAllData+" prjid='"+allprjwithsameug[i]["prjid"]+"')";
	  } else {
	    sqlAllData=sqlAllData+" prjid='"+allprjwithsameug[i]["prjid"]+"' or";
	  }
	}
	sql.query(sqlAllData,null,"leaf");
  var rParams=[];
	for(row in sys.result["leaf"]){
	  list.add(rParams,[roleid,row["menuid"],"1",dt,dt]);
	}
	sql.update("delete from sys_role_menu where roleid=?",[roleid],"1");
	sql.updateBatch("insert into sys_role_menu (roleid,menuid,status,createdt,updatedt) values (?,?,?,?,?)",rParams,"1");
	sql.commit();
	// 更新角色缓存
	http.platformGet({"app":"auth","mod":"rbac","api":"reloadrolecache"},{"roleid":roleid,"reload_type":"03"});
}

//返回菜单id
var menuid=[{"menuid":menuId,"flag":true}];
sys.addRetData(menuid,"result");
sys.setRetData("0","","result");