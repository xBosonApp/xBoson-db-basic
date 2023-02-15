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
//id:deletemenu
//name:删除菜单
var prjid = sys.request.prjid;
var menuid=sys.request.menuid;

if(menuid==null){
    sys.setRetData("1");
    return;
}

var id_array=[menuid];

var sql0="select menuid from sys_menu where p_menuid = ?";
var param0=[menuid];
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
var sql_del="delete from sys_menu where menuid=?";
var param_del=[];
while(i<sys.size(id_array)){
    param_del=[id_array[i]];
    sql.update(sql_del,param_del,"1");
    i=i+1;
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
	for (var ii=0;ii<l;ii++) {
	  if (ii==l-1) {
	    sqlAllData=sqlAllData+" prjid='"+allprjwithsameug[ii]["prjid"]+"')";
	  } else {
	    sqlAllData=sqlAllData+" prjid='"+allprjwithsameug[ii]["prjid"]+"' or";
	  }
	}
	sql.query(sqlAllData,null,"leaf");
  var rParams=[];
  var dt = date.currentTimeString();
	for(row in sys.result["leaf"]){
	  list.add(rParams,[roleid,row["menuid"],"1",dt,dt]);
	}
	sql.update("delete from sys_role_menu where roleid=?",[roleid],"1");
	sql.updateBatch("insert into sys_role_menu (roleid,menuid,status,createdt,updatedt) values (?,?,?,?,?)",rParams,"1");
	sql.commit();
	// 更新角色缓存
	http.platformGet({"app":"auth","mod":"rbac","api":"reloadrolecache"},{"roleid":roleid,"reload_type":"03"});
}

sys.setRetData("0");