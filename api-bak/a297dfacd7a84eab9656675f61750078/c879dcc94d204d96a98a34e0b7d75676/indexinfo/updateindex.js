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
//id:updateindex
//name:修改索引

var typecd = sys.request.typecd;
var en = sys.request.en;
var _en = sys.request._en;
var cn = sys.request.cn;
var status = sys.request.status;
var mark = sys.request.mark;
var column = sys.requestParameterMap.column;
var collation = sys.requestParameterMap.collation;
var fields = "";  //索引信息字符串
if(status == null){
    status = "1";
}
if(typecd == null || en == null || status == null){
    sys.setRetData("1");
    return;
}
//en 不可为 PRIMARY
if(sys.toLowerCase(en) == "primary"){
    sys.setRetData("1","索引物理名称不可为PRIMARY");
    return;
}
//如果修改了索引名，则验证主键不重复
if(en != _en){
    var checkPK = "select typecd from sys_md_mm004 where typecd=? and en=?";
    var checkPK_cnt = sql.query(checkPK,[typecd,en],"checkPK_r");
    if(checkPK_cnt > 0){
        sys.setRetData("2","主键重复");
        return;
    }
}

if(column == null || collation == null || sys.size(column) != sys.size(collation)){
    sys.setRetData("2","索引列，索引升序降序不可为空！");
    return;
}
//column参数不可空
if(sys.size(column)==0 || sys.size(collation)==0){
    sys.setRetData("1","索引列不可为空！");
    return;
}
//验证column不重复
if(column != null){
        var _column=[];
    for(r in column){
        list.add(_column,r);
    }
    for(r in column){
        var tmp = 0;
        list.remove(_column,r);
        if(list.contain(_column,r)){
            sys.setRetData("2","重复列");
            return;
        }
    }
    
    for(var i =0;i<sys.size(column);i++){
        fields = fields + column[i]+" "+collation[i]+",";
    }
}

//去除最后一个逗号
fields = sys.subStringTo(fields,0,sys.length(fields)-1);
var dt = sys.currentTimeString();
//update语句
var sqlUpd = "update sys_md_mm004 set en=?,cn=?,fields=?,status=?,mark=?,updatedt=? where typecd=? and en=?";
//参数
var params = [ en, cn, fields, status, mark, dt, typecd, _en];

sql.update(sqlUpd, params);
//操作数据集日志
http.platformGet({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"mm","api":"cachedatasetinfo"},{"typecd":typecd});
sys.setRetData("0");