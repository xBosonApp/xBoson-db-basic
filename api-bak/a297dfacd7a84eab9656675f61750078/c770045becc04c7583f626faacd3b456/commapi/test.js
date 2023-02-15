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
// var id=sys.request.id;
// if(id==null){
//     sys.setRetData("1");
//     return;
// }
var id=sys.request.flag;
if(id==null){
    id="2";
}
if(id=="static1"){
    var ret={
    "type": [
        {
            "en": "en2",
            "cn": "统计A",
            "view": "1",
            "ro": "0",
            "must": "",
            "search": "",
            "elemtype": "",
            "datatype": "",
            "datalength": "",
            "format": "",
            "unit": "",
            "dict": "",
            "chart": "scatter,line,stagebar,stagecolumn,bar,pie,arealine,column"
        },
        {
            "en": "en3",
            "cn": "统计B",
            "view": "0",
            "ro": "0",
            "must": "",
            "search": "",
            "elemtype": "",
            "datatype": "",
            "datalength": "",
            "format": "",
            "unit": "2",
            "dict": "",
            "chart": "scatter,bar,stagebar,stagecolumn,line,pie,arealine,column"
        },
        {
            "en": "en4",
            "cn": "统计C",
            "view": "1",
            "ro": "0",
            "must": "",
            "search": "",
            "elemtype": "",
            "datatype": "",
            "datalength": "",
            "format": "",
            "unit": "1",
            "dict": "",
            "chart": "scatter,pie,stagebar,stagecolumn,line,bar,arealine,column"
        }
    ],
    "data": [
        {
            "en1": "直接访问",
            "en2": '121,111',
            "en3": '122,345',
            "en4": '123,123'
        },
        {
            "en1": "邮件营销",
            "en2": '121,111',
            "en3": '122,345',
            "en4": '123,123'
        },
        {
            "en1": "联盟广告",
            "en2": '121,32',
            "en3": '76,345',
            "en4": '123,54'
        },
        {
            "en1": "视频广告",
            "en2": '121,111',
            "en3": '23,345',
            "en4": '123,123'
        },
        {
            "en1": "搜索引擎",
            "en2": '121,111',
            "en3": '122,222',
            "en4": '123,88'
        }
    ],
   "search":[
        {
            "en": "enName1",
            "cn": "名称1",
            "elemtype": "text",
            "datatype": "",
            "numrange": "",
            "format": "",
            "unit": "1",
            "dict": ""
        },
        {
            "en": "enName2",
            "cn": "名称2",
            "elemtype": "select2_radio",
            "datatype": "",
            "numrange": "",
            "format": "",
            "unit": "2",
            "dict": "ZR.0001"
        }
    ]
    };
    sys.addRetData(ret.type,"type");
    sys.addRetData(ret.data,"data");
    sys.addRetData(ret.search,"search");
    sys.setRetData("0","","type","data","search");
} //散点

if(id=="static2"){
    var ret={
    "type": [
        {
            "en": "en1",
            "cn": "分类名",
            "view": "1",
            "ro": "0",
            "must": "",
            "search": "",
            "elemtype": "",
            "datatype": "",
            "datalength": "",
            "format": "",
            "unit": "",
            "dict": "",
            "chart": null
        },
        {
            "en": "en2",
            "cn": "统计A",
            "view": "1",
            "ro": "0",
            "must": "",
            "search": "",
            "elemtype": "",
            "datatype": "",
            "datalength": "",
            "format": "",
            "unit": "",
            "dict": "",
            "chart": "line,stagebar,stagecolumn,bar,pie,arealine,column,radar"
        },
        {
            "en": "en3",
            "cn": "统计B",
            "view": "0",
            "ro": "0",
            "must": "",
            "search": "",
            "elemtype": "",
            "datatype": "",
            "datalength": "",
            "format": "",
            "unit": "2",
            "dict": "",
            "chart": "bar,stagebar,stagecolumn,line,pie,arealine,column,radar"
        },
        {
            "en": "en4",
            "cn": "统计C",
            "view": "1",
            "ro": "0",
            "must": "",
            "search": "",
            "elemtype": "",
            "datatype": "",
            "datalength": "",
            "format": "",
            "unit": "1",
            "dict": "",
            "chart": "pie,stagebar,stagecolumn,line,bar,arealine,column,radar"
        }
    ],
    "data": [
        {
            "en1": "直接访问",
            "en2": 221,
            "en3": 222,
            "en4": 223
        },
        {
            "en1": "邮件营销",
            "en2": 321,
            "en3": 422,
            "en4": 523
        },
        {
            "en1": "联盟广告",
            "en2": 321,
            "en3": 622,
            "en4": 323
        },
        {
            "en1": "视频广告",
            "en2": 635,
            "en3": 636,
            "en4": 637
        },
        {
            "en1": "搜索引擎",
            "en2": 757,
            "en3": 758,
            "en4": 959
        }
    ],
   "search":[
        {
            "en": "enName1",
            "cn": "名称1",
            "elemtype": "text",
            "datatype": "",
            "numrange": "",
            "format": "",
            "unit": "1",
            "dict": ""
        },
        {
            "en": "enName2",
            "cn": "名称2",
            "elemtype": "select2_radio",
            "datatype": "",
            "numrange": "",
            "format": "",
            "unit": "2",
            "dict": "ZR.0001"
        }
    ]
    };
    sys.addRetData(ret.type,"type");
    sys.addRetData(ret.data,"data");
    sys.addRetData(ret.search,"search");
    sys.setRetData("0","","type","data","search");
} //常规

if(id=="static3"){  //仪表盘
    var ret={
    "type": [
        {
            "en": "en2",
            "cn": "分类名",
            "view": "1",
            "ro": "0",
            "must": "",
            "search": "",
            "elemtype": "",
            "datatype": "",
            "datalength": "",
            "format": "",
            "unit": "",
            "dict": "",
            "chart": 'gauge'
        }
    ],
    "data": [
        {
            "en1": "直接访问",
            "en2": 221,
            "en3": 222,
            "en4": 223
        },
        {
            "en1": "邮件营销",
            "en2": 321,
            "en3": 422,
            "en4": 523
        },
        {
            "en1": "联盟广告",
            "en2": 321,
            "en3": 622,
            "en4": 323
        },
        {
            "en1": "视频广告",
            "en2": 635,
            "en3": 636,
            "en4": 637
        },
        {
            "en1": "搜索引擎",
            "en2": 757,
            "en3": 758,
            "en4": 959
        }
    ],
   "search":[
        {
            "en": "enName1",
            "cn": "名称1",
            "elemtype": "text",
            "datatype": "",
            "numrange": "",
            "format": "",
            "unit": "1",
            "dict": ""
        },
        {
            "en": "enName2",
            "cn": "名称2",
            "elemtype": "select2_radio",
            "datatype": "",
            "numrange": "",
            "format": "",
            "unit": "2",
            "dict": "ZR.0001"
        }
    ]
    };
    sys.addRetData(ret.type,"type");
    sys.addRetData(ret.data,"data");
    sys.addRetData(ret.search,"search");
    sys.setRetData("0","","type","data","search");
}