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
-- Table structure for table `sys_md_mm002`
--

DROP TABLE IF EXISTS `sys_md_mm002`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_md_mm002` (
  `typecd` varchar(100) NOT NULL COMMENT '类别编码',
  `decd` varchar(30) NOT NULL COMMENT '数据元编码',
  `en` varchar(100) NOT NULL COMMENT '英文名称',
  `cn` varchar(50) NOT NULL COMMENT '中文名称',
  `mk` char(1) NOT NULL COMMENT '主键',
  `must` char(1) NOT NULL COMMENT '必须',
  `dv` varchar(100) DEFAULT NULL COMMENT '缺省值',
  `sorting` decimal(10,0) NOT NULL COMMENT '排序',
  `elemtype` varchar(100) DEFAULT NULL COMMENT '元素标签类型',
  `status` char(1) NOT NULL COMMENT '状态',
  `mark` varchar(600) DEFAULT NULL COMMENT '说明',
  `createdt` datetime NOT NULL COMMENT '创建时间',
  `updatedt` datetime NOT NULL COMMENT '更新时间',
  `version` varchar(100) DEFAULT NULL COMMENT '版本',
  PRIMARY KEY (`typecd`,`decd`,`en`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='数据集模型结构';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_md_mm002`
--

LOCK TABLES `sys_md_mm002` WRITE;
/*!40000 ALTER TABLE `sys_md_mm002` DISABLE KEYS */;
INSERT INTO `sys_md_mm002` VALUES ('DS.SAAS.QNRECORD','DE.SAAS.BASE001','id','问卷ID','0','0',NULL,2,'text','1',NULL,'2022-03-14 18:00:14','2022-03-14 18:04:49','2022'),('DS.SAAS.QNRECORD','DE.SAAS.BASE001','recordId','记录ID','1','1',NULL,0,'text','1',NULL,'2022-03-14 18:00:45','2022-03-14 18:05:30','2022'),('DS.SAAS.QNRECORD','DE.SAAS.BASE002','answer_name','答卷人姓名','0','0',NULL,7,'text','1',NULL,'2022-03-14 18:03:21','2022-03-14 18:03:21','2022'),('DS.SAAS.QNRECORD','DE.SAAS.BASE002','qn_name','问卷名称','0','0',NULL,3,'text','1',NULL,'2022-03-14 18:01:00','2022-03-14 18:01:00','2022'),('DS.SAAS.QNRECORD','DE.SAAS.BASE003','updateDate','问卷完成时间','0','0',NULL,4,'text','1',NULL,'2022-03-14 18:01:41','2022-03-14 18:01:41','2022'),('DS.SAAS.QNRECORD','DE.SAAS.BASE008','jsondata','JSON数据字符串','0','0',NULL,5,'text','1',NULL,'2022-03-14 18:01:52','2022-03-14 18:01:52','2022'),('DS.SAAS.QNRECORD','DE.SAAS.BASE011','taskId','任务ID','0','1',NULL,1,'text','1',NULL,'2022-03-16 14:57:07','2022-03-16 14:57:07','2022'),('DS.SAAS.QNRECORD','DE.SAAS.BASE011','tentId','租户ID','0','0',NULL,6,'text','1',NULL,'2022-03-14 18:02:18','2022-03-14 18:02:18','2022'),('DS.SAAS.QUESTIONNAIRE','DE.SAAS.BASE001','id','问卷ID','1','1',NULL,0,'text','1',NULL,'2022-03-13 21:04:55','2022-03-13 21:07:48','2022'),('DS.SAAS.QUESTIONNAIRE','DE.SAAS.BASE002','creator','创建人','0','0',NULL,8,'text','1',NULL,'2022-03-13 21:08:39','2022-03-14 17:26:55','2022'),('DS.SAAS.QUESTIONNAIRE','DE.SAAS.BASE002','name','问卷名称','0','1',NULL,1,'text','1',NULL,'2022-03-13 21:05:05','2022-03-13 21:07:40','2022'),('DS.SAAS.QUESTIONNAIRE','DE.SAAS.BASE002','tentName','机构名称','0','0',NULL,4,'text','1',NULL,'2022-03-13 21:07:30','2022-03-13 21:07:30','2022'),('DS.SAAS.QUESTIONNAIRE','DE.SAAS.BASE002','updater','修改人','0','0',NULL,9,'text','1',NULL,'2022-03-13 21:09:05','2022-03-13 21:10:15','2022'),('DS.SAAS.QUESTIONNAIRE','DE.SAAS.BASE003','updateDate','更新时间','0','0',NULL,7,'text','1',NULL,'2022-03-13 21:06:18','2022-03-13 21:06:18','2022'),('DS.SAAS.QUESTIONNAIRE','DE.SAAS.BASE004','createDate','创建时间','0','0',NULL,6,'text','1',NULL,'2022-03-13 21:05:59','2022-03-13 21:05:59','2022'),('DS.SAAS.QUESTIONNAIRE','DE.SAAS.BASE006','status','状态','0','0',NULL,5,'text','1',NULL,'2022-03-13 21:05:48','2022-03-13 21:05:48','2022'),('DS.SAAS.QUESTIONNAIRE','DE.SAAS.BASE009','url','URl','0','1',NULL,2,'text','1',NULL,'2022-03-13 21:05:20','2022-03-13 21:05:20','2022'),('DS.SAAS.QUESTIONNAIRE','DE.SAAS.BASE011','tentId','租户ID','0','1',NULL,3,'text','1',NULL,'2022-03-13 21:07:10','2022-03-14 17:29:10','2022');
/*!40000 ALTER TABLE `sys_md_mm002` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:34:30
