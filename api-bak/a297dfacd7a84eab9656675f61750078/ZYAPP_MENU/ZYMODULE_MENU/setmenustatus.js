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
//id:setmenustatus
//name:更改菜单状态
//http://192.168.7.225/ds/api/setmenustatus?openid=admin&org=zr&app=ZYAPP_MENU&mod=ZYMODULE_MENU&s=d
var menuid=sys.request.menuid;
var status=sys.request.status;
// var orgid=sys.request.orgid;

var s="";
if(status==null){
    sys.setRetData("1");
    return;
}
if(status=='false'){
    s='0';
}else if(status=='true'){
    s='1';
}
//如果点击tree顶层，则更像当前机构全部menu
if(menuid==null){
    var sql_all="update sys_menu set status=?";
    var param_all=[s];
    sql.update(sql_all,param_all);
    sys.setRetData("0");
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
var i=0;
var sql_del="update sys_menu set status=? where menuid=?";
var param_del=[];
while(i<id_array.~size){
    param_del=[s,id_array[i]];
    sql.update(sql_del,param_del,"1");
    i=i+1;
}
sql.commit();
//当更改有效时，把父的也改成有效
if(s=='1'){
var id_array1=[menuid];

var sql1="select p_menuid from sys_menu where menuid = ? ";
var param1=[menuid];
var count1=sql.query(sql1,param1,"result11");
var result11=sys.result.result11;

if(result11[0].p_menuid!=''){
    @id_array1.add(result11[0].p_menuid);
    param1=[result11[0].p_menuid];
    count1=sql.query(sql1,param1,"result22");
    var result22=sys.result.result22;
    if(result22[0].p_menuid!=''){
        @id_array1.add(result22[0].p_menuid);
        param1=[result22[0].p_menuid];
        count1=sql.query(sql1,param1,"result33");
        var result33=sys.result.result33;
        if(result33[0].p_menuid!=''){
            @id_array1.add(result33[0].p_menuid);
            param1=[result33[0].p_menuid];
            count1=sql.query(sql1,param1,"result44");
            var result44=sys.result.result44;
            if(result44[0].p_menuid!=''){
                @id_array1.add(result44[0].p_menuid);
                param1=[result44[0].p_menuid];
                count1=sql.query(sql1,param1,"result55");
                var result55=sys.result.result55;
                if(result55[0].p_menuid!=''){
                    @id_array1.add(result55[0].p_menuid);
                    param1=[result55[0].p_menuid];
                    count1=sql.query(sql1,param1,"result66");
                    var result66=sys.result.result66;
                    if(result66[0].p_menuid!=''){
                        @id_array1.add(result66[0].p_menuid);
                        param1=[result66[0].p_menuid];
                        count1=sql.query(sql1,param1,"result77");
                        var result77=sys.result.result77;
                        if(result77[0].p_menuid!=''){
                            @id_array1.add(result77[0].p_menuid);
                            param1=[result77[0].p_menuid];
                            count1=sql.query(sql1,param1,"result88");
                            var result88=sys.result.result88;
                            if(result88[0].p_menuid!=''){
                                @id_array1.add(result88[0].p_menuid);
                                param1=[result88[0].p_menuid];
                                count1=sql.query(sql1,param1,"result99");
                                var result99=sys.result.result99;
                                if(result99[0].p_menuid!=''){
                                    @id_array1.add(result99[0].p_menuid);
                                }
                            }
                        }
                    }
                }
            }
        }
    }   
}

i=0;
var sql_d1="update sys_menu set status='1' where menuid=?";

var param_d1=[];
while(i<id_array1.~size){
    param_d1=[id_array1[i]];
    sql.update(sql_d1,param_d1,"1");
    i=i+1;
}
sql.commit();
}
sys.setRetData("0");

// }else if(status=='true'){
// //如果将状态设为有效，则只设置一个
// var sql_d="update sys_menu set status='1' where menuid=?";
// var param_d=[menuid];
// sql.update(sql_d,param_d);
// sys.setRetData("0");
// }else{
//     sys.setRetData("1");
// }