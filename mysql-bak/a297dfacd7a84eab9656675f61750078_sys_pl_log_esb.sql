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
-- Table structure for table `sys_pl_log_esb`
--

DROP TABLE IF EXISTS `sys_pl_log_esb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_pl_log_esb` (
  `logid` char(32) NOT NULL DEFAULT '' COMMENT '日志ID',
  `log_time` char(28) DEFAULT NULL COMMENT '日志产生时间',
  `instanceid` char(32) DEFAULT NULL COMMENT '部署实例ID',
  `flowid` char(32) NOT NULL COMMENT '数据流ID',
  `runningid` char(32) DEFAULT NULL COMMENT '单次执行ID',
  `event_type` char(2) DEFAULT NULL COMMENT '事件类型',
  `pgnm` varchar(100) DEFAULT NULL COMMENT '程序名称',
  `instancenm` varchar(100) DEFAULT NULL COMMENT '实例名称',
  `log` varchar(2000) DEFAULT NULL COMMENT '日志内容',
  `log_data` varchar(2000) DEFAULT NULL COMMENT '日志数据',
  `createdt` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`logid`),
  KEY `sys_pl_log_esb_flowid` (`flowid`),
  KEY `sys_pl_log_esb_flowid_runningid` (`flowid`,`runningid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='ESB日志';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_pl_log_esb`
--

LOCK TABLES `sys_pl_log_esb` WRITE;
/*!40000 ALTER TABLE `sys_pl_log_esb` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_pl_log_esb` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:35:12
