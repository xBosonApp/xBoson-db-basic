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
-- Table structure for table `sys_pl_chain`
--

DROP TABLE IF EXISTS `sys_pl_chain`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_pl_chain` (
  `chain_id` varchar(40) NOT NULL COMMENT '主键',
  `name` varchar(100) NOT NULL COMMENT '区块链名称',
  `status` char(1) NOT NULL DEFAULT '1',
  `createdt` datetime DEFAULT NULL,
  `updatedt` datetime DEFAULT NULL,
  `offline_gpk` datetime DEFAULT NULL COMMENT '创世区块私钥离线保存时间',
  `create_userid` varchar(45) NOT NULL COMMENT '创建人',
  `physical_channel` varchar(200) NOT NULL COMMENT '物理通道',
  `physical_chain` varchar(200) NOT NULL COMMENT '物理链文件',
  `orgid` varchar(45) NOT NULL,
  `consensus` text COMMENT '共识表达式',
  `roleid` varchar(32) DEFAULT NULL COMMENT '如果链设置的角色属性为空, 则任何人都可以打开该链,\n否则只有该角色的用户可以打开链.',
  PRIMARY KEY (`chain_id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='区块链实例';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_pl_chain`
--

LOCK TABLES `sys_pl_chain` WRITE;
/*!40000 ALTER TABLE `sys_pl_chain` DISABLE KEYS */;
INSERT INTO `sys_pl_chain` VALUES ('0f7611b17b5144509e90dfad34be9369','t2','0','2018-09-07 15:29:17','2018-09-07 15:29:17',NULL,'admin-pl','ch0','a297dfacd7a84eab9656675f61750078@cfd04904d3bf424b94d74aba9e29d114','a297dfacd7a84eab9656675f61750078','and(\'c94756c853064371bc07ef17da9cb12f\')',NULL),('406eb26f33154d4dae0aa2c4b6bfd2c7','xxx','0','2018-11-09 10:44:00','2018-11-09 10:44:00',NULL,'admin-pl','ch0','a297dfacd7a84eab9656675f61750078@0d377a77e9034ccc99fffb99a2d42cdb','a297dfacd7a84eab9656675f61750078',NULL,NULL),('787c6f16b04641b792e22987e46b9720','x1','0','2018-09-08 12:50:06','2018-09-08 12:50:06',NULL,'admin-pl','ch0','a297dfacd7a84eab9656675f61750078@062f466d487843079ac3dec313881b6a','a297dfacd7a84eab9656675f61750078',NULL,NULL),('a34feb4e8dc942ceaabed4ad4259a04c','t4','0','2018-09-08 11:37:40','2018-09-08 11:37:40',NULL,'admin-pl','ch0','a297dfacd7a84eab9656675f61750078@99b905ecda8d4f88b7d43475d5ad8fc4','a297dfacd7a84eab9656675f61750078','and(\'c94756c853064371bc07ef17da9cb12f\')',NULL),('e1cea52f77b74564814475bcf083fa77','xcoin','0','2018-09-05 07:50:01','2018-09-05 07:50:01',NULL,'admin-pl','ch0','a297dfacd7a84eab9656675f61750078@8b9691f0e8ee4ae0a3b2222ab98b05f4','a297dfacd7a84eab9656675f61750078',NULL,NULL),('e46066829cc6497a8ce40767807ba563','文件共享','1','2020-01-03 10:00:17','2020-01-03 10:00:17',NULL,'admin-pl','ch0','a297dfacd7a84eab9656675f61750078@252642bf577d455ba411696beb0b15fb','a297dfacd7a84eab9656675f61750078',NULL,NULL),('e49b37d15beb41d3915cbe033e666aef','t1','0','2018-09-05 07:57:46','2018-09-05 07:57:46',NULL,'admin-pl','ch0','a297dfacd7a84eab9656675f61750078@87520bd397ea43a6baf75d3a26c83074','a297dfacd7a84eab9656675f61750078','and(\'c94756c853064371bc07ef17da9cb12f\')',NULL);
/*!40000 ALTER TABLE `sys_pl_chain` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:35:08
