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
"use strict";

sql.query("Select content From sys_api_content Where contentid = 'ddac904b4fb64ae9a5396a2810026b97'", [], 'a');
 
var scode = sys.result.a[0].content;
var src = se.decodeApiScript(scode);
var s2code = se.encodeApi2(src, 1);
var src2 = se.decryptApi2(s2code, 1);

var sl = src.length, ol = scode.length, nl = s2code.length;
var fx = ["压缩长度对比"
    , '源文件:', sl, "旧版算法:", ol
    , "新版算法:", nl
    , '; 旧版算法对比源文件增加了', (sl/ol*100).toFixed(2)+'%'
    , '; 新版算法压缩到源文件的', (nl/sl*100).toFixed(2)+'%'
    , '; 新版算法压缩到旧算法的', (nl/ol*100).toFixed(2)+'%'
    ];
sys.put('report', fx.join(' '));
    
sys.setRetData(0, src2==src ? 'ok' : 'bad');