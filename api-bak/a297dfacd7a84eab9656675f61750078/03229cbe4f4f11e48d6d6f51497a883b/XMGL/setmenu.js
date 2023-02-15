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
//修改菜单
var menuId = sys.request.menuid;
var menuNm = sys.request.menunm;
var p_menuid = sys.request.p_menuid;
var uri = sys.request.uri;
var menu_desc = sys.request.menu_desc;
var status = sys.request.status;
var levels = sys.request.levels;
var menu_Icon = sys.request.menu_icon;
var pageid = sys.request.pageid;
var prjid = sys.request.prjid;
//插入sys_rbac_menu
if (menuId == null || levels == null || status==null) {
  sys.setRetData("1");
  return;
}
var dt = date.currentTimeString();//获取当前时间
//如果状态修改为无效，则把子菜单的状态也变为无效
if(status=="0"){
  var id_array=[menuId];
  var sql0="select menuid from sys_menu where p_menuid = ?";
  var param0=[menuId];
  var count0=sql.query(sql0,param0,"result0");
  var result0=sys.result.result0;
  var param=[];
  var count=0;
  if(count0>0){
    for(r in result0){
    list.add(id_array,r.menuid);
    param=[r.menuid];
    count=sql.query(sql0,param,"result1");
    var result1=sys.result.result1;
    if(count>0){
        count=0;
        for(r1 in result1){
            list.add(id_array,r1.menuid);
            param=[r1.menuid];
            count=sql.query(sql0,param,"result2");
            var result2=sys.result.result2;
            if(count>0){
                count=0;
                for(r2 in result2){
                    list.add(id_array,r2.menuid);
                    param=[r2.menuid];
                    count=sql.query(sql0,param,"result3");
                    var result3=sys.result.result3;
                    if(count>0){
                        count=0;
                        for(r3 in result3){
                            list.add(id_array,r3.menuid);
                            param=[r3.menuid];
                            count=sql.query(sql0,param,"result4");
                            var result4=sys.result.result4;
                            if(count>0){
                                count=0;
                                for(r4 in result4){
                                    list.add(id_array,r4.menuid);
                                    param=[r4.menuid];
                                    count=sql.query(sql0,param,"result5");
                                    var result5=sys.result.result5;
                                    if(count>0){
                                        count=0;
                                        for(r5 in result5){
                                            list.add(id_array,r5.menuid);
                                            param=[r5.menuid];
                                            count=sql.query(sql0,param,"result6");
                                            var result6=sys.result.result6;
                                            if(count>0){
                                                count=0;
                                                for(r6 in result6){
                                                    list.add(id_array,r6.menuid);
                                                    param=[r6.menuid];
                                                    count=sql.query(sql0,param,"result7");
                                                    var result7=sys.result.result7;
                                                    if(count>0){
                                                        count=0;
                                                        for(r7 in result7){
                                                            list.add(id_array,r7.menuid);
                                                            param=[r7.menuid];
                                                            count=sql.query(sql0,param,"result8");
                                                            var result8=sys.result.result8;
                                                            if(count>0){
                                                                count=0;
                                                                for(r8 in result8){
                                                                    list.add(id_array,r8.menuid);
                                                                    param=[r8.menuid];
                                                                    count=sql.query(sql0,param,"result9");
                                                                    var result9=sys.result.result9;
                                                                    if(count>0){
                                                                        count=0;
                                                                        for(r9 in result9){
                                                                            list.add(id_array,r9.menuid);
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
}
  }
  var i=0;
  var sql_del="update sys_menu set status='0',updatedt=? where menuid=?";
  var param_del=[];
  while(i<sys.size(id_array)){
      param_del=[dt,id_array[i]];
      sql.update(sql_del,param_del,"1");
      i=i+1;
  }
  sql.commit();
}

//当更改有效时，把父的也改成有效
if(status=='1'){
var id_array1=[menuId];

var sql1="select p_menuid from sys_menu where menuid = ?";
var param1=[menuId];
var count1=sql.query(sql1,param1,"result11");
var result11=sys.result.result11;

if(result11[0].p_menuid!=''){
    list.add(id_array1,result11[0].p_menuid);
    param1=[result11[0].p_menuid];
    count1=sql.query(sql1,param1,"result22");
    var result22=sys.result.result22;
    if(result22[0].p_menuid!=''){
        list.add(id_array1,result22[0].p_menuid);
        param1=[result22[0].p_menuid];
        count1=sql.query(sql1,param1,"result33");
        var result33=sys.result.result33;
        if(result33[0].p_menuid!=''){
            list.add(id_array1,result33[0].p_menuid);
            param1=[result33[0].p_menuid];
            count1=sql.query(sql1,param1,"result44");
            var result44=sys.result.result44;
            if(result44[0].p_menuid!=''){
                list.add(id_array1,result44[0].p_menuid);
                param1=[result44[0].p_menuid];
                count1=sql.query(sql1,param1,"result55");
                var result55=sys.result.result55;
                if(result55[0].p_menuid!=''){
                    list.add(id_array1,result55[0].p_menuid);
                    param1=[result55[0].p_menuid];
                    count1=sql.query(sql1,param1,"result66");
                    var result66=sys.result.result66;
                    if(result66[0].p_menuid!=''){
                        list.add(id_array1,result66[0].p_menuid);
                        param1=[result66[0].p_menuid];
                        count1=sql.query(sql1,param1,"result77");
                        var result77=sys.result.result77;
                        if(result77[0].p_menuid!=''){
                            list.add(id_array1,result77[0].p_menuid);
                            param1=[result77[0].p_menuid];
                            count1=sql.query(sql1,param1,"result88");
                            var result88=sys.result.result88;
                            if(result88[0].p_menuid!=''){
                                list.add(id_array1,result88[0].p_menuid);
                                param1=[result88[0].p_menuid];
                                count1=sql.query(sql1,param1,"result99");
                                var result99=sys.result.result99;
                                if(result99[0].p_menuid!=''){
                                    list.add(id_array1,result99[0].p_menuid);
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
sql.commit();
}

var sql_Upd = "update sys_menu set menunm = ?,menu_icon = ?,p_menuid = ?,uri = ?,pageid=?,menu_desc = ?,status = ?,levels = ?,updatedt = ? where menuid = ?";
  
//如果修改的菜单有子菜单，则把修改的菜单的app,mod ,uri字段的值修改为空
var sql_c="select menuid from sys_menu where p_menuid=?";
var param_c=[menuId];
var cnt_c=sql.query(sql_c,param_c);
if(cnt_c>0){
  uri=null;
  pageid=null;
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
var paramUpd = [menuNm,menu_Icon,p_menuid,uri,pageid,menu_desc,status,levels,dt,menuId];
var updCount = sql.update(sql_Upd,paramUpd);

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
	for (var ii=0;ii<l;ii++) {
	  if (ii==l-1) {
	    sqlAllData=sqlAllData+" prjid='"+allprjwithsameug[ii]["prjid"]+"')";
	  } else {
	    sqlAllData=sqlAllData+" prjid='"+allprjwithsameug[ii]["prjid"]+"' or";
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

var re0=[{"flag":true}];
sys.addRetData(re0,"result");
sys.setRetData("0","","result");