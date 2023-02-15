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
//陈棋
  //修改菜单
  //http://192.168.7.225/ds/api/setmenu?openid=admin&org=zr&app=ZYAPP_MENU&mod=ZYMODULE_MENU&s=d
  var menuId = sys.request.menuid;
  var menuNm = sys.request.menunm;
  var p_Menuid = sys.request.p_menuid;
  var uri = sys.request.uri;
//   var appId = sys.request.appid;
//   var moduleId = sys.request.moduleid;
  var menu_Desc = sys.request.menu_desc;
//   var orgId = sys.request.orgid;
  var status = sys.request.status;
 // var sorting_Order = sys.request.sorting_order;
  var levels = sys.request.levels;
  var menu_Icon = sys.request.menu_icon;
  // var roleid = sys.request.role;
  //插入sys_menu
  if (menuId == null || levels == null ) {
  	sys.setRetData("1");
    return;
  }
  //如果app==null,使moduleid==null
//   if(appId==null){
//       moduleId=null;
//   }
//   //如果app!=null,判断moduleid是否可为空
//   var sql_am="select moduleid from sys_modules where appid=?";
//   var param_am=[appId];
//   var cnt_am=sql.query(sql_am,param_am);
//   if(cnt_am>0){
//       if(moduleId==null){
//       var re0=[{"flag":false}];
//       sys.addRetData(re0,"result");
//       sys.setRetData("0","","result");
//       return;
//       }
//   }else{
//       moduleId=null;
//   }
  
  // if(status==null){
  //     sys.setRetData("1");
  //     return;
  // }
//   //如果状态修改为无效，则把子菜单的状态也变为无效
//   if(status=="0"){
//       var id_array=[menuId];

//       var sql0="select menuid from sys_menu where p_menuid = ?";
//       var param0=[menuId];
//       var count0=sql.query(sql0,param0,"result0");
//       var result0=sys.result.result0;


//       var param=[];
//       var count=0;
//       if(count0>0){
//           for(r in result0){
//         @id_array.add(r.menuid);
//         param=[r.menuid];
//         count=sql.query(sql0,param,"result1");
//         var result1=sys.result.result1;
//         if(count>0){
//             count=0;
//             for(r1 in result1){
//                 @id_array.add(r1.menuid);
//                 param=[r1.menuid];
//                 count=sql.query(sql0,param,"result2");
//                 var result2=sys.result.result2;
//                 if(count>0){
//                     count=0;
//                     for(r2 in result2){
//                         @id_array.add(r2.menuid);
//                         param=[r2.menuid];
//                         count=sql.query(sql0,param,"result3");
//                         var result3=sys.result.result3;
//                         if(count>0){
//                             count=0;
//                             for(r3 in result3){
//                                 @id_array.add(r3.menuid);
//                                 param=[r3.menuid];
//                                 count=sql.query(sql0,param,"result4");
//                                 var result4=sys.result.result4;
//                                 if(count>0){
//                                     count=0;
//                                     for(r4 in result4){
//                                         @id_array.add(r4.menuid);
//                                         param=[r4.menuid];
//                                         count=sql.query(sql0,param,"result5");
//                                         var result5=sys.result.result5;
//                                         if(count>0){
//                                             count=0;
//                                             for(r5 in result5){
//                                                 @id_array.add(r5.menuid);
//                                                 param=[r5.menuid];
//                                                 count=sql.query(sql0,param,"result6");
//                                                 var result6=sys.result.result6;
//                                                 if(count>0){
//                                                     count=0;
//                                                     for(r6 in result6){
//                                                         @id_array.add(r6.menuid);
//                                                         param=[r6.menuid];
//                                                         count=sql.query(sql0,param,"result7");
//                                                         var result7=sys.result.result7;
//                                                         if(count>0){
//                                                             count=0;
//                                                             for(r7 in result7){
//                                                                 @id_array.add(r7.menuid);
//                                                                 param=[r7.menuid];
//                                                                 count=sql.query(sql0,param,"result8");
//                                                                 var result8=sys.result.result8;
//                                                                 if(count>0){
//                                                                     count=0;
//                                                                     for(r8 in result8){
//                                                                         @id_array.add(r8.menuid);
//                                                                         param=[r8.menuid];
//                                                                         count=sql.query(sql0,param,"result9");
//                                                                         var result9=sys.result.result9;
//                                                                         if(count>0){
//                                                                             count=0;
//                                                                             for(r9 in result9){
//                                                                                 @id_array.add(r9.menuid);
//                                                                             }
//                                                                         }
//                                                                     }
//                                                                 }
//                                                             }
//                                                         }
//                                                 }
//                                             }
//                                         }
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     }
// }
//       }
//       var i=0;
//       var sql_del="update sys_menu set status='0' where menuid=?";
//       var param_del=[];
//       while(i<id_array.~size){
//           param_del=[id_array[i]];
//           sql.update(sql_del,param_del,"1");
//           i=i+1;
//       }
//       sql.commit();
//   }
//   //当更改有效时，把父的也改成有效
// if(status=='1'){
// var id_array1=[menuId];

// var sql1="select p_menuid from sys_menu where menuid = ?";
// var param1=[menuId];
// var count1=sql.query(sql1,param1,"result11");
// var result11=sys.result.result11;

// if(result11[0].p_menuid!=''){
//     @id_array1.add(result11[0].p_menuid);
//     param1=[result11[0].p_menuid];
//     count1=sql.query(sql1,param1,"result22");
//     var result22=sys.result.result22;
//     if(result22[0].p_menuid!=''){
//         @id_array1.add(result22[0].p_menuid);
//         param1=[result22[0].p_menuid];
//         count1=sql.query(sql1,param1,"result33");
//         var result33=sys.result.result33;
//         if(result33[0].p_menuid!=''){
//             @id_array1.add(result33[0].p_menuid);
//             param1=[result33[0].p_menuid];
//             count1=sql.query(sql1,param1,"result44");
//             var result44=sys.result.result44;
//             if(result44[0].p_menuid!=''){
//                 @id_array1.add(result44[0].p_menuid);
//                 param1=[result44[0].p_menuid];
//                 count1=sql.query(sql1,param1,"result55");
//                 var result55=sys.result.result55;
//                 if(result55[0].p_menuid!=''){
//                     @id_array1.add(result55[0].p_menuid);
//                     param1=[result55[0].p_menuid];
//                     count1=sql.query(sql1,param1,"result66");
//                     var result66=sys.result.result66;
//                     if(result66[0].p_menuid!=''){
//                         @id_array1.add(result66[0].p_menuid);
//                         param1=[result66[0].p_menuid];
//                         count1=sql.query(sql1,param1,"result77");
//                         var result77=sys.result.result77;
//                         if(result77[0].p_menuid!=''){
//                             @id_array1.add(result77[0].p_menuid);
//                             param1=[result77[0].p_menuid];
//                             count1=sql.query(sql1,param1,"result88");
//                             var result88=sys.result.result88;
//                             if(result88[0].p_menuid!=''){
//                                 @id_array1.add(result88[0].p_menuid);
//                                 param1=[result88[0].p_menuid];
//                                 count1=sql.query(sql1,param1,"result99");
//                                 var result99=sys.result.result99;
//                                 if(result99[0].p_menuid!=''){
//                                     @id_array1.add(result99[0].p_menuid);
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     }   
// }

// var j=0;
// var sql_d1="update sys_menu set status='1' where menuid=?";

// var param_d1=[];
// while(j<id_array1.~size){
//     param_d1=[id_array1[j]];
//     sql.update(sql_d1,param_d1,"1");
//     j=j+1;
// }
// sql.commit();
// }
  var dt = date.currentTimeString();//获取当前时间
  var sql_Upd = "update sys_menu set menunm = ?,menu_icon = ?,p_menuid = ?,uri = ?,menu_desc = ?,levels = ?,updatedt = ? where menuid = ?";
  	
  //如果修改的菜单有子菜单，则把修改的菜单的app,mod ,uri字段的值修改为空
  var sql_c="select menuid from sys_menu where p_menuid=?";
  var param_c=[menuId];
  var cnt_c=sql.query(sql_c,param_c);
  if(cnt_c>0){
    //   appId=null;
    //   moduleId=null;
      uri=null;
      // roleid=null;
  }
  
  var paramUpd = [menuNm,menu_Icon,p_Menuid,uri,menu_Desc,levels,dt,menuId];
  var updCount = sql.update(sql_Upd,paramUpd);
  if (updCount == 0) {
    sys.setRetData("5");
    return;
  }
  var re0=[{"flag":true}];
  sys.addRetData(re0,"result");
  sys.setRetData("0","","result");