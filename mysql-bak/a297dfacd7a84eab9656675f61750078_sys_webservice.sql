-- Copyright 2023 Jing Yanming
--
-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at
--
--     http://www.apache.org/licenses/LICENSE-2.0
--
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS,
-- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
-- See the License for the specific language governing permissions and
-- limitations under the License.
USE `a297dfacd7a84eab9656675f61750078`;
-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: a297dfacd7a84eab9656675f61750078
-- ------------------------------------------------------
-- Server version	5.7.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `sys_webservice`
--

DROP TABLE IF EXISTS `sys_webservice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_webservice` (
  `wsid` varchar(32) NOT NULL,
  `wsname` varchar(45) NOT NULL,
  `wsnote` varchar(500) DEFAULT NULL,
  `ws_mod_name` varchar(45) NOT NULL COMMENT 'ws 模块名称',
  `ws_func_name` varchar(45) NOT NULL COMMENT '方法名称',
  `ws_uri` varchar(200) NOT NULL,
  `ws_config_json` varchar(5000) NOT NULL,
  `createdt` datetime NOT NULL,
  `updatedt` datetime NOT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`wsid`),
  UNIQUE KEY `wsid_UNIQUE` (`wsid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='webservice';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_webservice`
--

LOCK TABLES `sys_webservice` WRITE;
/*!40000 ALTER TABLE `sys_webservice` DISABLE KEYS */;
INSERT INTO `sys_webservice` VALUES ('0','测试用WebService','模拟 webservice','mod','f0','http://127.0.0.1:18800','{\"ns\":\"http://yanming\",\"name\":\"f0\",\"curl\":\"http://127.0.0.1:18800\",\"wsname\":\"测试用WebService\"}','2018-06-08 19:00:43','2018-06-29 14:29:04',1),('245ec89153dc4aa2a01e6507f10d8ad7','获得本IP地址','获得您的IP地址和地址信息输入参数：无，返回数据： 一个一维字符串数组String(1)，String(0) = IP地址；String(1) = 地址信息','IpAddressSearchWebServiceSoap','getGeoIPContext','http://www.webxml.com.cn/WebServices/IpAddressSearchWebService.asmx','{\"output\":{\"parameters\":[\"@complexType\",\"@sequence\",\"getGeoIPContextResult$tns:ArrayOfString\"]},\"input\":{\"parameters\":[\"@complexType\"]},\"curl\":\"http://www.webxml.com.cn/WebServices/IpAddressSearchWebService.asmx\",\"ns\":\"http://WebXml.com.cn/\",\"name\":\"getGeoIPContext\",\"wsname\":\"获得本IP地址\"}','2018-06-12 21:46:25','2018-06-17 13:25:37',1),('465535d111784e06be88d85670c27a13','测试会错误[测试用例]','获得本IP地址搜索 WEB 服务的数据库版本更新时间输入参数：无，输出参数 String','IpAddressSearchWebServiceSoap','getVersionTime','http://www.webxml.com.cn/WebServices/IpAddressSearchWebService.asmx','{\"output\":{\"parameters\":[\"@complexType\",\"@sequence\",\"getVersionTimeResult$s:string\"]},\"input\":{\"parameters\":[\"@complexType\"]},\"curl\":\"http://www.webxml.com.cn/WebServices/IpAddressSearchWebService.asmx\",\"ns\":\"http://WebXml.com.cn/\",\"name\":\"getVersionTime\",\"wsname\":\"测试会错误[测试用例]\"}','2018-06-13 12:18:17','2018-06-17 17:03:31',1),('49562d6698f64b25914cc75364a6ae68','天气预报','根据城市或地区名称查询获得未来三天内天气情况、现在的天气实况、天气和生活指数','WeatherWebServiceSoap','getWeatherbyCityName','http://www.webxml.com.cn/WebServices/WeatherWebService.asmx','{\"output\":{\"parameters\":[\"@complexType\",\"@sequence\",\"getWeatherbyCityNameResult$tns:ArrayOfString\"]},\"input\":{\"parameters\":[\"@complexType\",\"@sequence\",\"theCityName$s:string\"]},\"curl\":\"http://www.webxml.com.cn/WebServices/WeatherWebService.asmx\",\"ns\":\"http://WebXml.com.cn/\",\"name\":\"getWeatherbyCityName\",\"wsname\":\"天气预报\"}','2018-06-13 08:47:11','2018-06-14 07:31:30',1),('eedfcc86ab9b425da7bf46b1cdbb6593','中文<->英文双向翻译WEB服务','中英文双向翻译 DataSet输入参数：wordKey = 单词； 返回数据：DataSet。（包括全部数据三个DataTable）','EnglishChineseSoap','Translator','http://fy.webxml.com.cn/webservices/EnglishChinese.asmx','{\"output\":{\"parameters\":[\"@complexType\",\"@sequence\",\"TranslatorResult\",\"@complexType\",\"@sequence\",\"@element\",\"@any\"]},\"input\":{\"parameters\":[\"@complexType\",\"@sequence\",\"wordKey$s:string\"]},\"curl\":\"http://fy.webxml.com.cn/webservices/EnglishChinese.asmx\",\"ns\":\"http://WebXml.com.cn/\",\"name\":\"Translator\",\"wsname\":\"中文<->英文双向翻译WEB服务\"}','2018-06-17 09:56:11','2018-06-17 10:32:11',1);
/*!40000 ALTER TABLE `sys_webservice` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:35:35
