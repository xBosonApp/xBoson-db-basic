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
//获取参数
var typecd = sys.request.typecd;
var decd = sys.request.decd;
var en = sys.request.en;
var cn = sys.request.cn;
var datatype = sys.request.datatype;
//var datalength = sys.request.datalength;
var numrange = sys.request.numrange;
var format = sys.request.format;
var unit = sys.request.unit;
var dict = sys.request.dict;
var status = sys.request.status;
var mark = sys.request.mark;
var pageNum =sys.request.pagenum;
var pageSize = sys.request.pagesize;
var pNDefualt = 1;
var PSDefualt = 10;
// if (typecd == null) {
//   sys.setRetData("1");
//   return;
// }

//查询sys_mdm003表
//分页查询
var sqlPaging = "SELECT a.typecd,a.decd,a.en,a.cn,a.datatype,a.numrange,a.format,"+
"a.unit,a.dict,a.status,a.mark,a.createdt,a.updatedt FROM sys_mdm003 a  WHERE 1=1";
var paramM_B_TI = [];
if (typecd != null) {
  sqlPaging = sqlPaging + " AND a.typecd LIKE ? " ;
  @paramM_B_TI.add("%" + typecd + "%");
}
if (decd != null) {
  sqlPaging = sqlPaging + " AND a.decd LIKE ? " ;
  @paramM_B_TI.add("%" + decd + "%");
}

if (format != null) {
  sqlPaging = sqlPaging + " AND a.format = ?";
  @paramM_B_TI.add(format);
}

if (dict != null) {
  sqlPaging = sqlPaging + " AND a.dict = ?";
  @paramM_B_TI.add("%" + dict + "%");
}

// if (status != null) {
  sqlPaging = sqlPaging + " AND a.status = '1'";
//   @paramM_B_TI.add(status);
// }

if (en != null) {
  sqlPaging = sqlPaging + " AND a.en like ?";
  @paramM_B_TI.add("%"+en+"%");
}
if (cn != null) {
  sqlPaging = sqlPaging + " AND a.cn like ?";
  @paramM_B_TI.add("%"+cn+"%");
}
if (datatype != null) {
  sqlPaging = sqlPaging + " AND a.datatype like ?";
  @paramM_B_TI.add("%"+datatype+"%");
}

if (pageNum == null) {
  pageNum = pNDefualt;
}
if (pageSize == null) {
  pageSize = PSDefualt;
}
sqlPaging = sqlPaging + " order by status desc,createdt desc";
var queryPagingCount = sql.queryPaging(sqlPaging, paramM_B_TI, pageNum, pageSize, "data");
//查询接口返回type，动态生成datatable
var type=[ {	
            "en": "typecd",			
            "cn": "类别编码",			
            "view": "true",
            "ro": "1",
            "search":"0",
            "elemtype":"text",
            "datatype": "s",
            "numrange": "20",
            "dict": "",
            "unit": "",			
            "format": "",	
            "chart": ""				
        },			
        {			
            "en": "decd",			
            "cn": "数据元编码",			
            "view": "true",
            "ro": "0",
            "search":"1",
            "elemtype":"text",
            "datatype": "s",
            "numrange": "20",
            "dict": "",			
            "unit": "",			
            "format": "",	
            "chart": ""			
        },			
        {			
            "en": "en",			
            "cn": "英文名称",			
            "view": "true",
            "ro": "0",
            "search":"1",
            "elemtype":"text",
            "datatype": "s",
            "numrange": "20",
            "dict": "",			
             "unit": "",			
            "format": "",	
            "chart": ""			
        },			
        {			
            "en": "cn",			
            "cn": "中文名称",			
            "view": "true",	
            "ro": "0",
            "search": "1",
            "datatype": "s",
            "elemtype":"text",
            "numrange": "50",
            "dict": "",			
            "unit": "",			
            "format": "",		
            "chart": ""		
        },
         {			
            "en": "datatype",			
            "cn": "数据类型",			
            "view": "true",	
            "ro": "0",
            "search": "1",
            "elemtype":"text",
            "datatype": "s",
            "numrange": "20",
            "dict": "",			
            "unit": "",			
            "format": "",		
            "chart": ""		
        },
         {			
            "en": "numrange",			
            "cn": "数据长度",			
            "view": "true",
            "ro": "0",
            "search":"0",
            "elemtype":"text",
            "datatype": "s",
            "numrange": "20",
            "dict": "",			
            "unit": "",			
            "format": "",		
            "chart": ""	
        },
         {			
            "en": "format",			
            "cn": "显示格式",			
            "view": "true",
            "ro": "0",
            "search":"0",
            "elemtype":"text",
            "datatype": "s",
            "numrange": "50",
            "dict": "ZR.0042",			
            "unit": "",			
            "format": "",		
            "chart": ""	
        },
         {			
            "en": "unit",			
            "cn": "单位",			
            "view": "true",
            "ro": "0",
            "search":"0",
            "elemtype":"text",
            "datatype": "s",
            "numrange": "10",
            "dict": "ZR.0043",			
            "unit": "",			
            "format": "",		
            "chart": ""	
        },
         {			
            "en": "dict",			
            "cn": "字典类别",			
            "view": "true",
            "ro": "0",
            "search":"0",
            "elemtype":"text",
            "datatype": "s",
            "numrange": "10",
            "dict": "",			
            "unit": "",			
            "format": "",		
            "chart": ""	
        }
        //  {			
        //     "en": "status",			
        //     "cn": "状态",			
        //     "view": "true",
        //     "ro": "0",
        //     "search":"1",
        //     "elemtype":"select2_radio",
        //     "datatype": "s",
        //     "numrange": "10",
        //     "dict": "ZR.0001",			
        //     "unit": "",			
        //     "format": "",		
        //     "chart": ""	
        // }
];
map.put(sys.result,"type",type);
sys.setRetData("0", "", "data","type");