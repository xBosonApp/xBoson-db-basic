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

// 可供测试的在线 webservice
// https://my.oschina.net/CraneHe/blog/183471

var xml = require("xml");
var stream = require("streamutil");

var buf = stream.openStringBufferOutputStream();
var build = xml.build(buf, true);
build.writeHead();

var messages = build.tag('messages');
messages.attr("xmlns", 'http://www.neusoft.com/hit/rhin');
var switchset = messages.tag('switchset');
var visitor = switchset.tag('visitor');

  var sourceorgan = visitor.tag('sourceorgan');
  sourceorgan.xml('服务消费方机构编码');
  var sourcedomain = visitor.tag('sourcedomain');
  sourcedomain.xml('服务消费方接入系统编码');
  
var serviceinf = switchset.tag('serviceinf');

  var servicecode = serviceinf.tag('servicecode');
  
var provider = switchset.tag('provider');

  var targetorgan = provider.tag('targetorgan');
  targetorgan.text('服务提供方机构编码');
  var targetdomain = provider.tag('targetdomain');
  targetdomain.text('服务提供方接入系统编码');
  
var route = switchset.tag('route');
route.text('路由信息（统一入口使用，一般服务不填写）');

var process = switchset.tag('process');

var switchmessage = switchset.tag('switchmessage');
switchmessage.tag('messagecode');
switchmessage.tag('messagetext');


var business = messages.tag("business");

  var standardcode = business.tag('standardcode');
  var returnmessage = business.tag('returnmessage');
  
    var retcode = returnmessage.tag('retcode');
    retcode.text('处理结果编码')
    var rettext = returnmessage.tag('rettext');
    rettext.text('处理结果描述')


var extendset = messages.tag('extendset');


//var dmp = build.tag("dmp");
// var datasets = dmp.tag('datasets');

build.end();
var x = buf.toString();
console.log(x);
sys.setRetData(0, x);