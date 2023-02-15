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
//url:http://192.168.7.120/ds/api/deletemenu?openid=admin&org=zr&app=zyapp_menu&mod=zymodule_menu&s=d

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
var sql_del="delete from sys_menu where menuid=?";
var param_del=[];
while(i<id_array.~size){
    param_del=[id_array[i]];
    sql.update(sql_del,param_del,"1");
    i=i+1;
}
sql.commit();
sys.setRetData("0");