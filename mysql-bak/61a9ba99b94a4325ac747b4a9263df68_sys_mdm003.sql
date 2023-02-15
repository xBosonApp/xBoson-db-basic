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
USE `61a9ba99b94a4325ac747b4a9263df68`;
-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: 61a9ba99b94a4325ac747b4a9263df68
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
-- Table structure for table `sys_mdm003`
--

DROP TABLE IF EXISTS `sys_mdm003`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_mdm003` (
  `typecd` varchar(100) NOT NULL COMMENT '类别编码',
  `decd` varchar(30) NOT NULL COMMENT '数据元编码',
  `en` varchar(50) NOT NULL COMMENT '英文名称',
  `cn` varchar(150) NOT NULL COMMENT '中文名称',
  `datatype` varchar(100) NOT NULL COMMENT '数据类型',
  `numrange` varchar(32) DEFAULT NULL COMMENT '数据长度',
  `format` varchar(100) DEFAULT NULL COMMENT '显示格式',
  `unit` varchar(100) DEFAULT NULL COMMENT '单位',
  `dict` varchar(100) DEFAULT NULL COMMENT '字典类别',
  `isstd` char(1) DEFAULT NULL COMMENT '是否标准',
  `status` char(1) NOT NULL COMMENT '状态',
  `mark` varchar(600) DEFAULT NULL COMMENT '说明',
  `createdt` datetime NOT NULL COMMENT '创建时间',
  `updatedt` datetime NOT NULL COMMENT '更新时间',
  `version` varchar(100) DEFAULT NULL COMMENT '版本',
  PRIMARY KEY (`typecd`,`decd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='数据元';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_mdm003`
--

LOCK TABLES `sys_mdm003` WRITE;
/*!40000 ALTER TABLE `sys_mdm003` DISABLE KEYS */;
INSERT INTO `sys_mdm003` VALUES ('DE.SAAS','DE.SAAS.BASE001','id','ID','VARCHAR','32',NULL,NULL,NULL,'0','1',NULL,'2022-03-13 20:52:17','2022-03-13 20:52:17','2022'),('DE.SAAS','DE.SAAS.BASE002','name','name','VARCHAR','100',NULL,NULL,NULL,'0','1',NULL,'2022-03-13 20:52:17','2022-03-13 20:52:17','2022'),('DE.SAAS','DE.SAAS.BASE003','updateDate','更新时间','DATETIME',NULL,NULL,NULL,NULL,'0','1',NULL,'2022-03-13 20:52:17','2022-03-13 20:52:17','2022'),('DE.SAAS','DE.SAAS.BASE004','createDate','创建时间','DATETIME',NULL,NULL,NULL,NULL,'0','1',NULL,'2022-03-13 20:52:17','2022-03-13 20:52:17','2022'),('DE.SAAS','DE.SAAS.BASE005','mark','备注','VARCHAR','200',NULL,NULL,NULL,'0','1',NULL,'2022-03-13 20:52:17','2022-03-13 20:52:17','2022'),('DE.SAAS','DE.SAAS.BASE006','status','状态','VARCHAR','32',NULL,NULL,NULL,'0','1',NULL,'2022-03-13 20:52:17','2022-03-13 20:52:17','2022'),('DE.SAAS','DE.SAAS.BASE007','shortkey','快捷键','VARCHAR','100',NULL,NULL,NULL,'0','1',NULL,'2022-03-13 20:52:17','2022-03-13 20:52:17','2022'),('DE.SAAS','DE.SAAS.BASE008','jsondata','JSON数据字符串','VARCHAR','2000',NULL,NULL,NULL,'0','1',NULL,'2022-03-13 20:52:17','2022-03-13 20:52:17','2022'),('DE.SAAS','DE.SAAS.BASE009','url','URl','VARCHAR','100',NULL,NULL,NULL,'0','1',NULL,'2022-03-13 20:52:17','2022-03-13 20:52:17','2022'),('DE.SAAS','DE.SAAS.BASE010','color','颜色','VARCHAR','100',NULL,NULL,NULL,'0','1',NULL,'2022-03-13 21:00:13','2022-03-13 21:00:13','2022'),('DE.SAAS','DE.SAAS.BASE011','tentId','租户ID','VARCHAR','36',NULL,NULL,NULL,'0','1',NULL,'2022-03-14 17:28:58','2022-03-14 17:28:58','2022');
/*!40000 ALTER TABLE `sys_mdm003` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:34:33
