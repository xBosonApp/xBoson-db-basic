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
// zr-i.com:8088/ds/api/parse_csv?file_name=csv-20150615164305977_20150615170940953.csv&did=00000000000000000000000000000000&en=sys_menu&delimiter=,&quoteChar="&charset=UTF-8&escape=\&app=c879dcc94d204d96a98a34e0b7d75676&mod=import_data&org=a297dfacd7a84eab9656675f61750078&openid=589C37EAE717C6492C80103FC223CA2E1DA959852CFA622C8B4252395286B5BD&s=d

var operation = sys.request.operation;  //操作类型[insert,update,delete]
var type = sys.request.type;    //  导入文件类型['1'(csv),'2'(json)]
var typecd = sys.request.typecd;    //数据集ID
var did = sys.request.did;  // 数据源ID
var en = sys.request.en;    //表名
var file_charset = sys.request.charset; //字符集
// CSV参数
var hasHeader = sys.request.header;
var delimiter = sys.request.delimiter;  // 分隔符（delimiter）
var quoteChar = sys.request.quoteChar;  // 引号符号（quoteChar）
var escape = sys.request.escape;    // 转义符号（escape）
var file_name = sys.request.file_name;  //文件名
var dir_name = sys.request.dir_name;
// JSON参数...

if(file_name == null || file_charset == null){
    sys.setRetData("1");
    return;
}
    
// 解析文件，获取预览数据，文件数据列
var previewData = [];
var map_col = [];
// CSV文件
if(type == "1"){
    if(delimiter == null){
        sys.setRetData("1");
        return;
    }
    // 分隔符
    if(delimiter == "01"){
        delimiter = ",";
    }else if(delimiter == "02"){
        delimiter = "\t";
    }else if(delimiter == "03"){
        delimiter = ";";
    }
    // 引号符号
    if(quoteChar == "01"){
        quoteChar = "\"";
    }else if(quoteChar == "02"){
        quoteChar = "'";
    }
    // 解析CSV文件，返回10条预览数据
    //var path = dir_name || se.getCache(_CACHE_REGION_CONFIG_,"FILE_PATH_SUB_TMP");  //文件路径
    var path = '';
    previewData = sys.csvToList([path,file_name,file_charset],delimiter,quoteChar,escape,[],10);
    if(sys.size(previewData) == 0){
        sys.setRetData("2","CSV文件内容为空");
        return;
    }
    // 没有表头
    if(hasHeader == "0"){
        // 生成默认表头
        var defaultHeader = [];
        var _i = 1;
        for(r in previewData[0]){
            list.add(defaultHeader,"header"+_i);
            _i++;
        }
        previewData = sys.csvToList([path,file_name,file_charset],delimiter,quoteChar,escape,defaultHeader,10);
    }
    sys.printValue(previewData);
    // 取得CSV列
    for(r in previewData[0]){
      if (!r) continue;
        list.add(map_col,{
            "id":r.key,
            "name":r.key,
            //"id"  : r__index,
            //"name": r__index,
            "type": "file"
        });
    }
    // 添加额外映射列
    list.add(map_col,{
        "id":"[[UUID]]",
        "name":"[[UUID]]",
        "type":"extra"
    });
    list.add(map_col,{
        "id":"[[CURRENT_TIME]]",
        "name":"[[CURRENT_TIME]]",
        "type":"extra"
    });
    //when update
    if(operation == "update"){
        list.add(map_col,{
            "id":"[[NO_UPDATE]]",
            "name":"[[不更新]]",
            "type":"extra"
        });
    }
    //when insert
    else if(operation == "insert"){
        list.add(map_col,{
            "id":"[[Empty]]",
            "name":"[[空]]",
            "type":"extra"
        });
    }
}

// 取得表列信息
var tbl_col = [];
var _org = sys.request.org;
if(sys.startWith(sys.toLowerCase(en),"sys_")){
  _org = _ORGID_PLATFORM_;
}
var ret = http.platformGet({org:_org,app:"c879dcc94d204d96a98a34e0b7d75676",
  mod:"mod",api:"getdscolumns"},{did:did,table_name:en,typecd:typecd});

if(ret["data"].ret == "0"){
    var tbl_col_mk = [];
    for(r in ret["data"].result){
        var tmp = {
            "column_en":r.en,
            "column_cn":r.cn+"("+r.en+")",
            "must":r.must,
            "mk":r.mk
        };
        // 主键列
        if(r.mk == "1"){
            map.put(tmp,"column_cn",tmp.column_cn+"——主键");
            list.add(tbl_col_mk,tmp);
        }
        list.add(tbl_col,tmp);
    }
    // 没有主键列时，不可导入更新或导入删除
    if(operation == "update" || operation == "delete"){
        if(sys.size(tbl_col_mk) == 0){
            //sys.setRetData("2","表没有主键，不可导入更新或导入删除","result");
            sys.setRetData("2",did+":"+en+":"+typecd);
            return;
        }
    }
    // 导入删除时只返回主键列
    if(operation == "delete"){
        tbl_col = tbl_col_mk;
    }
}else{
    sys.setRetData("2",ret);
    return;
}

// 获取预览表头
var preview_header=[];
for(r in previewData[0]){
    //list.add(preview_header,r.key);
    list.add(preview_header, r__index);
}
// 返回预览数据，csv列，表列
sys.addRetData([{"preview_data":previewData, "preview_header":preview_header, "map_col": map_col, "table_col": tbl_col}],"result");
sys.setRetData("0","","result");