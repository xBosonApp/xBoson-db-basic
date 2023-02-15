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
var typecd=sys.request.typecd;  //数据集模型ID
var did=sys.request.did;    //数据源ID
var en=sys.request.en;  //表名
var json=sys.request.json;  //json字符串

if(typecd==null || did==null || en==null){
    sys.setRetData("1");
    return;
}
//返回数据集模型字段
if(json==null){
    //sys_md_mm005中的字段
    var sql1="select b.en field,b.cn fieldcn,a.elemtype,a.readonly,a.filter from sys_md_mm005 a,sys_md_mm002 b where a.typecd=b.typecd and a.field=b.en and a.typecd=? and a.did=? and a.en=? order by a.sorting";
    var cnt=sql.query(sql1,[typecd,did,en],"result");
    var result=sys.result.result;
    
    //从sys_md_mm002表取字段信息
    var sql2="select en field,cn fieldcn from sys_md_mm002 where typecd=? and status='1' order by sorting";
    sql.query(sql2,[typecd],"result2");
    var result2=sys.result.result2;
    
    //获取数据集模型中其余的字段
    var tmp = [];
    for(r in result){
        list.add(tmp,r.field);
    }
    
    for(r in result2){
        if(!list.contain(tmp,r.field)){
            list.add(result,{
                "field":r.field,
                "fieldcn":r.fieldcn
            });
        }
    }
    sys.setRetData("0","","result");
}
//根据json修改UI设置
else{
    var dt=sys.currentTimeString();
    //删除
    var sql_d="delete from sys_md_mm005 where typecd=? and did=? and en=?";
    var param_d=[typecd,did,en];
    //批量添加
    var sql_i="insert into sys_md_mm005 (typecd,did,en,field,elemtype,readonly,filter,sorting,createdt,updatedt) values (?,?,?,?,?,?,?,?,?,?)";
    var param_i=[];
    var jsonObj=sys.instanceFromJson(json);
    if(sys.size(jsonObj)==0){
        sys.setRetData("2");
        return;
    }
    var i=0;
    for(r in jsonObj){
        list.add(param_i,[typecd,did,en,r.field,r.elemtype,r.readonly,r.filter,i,dt,dt]);
        i++;
    }
    sql.update(sql_d,param_d,"1");
    sql.updateBatch(sql_i,param_i,"1");
    //操作数据集日志
    http.platformGet({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"mm","api":"cachedatasetinfo"},{"typecd":typecd});
    sql.commit();
    sys.setRetData("0");
}