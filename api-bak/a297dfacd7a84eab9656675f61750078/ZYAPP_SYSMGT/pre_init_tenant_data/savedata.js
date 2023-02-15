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
//id:savedata
//name:将动态表格数据保存到预设表

//获取参数
var presetid = sys.request.presetid;    //预设ID
var typecd = sys.request.typecd;    //模型编码
var did = sys.request.did;  //数据库ID
var en  = sys.request.en;   //表名
// var data = sys.requestParameterMap.data;    //data
// var flag = sys.request.flag;    //添加修改标记

var dt = sys.currentTimeString();

if(presetid==null || typecd==null || did == null || en==null){
    sys.setRetData("1");
    return;
}
//判断预设是否已被使用
var checkSql = "select orgid from sys_tenant where presetid=?";
var checkSql_cnt=sql.query(checkSql,[presetid]);
if(checkSql_cnt>0){
    sys.setRetData("1","预设已使用，不可保存数据");
    return;
}
//判断是否存在预设表
var checkTblExist = "select presetid from sys_pl_init_tbl where presetid=? and typecd=? and did=? and en=?";
var checkTblExist_cnt = sql.query(checkTblExist,[presetid,typecd,did,en],"checktblexist_r");
if(checkTblExist_cnt == 0){
    //不存在预设表，则添加
    var addSql = "insert into sys_pl_init_tbl (presetid,sorting,typecd,did,en,status,createdt,updatedt) values (?,?,?,?,?,'1',?,?)";
    //获取sorting
    var _sorting=sql.query("select sorting from sys_pl_init_tbl order by sorting desc",[],"sorting_r");
    if(_sorting != 0){
        var max_sorting=sys.result.sorting_r[0].sorting;
        _sorting = sys.parseInt(max_sorting)+1;
    }
    
    var addSql_params=[presetid,_sorting,typecd,did,en,dt,dt];
    sql.update(addSql,addSql_params);
}
//预设表的创建时间与模型的修改时间比较
//获取预设表的创建时间
var getCreTime = "select createdt from sys_pl_init_tbl where presetid=? and typecd=? and did=? and en=?";
var getCreTime_cnt = sql.query(getCreTime,[presetid,typecd,did,en],"createdt_r");
if(getCreTime_cnt==0){
    sys.setRetData("1","获取预设表创建时间失败");
    return;
}
var createdt_p = sys.result.createdt_r[0].createdt;
//获取模型的修改时间,主键
var getUpdTime="select updatedt,mk,en from sys_md_mm002 where typecd=? order by updatedt desc";
var getUpdTime_cnt=sql.query(getUpdTime,[typecd],"updatedt_r");
if(getUpdTime_cnt==0){
    sys.setRetData("1","获取模型修改时间失败");
    return;
}
var updatedt_r=sys.result.updatedt_r;
var updatedt_p = updatedt_r[0].updatedt;
//主键
var getPK = "select mk,en,sorting from sys_md_mm002 where typecd=? and mk='1' order by sorting asc";
var getPK_cnt=sql.query(getPK,[typecd],"pk_r");
var pk_r=sys.result.pk_r;
var mk_r =[];
for(u in pk_r){
    list.add(mk_r,u.en);
}
//比较创建时间和修改时间
if(updatedt_p > createdt_p){
    sys.setRetData("1","模型已修改,请删除此预设表重新设置");
    return;
}
//向预设表中添加数据
var key="";   
var value="";
var tmp=0;      //en**的参数个数
if(sys.size(mk_r)>0){
    tmp=sys.size(mk_r);
}else{
    tmp=sys.size(updatedt_r);
}
for(var i=0;i<tmp;i++){
    var str="en";
    if(i<10){
        str=str+"0"+i;
    }else{
        str=str+i;
    }
    key=key+","+str;
    value=value+","+"?";
}

var insDataSql = "insert into sys_pl_init_data (presetid,sorting,data_sorting,status,createdt,updatedt"+key+") values (?,?,?,'1',?,?"+value+")";
//获取预设表的sorting
var getpresorting = "select sorting from sys_pl_init_tbl where presetid=? and typecd=? and did=? and en=?";
var getpresorting_cnt =sql.query(getpresorting,[presetid,typecd,did,en],"presorting_r");
if(getpresorting_cnt==0){
    sys.setRetData("1","获取预设表失败");
    return;
}
var sorting=sys.result.presorting_r[0].sorting;
//获取sys_pl_init_data中的data_sorting
var getdatasorting="select presetid,sorting,data_sorting from sys_pl_init_data where presetid=? and sorting=? order by data_sorting desc";

var data_sorting=sql.query(getdatasorting,[presetid,sorting],"datasorting_r");
if(data_sorting != 0){
    var max_sorting=sys.result.datasorting_r[0].data_sorting;
    data_sorting = sys.parseInt(max_sorting)+1;
}
//批量插入参数
var insDataSql_params=[];
var request = sys.request;
var cnt = sys.size(request);

for(var i=0;i<cnt;i++){
    
    //判断数组个数
    var tmp_nn=0;
    for(ur in updatedt_r){
        
        if(request["data["+i+"]["+ur.en+"]"]==null){
            tmp_nn=tmp_nn+1;
        } 
    }
    // sys.printValue("12 "+sys.size(updatedt_r));
    if(tmp_nn==sys.size(updatedt_r)){
        sys.printValue(i);
        break;
    }
    if(i==0){
       data_sorting = data_sorting; 
    }else{
        data_sorting = sys.parseInt(data_sorting) + 1;
    }
    var tmp_params=[presetid,sorting,data_sorting,dt,dt];
    //如果有主键，则只插入主键数据
    if(sys.size(mk_r)>0){
        //检查数据是否重复sql
        var checkDataExist="select presetid from sys_pl_init_data where presetid=? and sorting=?";
        var checkDataExist_params=[presetid,sorting];
        var _i=0;
        for(mr in mk_r){
            
            if(request["data["+i+"]["+mr+"]"]==null){
                sys.setRetData("2","获取数据失败："+"data["+i+"]["+mr+"]");
                return;
            }
            list.add(tmp_params,request["data["+i+"]["+mr+"]"]);
            
            var tmp_i_str="0"+_i;
            if(i>=10){
                tmp_i_str=i;
            }
            checkDataExist=checkDataExist+" and en"+tmp_i_str+"=? ";
            list.add(checkDataExist_params,request["data["+i+"]["+mr+"]"]);
            
            _i=_i+1;
        }
        //检查数据是否重复
        var checkDataExist_cnt=sql.query(checkDataExist,checkDataExist_params,"checkDataExist_r");
        if(checkDataExist_cnt>0){
            sys.setRetData("2","预设表已存在此条数据："+checkDataExist_params);
            return;
        }
        
        
    }else{
        //检查数据是否重复sql
        var checkDataExist="select presetid from sys_pl_init_data where presetid=? and sorting=?";
        var checkDataExist_params=[presetid,sorting];
        var _i=0;
        //否则，插入全字段数据
        for(ur in updatedt_r){
            
            list.add(tmp_params,request["data["+i+"]["+ur.en+"]"]);
            
            var tmp_i_str="0"+_i;
            if(i>=10){
                tmp_i_str=i;
            }
            checkDataExist=checkDataExist+" and en"+tmp_i_str+"=? ";
            list.add(checkDataExist_params,request["data["+i+"]["+ur.en+"]"]);
        }
        //检查数据是否重复
        var checkDataExist_cnt=sql.query(checkDataExist,checkDataExist_params,"checkDataExist_r");
        if(checkDataExist_cnt>0){
            sys.setRetData("2","预设表已存在此条数据："+checkDataExist_params);
            return;
        }
    }
    
    list.add(insDataSql_params,tmp_params);
    
    
}
// for(r in data){
//     var tmp_params=[presetid,sorting,data_sorting,dt,dt];
//     //如果有主键，则只插入主键数据
//     if(sys.size(mk_r)>0){
//         for(mr in mk_r){
//             if(r[mr]==null){
//                 sys.setRetData("2","获取数据失败："+mr);
//                 return;
//             }
//             list.add(tmp_params,r[mr]);
//         }    
//     }else{
//         //否则，插入全字段数据
//         for(ur in updatedt_r){
//             if(r[ur]==null){
//                 sys.setRetData("2","获取数据失败："+ur);
//                 return;
//             }
//             list.add(tmp_params,r[ur]);
//         }
//     }
//     list.add(insDataSql_params,tmp_params);
// }


sql.updateBatch(insDataSql,insDataSql_params);
sys.setRetData("0");