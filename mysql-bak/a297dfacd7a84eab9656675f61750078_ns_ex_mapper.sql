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
-- Table structure for table `ns_ex_mapper`
--

DROP TABLE IF EXISTS `ns_ex_mapper`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ns_ex_mapper` (
  `mapid` varchar(32) NOT NULL,
  `createdt` datetime NOT NULL,
  `updatedt` datetime NOT NULL,
  `sql_str` varchar(5000) NOT NULL COMMENT 'SQl查询文',
  `map_json` varchar(5000) NOT NULL COMMENT '数据集>SQl列 映射',
  `criid` varchar(32) NOT NULL COMMENT '交换标准 ns_ex_cri',
  `source_did` varchar(32) NOT NULL COMMENT '数据源主键 sys_pl_drm_ds001',
  `wsid` varchar(32) NOT NULL COMMENT 'SOAP 调用定义 sys_webservice',
  `rtid` varchar(32) NOT NULL COMMENT 'SOAP 调用定义 ns_ex_remote',
  `sourceorgan` varchar(50) NOT NULL COMMENT '消费方所在机构编码',
  `sourcedomain` varchar(50) NOT NULL COMMENT '消费方所使用的接入系统编码',
  `servicecode` varchar(50) NOT NULL COMMENT '请求的服务在服务注册中心的唯一服务编码',
  `targetorgan` varchar(50) DEFAULT NULL COMMENT '服务提供方所在的机构编码',
  `targetdomain` varchar(50) NOT NULL COMMENT '服务提供方所在的接入系统编码',
  `route` varchar(50) DEFAULT NULL COMMENT '服务路由信息, scenecode:serviceename [/route]',
  `process` varchar(50) DEFAULT NULL COMMENT '服务流程编排相关信息',
  `status` int(11) NOT NULL DEFAULT '1',
  `map_name` varchar(45) NOT NULL,
  PRIMARY KEY (`mapid`),
  UNIQUE KEY `map_name_UNIQUE` (`map_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='DB映射配置';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ns_ex_mapper`
--

LOCK TABLES `ns_ex_mapper` WRITE;
/*!40000 ALTER TABLE `ns_ex_mapper` DISABLE KEYS */;
INSERT INTO `ns_ex_mapper` VALUES ('0','2018-06-08 19:00:43','2018-06-17 15:52:40',' Select * from sys_pl_log_request ','{\"CT02_01_031_01\":{\"target\":\"CT02_01_031_01\",\"dbfield\":\"logid\",\"usedict\":false,\"typecd\":\"GBT.4658\",\"typenm\":\"学历代码\",\"default\":\"1\"},\"CT02_01_040_01\":{\"target\":\"CT02_01_040_01\",\"dbfield\":\"log_time\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"CT05_01_022_02\":{\"target\":\"CT05_01_022_02\",\"dbfield\":\"log_level\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"CT08_10_052_10\":{\"target\":\"CT08_10_052_10\",\"dbfield\":\"log_error_type\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS01_00_009_01\":{\"target\":\"WS01_00_009_01\",\"dbfield\":\"requestid\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS02_01_005_01_01\":{\"target\":\"WS02_01_005_01_01\",\"dbfield\":\"serverid\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS02_01_030_01\":{\"target\":\"WS02_01_030_01\",\"dbfield\":\"log\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS02_01_031_01\":{\"target\":\"WS02_01_031_01\",\"dbfield\":\"orgid\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS02_01_039_001\":{\"target\":\"WS02_01_039_001\",\"dbfield\":\"pid\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS02_01_040_01\":{\"target\":\"WS02_01_040_01\",\"dbfield\":\"sysid\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS05_01_022_02\":{\"target\":\"WS05_01_022_02\",\"dbfield\":\"user_key\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS05_01_918_01\":{\"target\":\"WS05_01_918_01\",\"dbfield\":\"remote_ip\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS08_10_052_10\":{\"target\":\"WS08_10_052_10\",\"dbfield\":\"appid\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS09_00_915_01\":{\"target\":\"WS09_00_915_01\",\"dbfield\":\"moduleid\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS09_00_916_01\":{\"target\":\"WS09_00_916_01\",\"dbfield\":\"apiid\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"}}','25642677089337651','00000000000000000000000000000000','0','6f55eafc12df4e8d93beedcee568725d','47011661433010211A1001','NRHPT00001','HSB:PUSH_DATA','47011661433010211A1001','NRHPT00002',NULL,NULL,1,'config1(可以运行测试)'),('21cb27746b534f3a98f35449f698593e','2018-06-16 15:58:51','2018-06-17 14:01:03','Select * from sys_pl_log_request','{\"CT02_01_031_01\":{\"target\":\"CT02_01_031_01\",\"dbfield\":\"createdt\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"1\"},\"CT02_01_040_01\":{\"target\":\"CT02_01_040_01\",\"dbfield\":\"log_time\",\"usedict\":\"on\",\"typecd\":\"GBT.8561\",\"typenm\":\"职务类型\",\"default\":\"2\"},\"CT05_01_022_02\":{\"target\":\"CT05_01_022_02\",\"dbfield\":\"log_level\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"3\"},\"CT08_10_052_10\":{\"target\":\"CT08_10_052_10\",\"dbfield\":\"log_error_type\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS01_00_009_01\":{\"target\":\"WS01_00_009_01\",\"dbfield\":\"requestid\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS02_01_005_01_01\":{\"target\":\"WS02_01_005_01_01\",\"dbfield\":\"serverid\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS02_01_030_01\":{\"target\":\"WS02_01_030_01\",\"dbfield\":\"log\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS02_01_031_01\":{\"target\":\"WS02_01_031_01\",\"dbfield\":\"orgid\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS02_01_039_001\":{\"target\":\"WS02_01_039_001\",\"dbfield\":\"pid\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS02_01_040_01\":{\"target\":\"WS02_01_040_01\",\"dbfield\":\"sysid\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS05_01_022_02\":{\"target\":\"WS05_01_022_02\",\"dbfield\":\"user_key\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS05_01_918_01\":{\"target\":\"WS05_01_918_01\",\"dbfield\":\"remote_ip\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS08_10_052_10\":{\"target\":\"WS08_10_052_10\",\"dbfield\":\"appid\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS09_00_915_01\":{\"target\":\"WS09_00_915_01\",\"dbfield\":\"moduleid\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS09_00_916_01\":{\"target\":\"WS09_00_916_01\",\"dbfield\":\"apiid\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"}}','25642677089337664','00000000000000000000000000000000','245ec89153dc4aa2a01e6507f10d8ad7','6f55eafc12df4e8d93beedcee568725d','47011661433010211A1001','NRHPT00001','HSB:PUSH_DATA','47011662233010511A1001','NRHPT00001','route1','process1',1,'config3'),('5ec4acd5928249cda66ce31fac5a9f7b','2018-06-16 14:10:40','2018-06-16 15:47:10','Select * from sys_pl_log_request','{\"CT02_01_031_01\":{\"target\":\"CT02_01_031_01\",\"dbfield\":\"user_referer\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"1\"},\"CT02_01_040_01\":{\"target\":\"CT02_01_040_01\",\"dbfield\":\"log_time\",\"usedict\":\"on\",\"typecd\":\"GBT.6565\",\"typenm\":\"职业类别\",\"default\":\"2\"},\"CT05_01_022_02\":{\"target\":\"CT05_01_022_02\",\"dbfield\":\"log_level\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"3\"},\"CT08_10_052_10\":{\"target\":\"CT08_10_052_10\",\"dbfield\":\"log_error_type\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS01_00_009_01\":{\"target\":\"WS01_00_009_01\",\"dbfield\":\"requestid\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS02_01_005_01_01\":{\"target\":\"WS02_01_005_01_01\",\"dbfield\":\"serverid\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS02_01_030_01\":{\"target\":\"WS02_01_030_01\",\"dbfield\":\"log\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS02_01_031_01\":{\"target\":\"WS02_01_031_01\",\"dbfield\":\"orgid\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS02_01_039_001\":{\"target\":\"WS02_01_039_001\",\"dbfield\":\"pid\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS02_01_040_01\":{\"target\":\"WS02_01_040_01\",\"dbfield\":\"sysid\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS05_01_022_02\":{\"target\":\"WS05_01_022_02\",\"dbfield\":\"user_key\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS05_01_918_01\":{\"target\":\"WS05_01_918_01\",\"dbfield\":\"remote_ip\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS08_10_052_10\":{\"target\":\"WS08_10_052_10\",\"dbfield\":\"appid\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS09_00_915_01\":{\"target\":\"WS09_00_915_01\",\"dbfield\":\"moduleid\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS09_00_916_01\":{\"target\":\"WS09_00_916_01\",\"dbfield\":\"apiid\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"}}','25642677089337659','00000000000000000000000000000000','245ec89153dc4aa2a01e6507f10d8ad7','e0daa7c7d9a6416cb114fdec920f0b73','47011661433010211A1001','NRHPT00001','HSB:PUSH_DATA','47011661433010211A1001','NRHPT00002',NULL,NULL,1,'config2'),('890431ba63424b6b8163f7b0c89cd8a1','2018-06-17 17:26:13','2018-06-17 17:29:09','Select * from sys_mdm002','{\"CT02_01_031_01\":{\"target\":\"CT02_01_031_01\",\"dbfield\":\"dictcd\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"CT02_01_040_01\":{\"target\":\"CT02_01_040_01\",\"dbfield\":\"typecd\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"CT05_01_022_02\":{\"target\":\"CT05_01_022_02\",\"dbfield\":\"dictnm\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"CT08_10_052_10\":{\"target\":\"CT08_10_052_10\",\"dbfield\":\"shortkey\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS01_00_009_01\":{\"target\":\"WS01_00_009_01\",\"dbfield\":\"status\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS02_01_005_01_01\":{\"target\":\"WS02_01_005_01_01\",\"dbfield\":\"mark\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS02_01_030_01\":{\"target\":\"WS02_01_030_01\",\"dbfield\":\"createdt\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS02_01_031_01\":{\"target\":\"WS02_01_031_01\",\"dbfield\":\"updatedt\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS02_01_039_001\":{\"target\":\"WS02_01_039_001\",\"dbfield\":\"version\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS02_01_040_01\":{\"target\":\"WS02_01_040_01\",\"dbfield\":\"typecd\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS05_01_022_02\":{\"target\":\"WS05_01_022_02\",\"dbfield\":\"dictcd\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS05_01_918_01\":{\"target\":\"WS05_01_918_01\",\"dbfield\":\"dictnm\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS08_10_052_10\":{\"target\":\"WS08_10_052_10\",\"dbfield\":\"shortkey\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS09_00_915_01\":{\"target\":\"WS09_00_915_01\",\"dbfield\":\"status\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"},\"WS09_00_916_01\":{\"target\":\"WS09_00_916_01\",\"dbfield\":\"mark\",\"usedict\":false,\"typecd\":\"\",\"typenm\":\"\",\"default\":\"\"}}','25642677089337661','00000000000000000000000000000000','ec7e883b59e3440b9c7b73b0d55493f4','6f55eafc12df4e8d93beedcee568725d','47011661433010211A1001','NRHPT00001','HSB:PUSH_DATA','47011662233010511A1001','NRHPT00003',NULL,NULL,1,'test测试01');
/*!40000 ALTER TABLE `ns_ex_mapper` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:34:46
