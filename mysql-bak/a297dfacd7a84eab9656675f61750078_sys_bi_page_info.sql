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
-- Table structure for table `sys_bi_page_info`
--

DROP TABLE IF EXISTS `sys_bi_page_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_bi_page_info` (
  `pageid` varchar(100) NOT NULL COMMENT '画面ID',
  `typenm` varchar(150) NOT NULL COMMENT '画面名称',
  `typecd` varchar(100) NOT NULL COMMENT '分类ID',
  `url` varchar(100) DEFAULT NULL COMMENT '页面URI',
  `shortkey` varchar(100) DEFAULT NULL COMMENT '快捷码',
  `status` char(1) NOT NULL COMMENT '状态',
  `mark` varchar(600) DEFAULT NULL COMMENT '说明',
  `createdt` datetime NOT NULL COMMENT '创建时间',
  `updatedt` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`pageid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='BI图表-画面分类索引';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_bi_page_info`
--

LOCK TABLES `sys_bi_page_info` WRITE;
/*!40000 ALTER TABLE `sys_bi_page_info` DISABLE KEYS */;
INSERT INTO `sys_bi_page_info` VALUES ('ac3f632b23ec47b6911429e084ed7a35','aaa','b791d329239d435fa16ba4e3a8162479',NULL,'AAA','1',NULL,'2017-02-22 11:58:02','2017-02-22 11:58:02'),('dadb568337354a3f842e3cf701ffb404','sa','a0680afc1529402ca5f5e325abcd4d30',NULL,'SA','1',NULL,'2017-02-22 13:44:58','2017-02-22 13:44:58'),('e18697f0488e4c4590ab5d9e73d64910','123','a0680afc1529402ca5f5e325abcd4d30',NULL,'','1',NULL,'2017-02-22 10:28:31','2017-02-22 10:30:10');
/*!40000 ALTER TABLE `sys_bi_page_info` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:34:50
