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
//id:dropmenu
//name:拖放菜单

var menuid=sys.request.menuid;  //托的菜单ID

var levels=sys.request.levels;  //托的菜单的层级
var p_menuid=sys.request.pmenuid;   //目标菜单ID

// var orgid=sys.request.orgid;

// var temp=sys.request.leveld;    //操作完之后的层级差
var temp=0;

if(menuid==null){
    sys.setRetData("1");
    return;
}

//判断当前用户操作时，其他用户是否已操作了相同的菜单
var sql_pd="select levels from sys_menu where menuid=?";
var param_pd=[menuid];
sql.query(sql_pd,param_pd,"result_pd");
var result_pd=sys.result.result_pd;
for(r in result_pd){
    if(r.levels!=levels){
        var re0=[{"menunm":""},{"levelflag":false}];
        sys.addRetData(re0,"result");
        sys.setRetData("0","","result");
        return;
    }
}

//获取目标菜单层级
var pm_level=0;
if(p_menuid!=null){
    sql.query(sql_pd,[p_menuid],"pm_level");
    if(sys.size(sys.result.pm_level)>0){
        pm_level=sys.result.pm_level[0].levels;
        pm_level=sys.parseInt(pm_level);
    }else{
        sys.setRetData("2","目标菜单（第二个菜单）不存在！");
        return;
    }
}

//层级之差
temp=pm_level+1-sys.parseInt(levels);

//判断menunm是否重复
//取menunm
var menunm="";
var pmenuid0="";
var sql_nm="select p_menuid,menunm from sys_menu where menuid=?";
var param_nm=[menuid];
var cnt_nm=sql.query(sql_nm,param_nm,"result_nm");
var result_nm=sys.result.result_nm;
if(cnt_nm==1){
    for(r in result_nm){
        menunm=r.menunm;
        pmenuid0=r.p_menuid;
    }
}else{
    sys.setRetData("1");
    return;
}
//判断menunm
var dt=sys.getCurrentTimeString();
if(p_menuid!=null && p_menuid!=''){
    sql_nm="select menunm from sys_menu where p_menuid=?";
    param_nm=[p_menuid];
}else{
    sql_nm="select menunm from sys_menu where levels=1";
    param_nm=[];
}
cnt_nm=0;
cnt_nm=sql.query(sql_nm,param_nm,"result_nm1");
var result_nm1=sys.result.result_nm1;
//(pmenuid0!=null&&p_menuid!=null)||pmenuid0!=p_menuid
//在同级拖菜单时，不判断菜单名称是否重复
if(p_menuid==null && (pmenuid0==""||pmenuid0==null)){
}else{
    if(pmenuid0!=p_menuid){
    if(cnt_nm>0){
    for(r1 in result_nm1){
        if(menunm==r1.menunm){
            menunm=menunm+dt;
        }
    }
    }
    }
}

// //使被拖的菜单自动加到最末
  
//   var sql_u="select menuid from sys_menu where p_menuid=? and orgid=?";
//   var param_u=[p_menuid,orgid];
//   var count_y=sql.query(sql_u,param_u);
  
// //开始改变被拖菜单的sorting_order
// var sql_i="update sys_menu set sorting_order=? where menuid=? and orgid=?";
// var param_i=[count_y,menuid,orgid];
// sql.update(sql_i,param_i,"1");
//遍历子菜单
var id_array=[menuid];

var sql0="select menuid from sys_menu where p_menuid = ?";
var param0=[menuid];
var count0=sql.query(sql0,param0,"result0");
var result0=sys.result.result0;


var param=[];
var count=0;
if(count0>0){
    for(r in result0){
        @id_array.add(r.menuid);
        param=[r.menuid];
        count=sql.query(sql0,param,"result1");
        var result1=sys.result.result1;
        if(count>0){
            count=0;
            for(r1 in result1){
                @id_array.add(r1.menuid);
                param=[r1.menuid];
                count=sql.query(sql0,param,"result2");
                var result2=sys.result.result2;
                if(count>0){
                    count=0;
                    for(r2 in result2){
                        @id_array.add(r2.menuid);
                        param=[r2.menuid];
                        count=sql.query(sql0,param,"result3");
                        var result3=sys.result.result3;
                        if(count>0){
                            count=0;
                            for(r3 in result3){
                                @id_array.add(r3.menuid);
                                param=[r3.menuid];
                                count=sql.query(sql0,param,"result4");
                                var result4=sys.result.result4;
                                if(count>0){
                                    count=0;
                                    for(r4 in result4){
                                        @id_array.add(r4.menuid);
                                        param=[r4.menuid];
                                        count=sql.query(sql0,param,"result5");
                                        var result5=sys.result.result5;
                                        if(count>0){
                                            count=0;
                                            for(r5 in result5){
                                                @id_array.add(r5.menuid);
                                                param=[r5.menuid];
                                                count=sql.query(sql0,param,"result6");
                                                var result6=sys.result.result6;
                                                if(count>0){
                                                    count=0;
                                                    for(r6 in result6){
                                                        @id_array.add(r6.menuid);
                                                        param=[r6.menuid];
                                                        count=sql.query(sql0,param,"result7");
                                                        var result7=sys.result.result7;
                                                        if(count>0){
                                                            count=0;
                                                            for(r7 in result7){
                                                                @id_array.add(r7.menuid);
                                                                param=[r7.menuid];
                                                                count=sql.query(sql0,param,"result8");
                                                                var result8=sys.result.result8;
                                                                if(count>0){
                                                                    count=0;
                                                                    for(r8 in result8){
                                                                        @id_array.add(r8.menuid);
                                                                        param=[r8.menuid];
                                                                        count=sql.query(sql0,param,"result9");
                                                                        var result9=sys.result.result9;
                                                                        if(count>0){
                                                                            count=0;
                                                                            for(r9 in result9){
                                                                                @id_array.add(r9.menuid);
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

//设置被拖菜单的父菜单id
var sql_y="";
var param_y=[];
if(p_menuid!=null && p_menuid!=''){
    sql_y="update sys_menu set p_menuid=?,menunm=? where menuid=? ";
    param_y=[p_menuid,menunm,menuid];
    sql.update(sql_y,param_y,"1");
}else{
    sql_y="update sys_menu set p_menuid=null,menunm=? where menuid=?";
    param_y=[menunm,menuid];
    sql.update(sql_y,param_y,"1");
}
//将数组id_array中的menuid的levels更新
var i=0;
var sql_del="update sys_menu set levels=levels+"+temp+" where menuid=? ";
var param_del=[];
while(i<id_array.~size){
    param_del=[id_array[i]];
    sql.update(sql_del,param_del,"1");
    i=i+1;
}
sql.commit();
var re=[{"menunm":menunm},{"levelflag":true}];
sys.addRetData(re,"result");

sys.setRetData("0","","result");