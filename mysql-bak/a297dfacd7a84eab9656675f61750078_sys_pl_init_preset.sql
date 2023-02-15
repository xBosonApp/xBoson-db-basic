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
-- Table structure for table `sys_pl_init_preset`
--

DROP TABLE IF EXISTS `sys_pl_init_preset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_pl_init_preset` (
  `presetid` char(32) NOT NULL COMMENT '初始化预设ID',
  `presetnm` varchar(100) NOT NULL COMMENT '初始化预设名称',
  `mark` varchar(200) DEFAULT NULL COMMENT '说明',
  `status` char(1) NOT NULL COMMENT '状态',
  `createdt` datetime DEFAULT NULL COMMENT '创建时间',
  `updatedt` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`presetid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='租户初始化预设信息表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_pl_init_preset`
--

LOCK TABLES `sys_pl_init_preset` WRITE;
/*!40000 ALTER TABLE `sys_pl_init_preset` DISABLE KEYS */;
INSERT INTO `sys_pl_init_preset` VALUES ('c2b58bbc61e4453b930e7fd26d82aa42','开发商预设[2016-10-25 11:06:41]','已用在人口健康机构无法删除，但将来需废弃','1','2016-10-25 11:06:41','2016-10-26 10:57:20'),('c69c636069d04630ab37b19d0e609d21','开发商预设',NULL,'1','2015-01-06 16:18:36','2015-01-20 15:00:37'),('e7a5a5f6f8bd463490f1306cc80d45a4','开发商预设-复制[2015-04-23 14:23:53]',NULL,'1','2015-04-23 14:23:53','2016-10-26 10:56:40'),('e944dd5a17bd45098529a2aed8b36c21','租户预设',NULL,'1','2015-01-07 08:59:01','2015-01-20 15:00:45'),('fa3d4d8db3b449bdb96404231a17534c','开发商预设-[2017-02-21 09:44:36]NEW',NULL,'1','2017-02-21 09:44:36','2017-02-21 09:45:15'),('fc020149a20c40c2a4cc2b9bbed958bd','开发商预设-复制[2015-04-16 18:22:29]',NULL,'1','2015-04-16 18:22:29','2016-10-26 10:56:45'),('fca76299f467469b8f7959f832b59d35','开发商预设-复制[2016-03-09 10:41:01]',NULL,'1','2015-09-15 08:41:01','2016-10-26 10:56:51'),('fe28f1e8ebf34729bcbad51a48033047','开发商预设-复制[2016-10-26 09:41:26]!','最新','1','2016-10-26 09:41:26','2021-10-18 17:42:02');
/*!40000 ALTER TABLE `sys_pl_init_preset` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:35:10
