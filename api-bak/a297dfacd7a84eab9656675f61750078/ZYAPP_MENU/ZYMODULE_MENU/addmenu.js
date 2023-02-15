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
  //添加菜单
  //http://192.168.7.225/ds/api/addmenu?openid=admin&org=zr&app=ZYAPP_MENU&mod=ZYMODULE_MENU&s=d
  //var menuId = sys.request.menuid;
  var menuId = sys.uuid();
  var menuNm = sys.request.menunm;
  var p_Menuid = sys.request.p_menuid;
  var uri = sys.request.uri;
//   var appId = sys.request.appid;
//   var moduleId = sys.request.moduleid;
  var menu_Desc = sys.request.menu_desc;
//   var orgId = sys.request.orgid;
  var orgId = sys.request.org;
  // var status = sys.request.status;
  var status = "1";
//   var sorting_Order = sys.request.sorting_order;
  var levels = sys.request.levels;
  var menu_Icon = sys.request.menu_icon;
  // var roleid = sys.request.role;
  //插入sys_menu
  if (menuId == null || levels == null) {
  	sys.setRetData("1");
    return;
  }
  //菜单层数最大为10层
  if(sys.parseInt(levels) > 10){
      sys.setRetData("2","菜单层数最大为10层");
      return;
  }
  //如果app==null,使moduleid==null
//   if(appId==null){
//       moduleId=null;
//   }
  //如果app!=null,判断moduleid是否可为空
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
//   }
  
  // if(status==null){
  //     sys.setRetData("1");
  //     return;
  // }
  //获取p_menuid下子menu的数量，用来自动生成排序号
//   var sql_y="",param_y=[],count_y="";
//   //1   p_menuid不为空时
//   if(p_Menuid!=null){
//       sql_y="select count(*) cnt from sys_menu where p_menuid=?";
//       param_y=[p_Menuid];
//       sql.query(sql_y,param_y,"result_y");
//   }else{
//   //2   p_menuid为空时
//       sql_y="select count(*) cnt from sys_menu where levels=1";
//       param_y=[];
//       sql.query(sql_y,param_y,"result_y");
//   }
//   var result_y=sys.result.result_y;
//   for(r in result_y){
//       count_y=r.cnt;
//   }
  //获取sorting_order
    var getso="";
    var socnt=0;
    if(p_Menuid!=null){
        getso="select menuid,sorting_order from sys_menu where p_menuid=? order by sorting_order desc";
        socnt=sql.query(getso,[p_Menuid],"so_r");
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
    
  //判断主键是否重复
  {
      var sql_Sel = "select count(*) cnt from sys_menu where menuid = ?";
      var paramSel = [menuId];
      var sqlSelCount = sql.query(sql_Sel,paramSel,"menuSet");
      var selResult = sys.result.menuSet;
      var selCount = "";
      for (r in selResult) {
        selCount = r.cnt;
      }
      if (selCount != "0") {//已存在该主键
        sys.setRetData("6");
        return;
      }
  }
  var dt = sys.getCurrentTimeString();//获取当前时间
  var sql_Ins = "insert into  sys_menu (menuid,menunm,menu_icon,p_menuid,uri,sorting_order,menu_desc,orgid,"+
  	"status,levels,createdt,updatedt) values (?,?,?,?,?,?,?,?,?,?,?,?)";
  var paramIns = [menuId,menuNm,menu_Icon,p_Menuid,uri,sorting_order,menu_Desc,orgId,status,levels,dt,dt];
  sql.update(sql_Ins,paramIns);
  //添加成功后如果添加的菜单为有效，把父菜单等上级也改成有效
if(status=='1'){
var id_array1=[menuId];

var sql1="select p_menuid from sys_menu where menuid = ?";
var param1=[menuId];
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

var j=0;
var sql_d1="update sys_menu set status='1' where menuid=?";

var param_d1=[];
while(j<id_array1.~size){
    param_d1=[id_array1[j]];
    sql.update(sql_d1,param_d1,"1");
    j=j+1;
}
sql.commit();
}
  //添加成功后删除父菜单的app,mod,uri以及roleid
  if(p_Menuid!=null){
      var sql_d="update sys_menu set uri=null,roleid=null where menuid=?";
      var param_d=[p_Menuid];
      sql.update(sql_d,param_d);
  }
  
  
  //返回菜单id
//   var re0=[{"flag":false}];
//       sys.addRetData(re0,"result");
//       sys.setRetData("0","","result");
  var menuid=[{"menuid":menuId,"flag":true}];
  sys.addRetData(menuid,"result");
  sys.setRetData("0","","result");