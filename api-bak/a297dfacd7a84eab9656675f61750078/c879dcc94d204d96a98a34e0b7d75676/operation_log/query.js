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

var dt_from=sys.request.dt_from;    //yyyy-MM-dd
var time_from=sys.request.time_from;    //hh-mm-ss
var dt_to=sys.request.dt_to;
var time_to=sys.request.time_to;

var pagesize=sys.request.pagesize;
var pagenum=sys.request.pagenum;

var filter=sys.request.filter;  //1:用于最近变更情况查询
if(dt_from==null||dt_to==null){

// if(dt_from==null||dt_to==null||time_from==null||time_to==null){
    sys.setRetData("1");
    return;
}
if(pagesize==null||pagenum==null){
    sys.setRetData("1");
    return;
}


var sql="select a.id,a.typecd,b.typenm,a.operation_type,a.before_json,a.after_json,a.userid,a.createdt from sys_md_mm006 a left join sys_md_mm001 b on a.typecd=b.typecd where  a.createdt >= ? and a.createdt <= ? ";
var params=[dt_from+" "+time_from,dt_to+" "+time_to];

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
    sql=sql+" and a.operation_type != '00204' ";
}
sql=sql+" order by a.id desc";
sql.queryPaging(sql,params,pagenum,pagesize,"data");
//操作详细
for(r in sys.result.data){
    var op_detail="";
    var before_json=sys.instanceFromJson(r.before_json);
    var after_json=sys.instanceFromJson(r.after_json);
    //00101 元数据注册
    if(r.operation_type=="00101"){
        op_detail="新增元数据类："+r.typecd+"-"+r.typenm;
    }
    //00201 数据集标准注册
    else if(r.operation_type=="00201"){
        op_detail="新增数据集标准类："+r.typecd+"-"+r.typenm;
    }
    //00102 元数据变更
    else if(r.operation_type=="00102"){
        //元数据添加
        if(before_json==null||sys.size(before_json)==0){
            op_detail="添加元数据："+after_json.decd+"-"+after_json.en+"-"+after_json.cn;
        }
        //元数据删除
        else if(after_json==null||sys.size(after_json)==0){
            op_detail="删除元数据："+before_json.decd+"-"+before_json.en+"-"+before_json.cn;
        }
        //元数据修改
        else{
            op_detail="修改元数据："+before_json.decd+"-"+before_json.en+"-"+before_json.cn+" 修改详细：";
            //比较时null和""相等
            var tmpFieldMap={
                "decd":"数据元编码",
                "en":"英文名称",
                "cn":"中文名称",
                "datatype":"数据类型",
                "numrange":"数据长度",
                "format":"显示格式",
                "unit":"单位",
                "dict":"数据字典",
                "status":"状态",
                "mark":"说明",
                "isstd":"是否标准"
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
    //00202 数据集标准变更
    else if(r.operation_type=="00202"){
        //数据集项添加
        if(before_json==null||sys.size(before_json)==0){
            op_detail="添加数据集项："+after_json.en+"-"+after_json.cn;
        }
        //数据集项删除
        else if(after_json==null||sys.size(after_json)==0){
            op_detail="删除数据集项："+before_json.en+"-"+before_json.cn;
        }
        //数据集项修改
        else{
            op_detail="修改数据集项："+before_json.en+"-"+before_json.cn+" 修改详细：";
            //比较时null和""相等
            var tmpFieldMap={
                "decd":"数据元编码",
                "en":"英文名称",
                "cn":"中文名称",
                "mk":"是否主键",
                "must":"是否必填",
                "dv":"默认值",
                "status":"状态",
                "mark":"说明",
                "elemtype":"UI元素类型"
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
    //00103 元数据注销
    else if(r.operation_type=="00103"){
        op_detail="注销元数据类："+r.typecd+"-"+r.typenm;
    }
    //00105 元数据下载
    else if(r.operation_type=="00105"){
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
    //00203 数据集标准注销
    else if(r.operation_type=="00203"){
        op_detail="注销数据集标准："+r.typecd+"-"+r.typenm;
    }
    //00204 数据集查询
    else if(r.operation_type=="00204"){
        op_detail="";
    }
    //00205 数据集下载
    else if(r.operation_type=="00205"){
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
    //00301 物理表创建
    else if(r.operation_type=="00301"){
        op_detail="表中文名："+after_json.cn+" 表英文名："+after_json.en;
    }
    //00302 物理表修改
    else if(r.operation_type=="00302"){
        op_detail="详细：";
        //比较时null和""相等
        var tmpFieldMap={
            "en":"英文名称",
            "cn":"中文名称",
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
    }
    //00303 物理表删除
    else if(r.operation_type=="00303"){
        op_detail="表中文名："+before_json.cn+" 表英文名："+before_json.en;
    }
    map.put(r,"operation_detail",op_detail);
}
sys.setRetData("0","","data");