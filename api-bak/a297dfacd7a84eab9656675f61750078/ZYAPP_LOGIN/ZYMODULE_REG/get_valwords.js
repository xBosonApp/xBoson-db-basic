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
// liufengyuan

var tel=sys.request.tel;//手机注册
var email=sys.request.email;//邮箱注册
var userid="";
var valwords =sys.randomNumber(6);
if(null!=tel){
  cache.set("valwords", "valwords"+tel,valwords,60);
  //响手机发送验证码 send_phone(tel,"亲爱的用户你好:本次验证码："+valwords+"验证码60秒后过期。"+sys.currentTimeString()+"：智融信息祝您工作愉快。");
  //记录日志？
}
if(null!=email){
  cache.set("valwords", "valwords"+email,valwords,60);
  //响手机发送验证码 send_email(email,"亲爱的用户你好:本次验证码："+valwords+"验证码60秒后过期。"+sys.currentTimeString()+"：智融信息祝您工作愉快。");
  //记录日志？
}
sys.setRetData("0",valwords);