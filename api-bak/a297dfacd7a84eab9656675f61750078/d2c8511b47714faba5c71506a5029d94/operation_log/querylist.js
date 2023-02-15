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
var userid=sys.request.userid;
var operation_type=sys.request.operation_type;
var typecd=sys.request.typecd;  //类别编码

var dt_from=sys.request.dt_from;    //yyyy-MM-dd hh-mm-ss
var dt_to=sys.request.dt_to;

var pagesize=sys.request.pagesize;
var pagenum=sys.request.pagenum;

var filter=sys.request.filter;  //1:用于最近变更情况查询

if(dt_from==null||dt_to==null){
    sys.setRetData("1");
    return;
}
if(pagesize==null||pagenum==null){
    sys.setRetData("1");
    return;
}

var sql="select a.id,a.typecd,b.typenm,a.operation_type,a.before_json,a.after_json,a.userid,a.createdt from sys_mdm005 a left join sys_mdm001 b on a.typecd=b.typecd where a.createdt >= ? and a.createdt <= ? ";
var params=[dt_from,dt_to];

if(userid!=null){
    sql=sql+" and a.userid like ? ";
    list.add(params,"%"+userid+"%");
}
if(operation_type!=null){
    sql=sql+" and a.operation_type like ? ";
    list.add(params,operation_type+"%");
}
if(typecd!=null){
    sql=sql+" and a.typecd like ? ";
    list.add(params,"%"+typecd+"%");
}
//查最近变更情况
if(filter=="1"){
    sql=sql+" and a.operation_type != '002' ";
}
sql=sql+" order by a.id desc";
sql.queryPaging(sql,params,pagenum,pagesize);
var data=sys.result.result;
//操作详细
for(r in data){
    var op_detail="";
    var before_json=sys.instanceFromJson(r.before_json);
    var after_json=sys.instanceFromJson(r.after_json);
    //00101 代码注册
    if(r.operation_type=="00101"){
        op_detail="新增代码类："+r.typecd+"-"+r.typenm;
    }
    //00102 代码变更
    else if(r.operation_type=="00102"){
        //代码字典添加
        if(before_json==null||sys.size(before_json)==0){
            op_detail="添加代码字典：版本("+after_json.version+")-"+after_json.dictcd+"-"+after_json.dictnm;
        }
        //代码字典删除
        else if(after_json==null||sys.size(after_json)==0){
            op_detail="删除代码字典：版本("+before_json.version+")-"+before_json.dictcd+"-"+before_json.dictnm;
        }
        //代码字典修改
        else{
            op_detail="修改代码字典：版本("+before_json.version+")-"+before_json.dictcd+"-"+before_json.dictnm+" 修改详细：";
            //比较时null和""相等
            var tmpFieldMap={
                "version":"版本",
                "dictcd":"字典编码",
                "dictnm":"字典名称",
                "shortkey":"快捷键",
                "status":"状态",
                "mark":"说明"
            };
            for(entry in tmpFieldMap){
                var k=entry.key,v=entry.value;
                var be=before_json[k]==null?"":before_json[k];
                var af=after_json[k]==null?"":after_json[k];
                if(be!=af){
                    op_detail=op_detail+v+be+"->"+af+",";
                }
            }
            if(sys.endWith(op_detail,",")){
                op_detail=sys.subStringTo(op_detail,0,sys.length(op_detail)-1);
            }
        }
    }
    //00103 代码注销
    else if(r.operation_type=="00103"){
        op_detail="注销代码类："+r.typecd+"-"+r.typenm;
    }
    //00104 代码执行版本变更
    else if(r.operation_type=="00104"){
        op_detail="代码类："+r.typecd+"-"+r.typenm;
    }
    //002 代码查询
    else if(r.operation_type=="002"){
        op_detail="";
    }
    //003 代码下载
    else if(r.operation_type=="003"){
        var down_str="";
        if(before_json.down_type=="1"){
            down_str="CSV";
        }
        else if(before_json.down_type=="2"){
            down_str="JSON";
        }
        else if(before_json.down_type=="3"){
            down_str="Excel";
        }
        op_detail="下载类型："+down_str+",字符集："+before_json.charset+",下载数据条数："+before_json.count;
    }
    map.put(r,"operation_detail",op_detail);
}
sys.addRetData(data,"data");
sys.setRetData("0","","data");