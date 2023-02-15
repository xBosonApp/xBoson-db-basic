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
-- Table structure for table `sys_user_identity`
--

DROP TABLE IF EXISTS `sys_user_identity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_user_identity` (
  `pid` char(32) NOT NULL COMMENT '个人编号',
  `de0201031` char(2) NOT NULL COMMENT '身份证件类别代码',
  `de0201030` varchar(18) DEFAULT NULL COMMENT '身份证号码',
  `reg_date` char(8) DEFAULT NULL COMMENT '证件注册时间',
  `reg_end_date` char(8) DEFAULT NULL COMMENT '证件有效时间止',
  `status` char(1) DEFAULT NULL COMMENT '状态',
  `create_orgid` varchar(32) DEFAULT NULL COMMENT '创建机构ID',
  `create_pid` varchar(32) DEFAULT NULL COMMENT '创建人PID',
  `createdt` datetime DEFAULT NULL COMMENT '创建时间',
  `update_orgid` varchar(32) DEFAULT NULL COMMENT '修改机构ID',
  `update_pid` varchar(32) DEFAULT NULL COMMENT '修改人PID',
  `updatedt` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`pid`,`de0201031`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='个人证件信息表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_user_identity`
--

LOCK TABLES `sys_user_identity` WRITE;
/*!40000 ALTER TABLE `sys_user_identity` DISABLE KEYS */;
/*!40000 ALTER TABLE `sys_user_identity` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:35:34
