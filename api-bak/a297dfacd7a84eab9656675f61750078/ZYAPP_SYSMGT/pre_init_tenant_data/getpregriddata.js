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
//id：getpregriddata
//name:获取预设表数据

//获取预设ID参数
var presetid = sys.request.presetid;
var typecd=sys.request.typecd;
var did=sys.request.did;
var en=sys.request.en;
var pagesize = sys.request.pagesize;
var pagenum = sys.request.pagenum;

if(pagesize==null){
    pagesize=10;
}
if(pagenum==null){
    pagenum=1;
}
//验证参数
if(presetid == null){
    sys.setRetData("1");
    return;
}
//根据typecd获取模型中列的个数
var getColumnCnt = "select en from sys_md_mm002 where typecd=?";
var columnCnt = sql.query(getColumnCnt,[typecd],"columncnt_r");
//根据预设ID获取预设表sorting
var getTbl = "select sorting,typecd,did,en,status,createdt,updatedt from sys_pl_init_tbl where presetid=? and typecd=? and did=? and en=?";
var getTbl_cnt=sql.query(getTbl,[presetid,typecd,did,en],"getbl_r");
if(getTbl_cnt==0){
    map.put(sys.result,"count",0);
    sys.addRetData([],"type");
    sys.addRetData([],"result");
    sys.setRetData("0","","result","type");
    return;
    // sys.setRetData("1","没有查找到preseid对应的表");
    // return;
}
var sorting = sys.result.getbl_r[0].sorting;

//根据表sorting获取预设表数据
var getData = "select * from sys_pl_init_data where presetid=? and sorting=?";
var getData_cnt = sql.queryPaging(getData,[presetid,sorting],pagenum,pagesize,"data");
//如果没数据，则返回空
if(getData_cnt == 0){
    map.put(sys.result,"count",0);
    sys.addRetData([],"type");
    sys.setRetData("0","","data","type");
    return;
}
var result = sys.result.data;
//生成type数组
var type=[
    {			
        "en": "data_sorting",			
        "cn": "数据顺序号",			
        "view": "1",
        "ro": "1",
        "must": "1",
        "search": "0",
        "elemtype": "text",
        "datatype": "s",
        "numrange": "20",
        "dict": "",			
        "unit": "",			
        "format": "",		
        "chart": ""				
    }
];
for(var i=0;i<columnCnt;i++){
    //列名号
    var en_num="";
    if(i<10){
        en_num="0"+i;
    }else{
        en_num=i;
    }
    var tmp={			
        "en": "en"+en_num,			
        "cn": "en"+en_num,			
        "view": "1",
        "ro": "1",
        "must": "1",
        "search": "0",
        "elemtype": "text",
        "datatype": "s",
        "numrange": "100",
        "dict": "",			
        "unit": "",			
        "format": "",		
        "chart": ""				
    };
    list.add(type,tmp);
}
sys.addRetData(type,"type");
sys.setRetData("0","","data","type");