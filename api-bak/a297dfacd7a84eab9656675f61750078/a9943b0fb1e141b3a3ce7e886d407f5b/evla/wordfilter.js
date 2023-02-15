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

// API https://github.com/pyloque/fastscan
// 词汇库 https://github.com/pyloque/fastscan/blob/master/words.test
var FastScanner = require("fastscan");
//1、quick 选项表示快速模式，匹配到一个就立即返回
//2、longest 表示最长模式，同一个位置出现多个词汇(中国、中国人)，选择最长的一个(中国人)
//3、默认匹配出所有的词汇，同一个位置可能会出现多个词汇
var options = {quick: true, longest: false}

var words = ["今日头条", "微信", "支付宝"];
var scanner = new FastScanner(words);
var content = "今日头条小程序终于来了，这是继微信、支付宝、百度后，第四个推出小程序功能的App。猫眼电影率先试水，出现在今日头条。";
//查询匹配的词汇以及所在字符串的位置 search(content, option={})
var offWords = scanner.search(content);
sys.put("offWords", offWords);
//查询匹配词汇的命中数量 hits(content, options={})
var hits = scanner.hits(content, options);
sys.put("hits", hits);


//临时动态增加词汇，不修正其它词汇的回溯指针 add(word)
scanner.add("百度");

sys.setRetData(0, 'ok');