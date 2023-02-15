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
-- Table structure for table `sys_pl_tp_app_uid`
--

DROP TABLE IF EXISTS `sys_pl_tp_app_uid`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_pl_tp_app_uid` (
  `tp_appid` varchar(32) NOT NULL COMMENT '应用ID',
  `pid` char(32) NOT NULL COMMENT 'Persion ID',
  `uid` varchar(64) NOT NULL COMMENT '应用内的userid',
  `status` char(1) NOT NULL COMMENT '状态 0无效1有效',
  `createdt` datetime DEFAULT NULL COMMENT '创建时间',
  `updatedt` datetime DEFAULT NULL COMMENT '修改时间',
  `scope` varchar(100) DEFAULT NULL COMMENT '授权范围（Scope）',
  `req_scope` varchar(100) DEFAULT NULL COMMENT '请求的授权范围（Scope）',
  PRIMARY KEY (`tp_appid`,`pid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='第三方应用用户ID托管表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_pl_tp_app_uid`
--

LOCK TABLES `sys_pl_tp_app_uid` WRITE;
/*!40000 ALTER TABLE `sys_pl_tp_app_uid` DISABLE KEYS */;
INSERT INTO `sys_pl_tp_app_uid` VALUES ('beb6d8af57244078b185c551b0c1718e','13ce1317c13e44cc8839685ba8ff9978','tpjilianzhi','1','2015-11-10 15:08:47','2015-11-10 15:08:47','openid','openid'),('d8016ba77dc345dfa8681eeee7814d7f','1f33f752805443e59bfe5f8f77481443','admin-pl','1','2016-12-05 14:39:44','2016-12-05 14:39:44','',''),('d8016ba77dc345dfa8681eeee7814d7f','d7bc1ee05b0b4e77ba00f1ee16eabc5d','show','1','2016-12-06 12:55:38','2016-12-06 12:55:38','','');
/*!40000 ALTER TABLE `sys_pl_tp_app_uid` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:35:24
