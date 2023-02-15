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
//导入测试数据

var did = sys.request.did;
// {tables:[],joins:[]}
// var typecd = sys.request.typecd;
// var table_name = sys.request.table_name;        //表名
// var num = sys.request.num;                      //数据条数

//[{table_name:'t1',count:10},{table_name:'t2',count:100},{table_name:'t3',count:200}]
//有顺序
var tablesJson = sys.request.table_num_json;    
// {t2.id:t1.id,t3.nm:t2.nm}
var tableJoins = sys.request.table_join_json;

if(tablesJson==null || tableJoins==null){
    sys.setRetData("1");
    return;
}

var tablesJsonObj = sys.instanceFromJson(tablesJson);
var tableJoinsObj = sys.instanceFromJson(tableJoins);
if(did==null){
    did="00000000000000000000000000000000";
}
//固定值
//{table_name:'',column_name:'',tbl_col:'',type:'constants',value:''}  
//范围随机值
//{table_name:'',column_name:'',tbl_col:'',type:'range',range:[]}    
//随机数 (int,double,string) 如： int 6, double 6.2, string 6
//{table_name:'',column_name:'',tbl_col:'',type:'random',datatype:'',numrange:'6'}
//日期date值 (指定范围随机日期)
//{table_name:'',column_name:'',tbl_col:'',type:'dateR',value:'',start:'',end:''}     
//api方法
//{table_name:'',column_name:'',tbl_col:'',type:'api_func',value:''}
//表中数据
//{table_name:'',column_name:'',tbl_col:'',type:'column_value_array',table:'',column:''}
//数据字典
//{table_name:'',column_name:'',tbl_col:'',type:'dict',typecd:''}    
//自增 datatype[n,d]
//{table_name:'',column_name:'',tbl_col:'',type:'increase',datatype:'n',value:0}     
var count = 0;

var getFields = "select b.en table_name,a.en column_name from sys_md_mm002 a, sys_md_mm003 b where a.typecd=b.typecd and b.en in ({tables}) and b.did=? and a.status='1' and b.status='1'";
var tablesIn = "";
for(r in tablesJsonObj){
    tablesIn = tablesIn + ",'" + r.table_name + "'";
}
if(tablesIn==""){
    sys.setRetData("2","没有指定表！");
    return;
}
tablesIn = sys.subString(tablesIn,1);
count = sql.query(sys.replace(getFields,"{tables}",tablesIn),[did],"fields_r");
if(count == 0){
    sys.setRetData("2");
    return;
}
var fields_r = sys.result.fields_r;
var requestFields = [];
// 将json字符串变为json对象
for(r in fields_r){
    if(sys.request[r.table_name+"."+r.column_name]==null){
        list.add(requestFields,{table_name:r.table_name, column_name:r.column_name , tbl_col: r.table_name+"."+r.column_name});
    }else{
        list.add(requestFields,sys.instanceFromJson(sys.request[r.table_name+"."+r.column_name ]));
    }
}

// 获取表字段(单表)
// var getFields = "select a.en from sys_md_mm002 a, sys_md_mm003 b where a.typecd=b.typecd and b.en=? and b.did=? and a.status='1' and b.status='1'";
// count = sql.query(getFields,[table_name,did],"fields_r");
// if(count == 0){
//     sys.setRetData("2");
//     return;
// }
// var fields_r = sys.result.fields_r;
// var requestFields = [];
// for(r in fields_r){
//     list.add(requestFields,sys.instanceFromJson(sys.request[r.en]));
// }

// 获取外键表的外键列数据数组，数据字典数组等
var foreign_data = {};
var dict_data = {};
for(r in requestFields){
    //外键数据数组
    if(r.type=="column_value_array"){
        var getFKData = "select "+r.column+" from "+r.table;
        sql.query(getFKData,null,"fk_data");
        var tmpL = [];
        for(fkcol in sys.result.fk_data){
            list.add(tmpL,fkcol[r.column]);
        }
        map.put(foreign_data, r.tbl_col, tmpL);
    }
    //数据字典数组
    else if(r.type=="dict"){
        var getDict = "select dictcd from sys_mdm002 where typecd=? and status='1'";
        sql.query(getDict,[r.typecd],"dict_data");
        var tmpL = [];
        for(dictcdMap in sys.result.dict_data){
            list.add(tmpL,dictcdMap.dictcd);
        }
        map.put(dict_data, r.tbl_col, tmpL);
    }
}

// 生成批量insert参数
var table_params_batch = {};
var dt = sys.currentTimeString();
var increaseTmpMap = {};  //自增列使用
// 依次循环表
sys.printValue("tablesJsonObj=",tablesJsonObj);
for(tblAndcnt in tablesJsonObj){
    var tmp_params_batch = []; //每个表的批量插入参数
    var cnt = 0;    // 计数
    var index = 0; //关联表批量参数数组下标
    // 循环插入表记录数量
    for(var i=0,len=sys.parseInt(tblAndcnt.count); i<len; i++){
        var param_tmp = [];
        // 循环所有列参数
        for(r in requestFields){
            if(r.table_name != tblAndcnt.table_name){
                continue;
            }
            if(map.containsKey(tableJoinsObj,r.tbl_col)){
                var targetTbl = sys.subStringTo(tableJoinsObj[r.tbl_col],0,sys.indexOf(tableJoinsObj[r.tbl_col],".")); // 关联表
                var targetCol = sys.subString(tableJoinsObj[r.tbl_col],sys.indexOf(tableJoinsObj[r.tbl_col],".")+1);  //关联列
                var targetTblCnt = 0; //关联表要插入的测试数据数量
                for(_r in tablesJsonObj){
                    if(_r.table_name == targetTbl){
                        targetTblCnt = sys.parseInt(_r.count);
                    }
                }
                var targetColIndex = 0; //关联列的参数顺序
                for(_r in fields_r){
                    if(_r.table_name==targetTbl){
                        if(_r.column_name==targetCol){
                            break;
                        }
                        targetColIndex++ ;
                    }
                }
                
                list.add(param_tmp,table_params_batch[targetTbl][index][targetColIndex]);
                
                if(len/targetTblCnt>1){
                    if(targetTblCnt!=(index+1)){
                        if(len/targetTblCnt-cnt>1){
                            cnt++;
                        }else{
                            cnt=0;
                            index++;
                        }
                    }else{
                        //最后一个索引不处理
                    }
                }else{
                    index++;
                }
                continue;
            }
            
            //null
            if(r.type == null){
                list.add(param_tmp,null);
                continue;
            }
            //固定值
            if(r.type == "constants"){
                list.add(param_tmp,r.value);
                continue;
            }
            //随机数
            else if(r.type == "random"){
                //随机整数
                if(r.datatype == "int"){
                    list.add(param_tmp,sys.randomNumber(sys.parseInt(r.numrange)));
                    continue;
                }
                //随机double数
                else if(r.datatype == "double"){
                    var _numrange = sys.split(r.numrange,",");
                    if(sys.size(_numrange) != 2){
                        sys.setRetData("2",r.tbl_col+"选择数据异常");
                        return;
                    }
                    list.add(param_tmp,sys.randomDouble(sys.parseInt(_numrange[0]),sys.parseInt(_numrange[1])));
                    continue;
                }
                //随机字符串
                else if(r.datatype == "string"){
                    list.add(param_tmp,sys.randomString(sys.parseInt(r.numrange)));
                    continue;
                }
            }
            
            
            //随机日期
            // else if(r.type == "dateR"){
            //     list.add(param_tmp,sys.randomDate(start,end));
            //     continue;
            // }
            //外键
            else if(r.type == "column_value_array"){
                var _ind = sys.randomIntWithMaxValue(sys.size(foreign_data[r.tbl_col]));
                if(_ind<0){
                    _ind=_ind*-1;
                }
                list.add(param_tmp,foreign_data[r.tbl_col][_ind]);
                continue;
            }
            //api方法
            else if(r.type == "api_func"){
                if(r.value=="uuid"){
                    list.add(param_tmp,sys.uuid());
                    continue;
                }else if(r.value=="currentTimeString"){
                    list.add(param_tmp,sys.currentTimeString());
                    continue;
                }else{
                    sys.setRetData("2","异常信息(api_func)："+r);
                    return;
                }
            }
            //数据字典
            else if(r.type == "dict"){
                var _ind = sys.randomIntWithMaxValue(sys.size(dict_data[r.tbl_col]));
                if(_ind<0){
                    _ind=_ind*-1;
                }
                list.add(param_tmp,dict_data[r.tbl_col][_ind]);
                continue;
            }
            //根据范围取随机数
            else if(r.type == "range"){
                var _ind = sys.randomIntWithMaxValue(sys.size(r.range));
                if(_ind<0){
                    _ind=_ind*-1;
                }
                list.add(param_tmp,r.range[_ind]);
                continue;
            }
            //自增
            else if(r.type == "increase"){
                if(r.datatype == "n"){
                    //increaseTmpMap是否存在
                    if(increaseTmpMap[r.tbl_col]!=null){
                        var tmpNum = increaseTmpMap[r.tbl_col]+1;
                        list.add(param_tmp,increaseTmpMap[r.tbl_col]+1);
                        map.put(increaseTmpMap, r.tbl_col, tmpNum);
                    }else{
                        list.add(param_tmp,sys.parseInt(r.base));
                        map.put(increaseTmpMap, r.tbl_col, sys.parseInt(r.base));
                    }
                }else if(r.datatype == "d"){
                    //increaseTmpMap是否存在
                    if(increaseTmpMap[r.tbl_col]!=null){
                        var tmpNum = increaseTmpMap[r.tbl_col]+1;
                        list.add(param_tmp,increaseTmpMap[r.tbl_col]+1);
                        map.put(increaseTmpMap, r.tbl_col, tmpNum);
                    }else{
                        list.add(param_tmp,r.base);
                        map.put(increaseTmpMap, r.tbl_col, r.base);
                    }
                }
                continue;
            }
            //异常
            else{
                sys.setRetData("2","异常信息(type)："+r);
                return;
            }
        }
        list.add(tmp_params_batch,param_tmp);    
    }
    map.put(table_params_batch, tblAndcnt.table_name, tmp_params_batch);
}

// 生成多个表的 insert 语句
var insSqlMap = {};
// 生成insSqlMap
for(r in fields_r){
    map.put(insSqlMap,r.table_name,{
        insSql:"insert into "+r.table_name+" (",
        tmpFileds:"",
        tmpMark:""
    });
}
// 生成insSqlMap内容
for(r in fields_r){
    // insSql = "insert into "+r.table_name+" (";
    map.put(insSqlMap[r.table_name],"tmpFileds",insSqlMap[r.table_name]["tmpFileds"] + ","  + r.column_name);
    // insSqlMap[r.table_name]["tmpFileds"] = "," + insSqlMap[r.table_name]["tmpFileds"] + r.column_name;
    map.put(insSqlMap[r.table_name],"tmpMark",insSqlMap[r.table_name]["tmpMark"] + ",?");
    // insSqlMap[r.table_name]["tmpMark"] = insSqlMap[r.table_name]["tmpMark"] + ",?";
}
// 拼sql
for(r in insSqlMap){
    map.put(r.value,"tmpFileds",sys.subString(r.value.tmpFileds,1));
    map.put(r.value,"tmpMark",sys.subString(r.value.tmpMark,1));
    // r.value.tmpFileds = sys.subString(r.value.tmpFileds,1);
    // r.value.tmpMark = sys.subString(r.value.tmpMark,1);
    
    map.put(r.value,"insSql",r.value.insSql + r.value.tmpFileds + ") values (" + r.value.tmpMark + ")");
    // r.value.insSql = r.value.insSql + tmpFileds + ") values (";
    // r.value.insSql = r.value.insSql + tmpMark + ")";
}

//执行SQL
if(did!="00000000000000000000000000000000"){
    sql.connection(did);
}
// sql:insSqlMap        参数:table_params_batch
try{
    for(r in tablesJsonObj){
        sql.updateBatch(insSqlMap[r.table_name].insSql,table_params_batch[r.table_name]); 
    }
    sys.setRetData("0");
}catch(e){
    sys.setRetData("5",e.cause.message);    
}