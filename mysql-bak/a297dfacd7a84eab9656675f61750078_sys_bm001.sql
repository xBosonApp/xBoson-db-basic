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
-- Table structure for table `sys_bm001`
--

DROP TABLE IF EXISTS `sys_bm001`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_bm001` (
  `typecd` varchar(100) NOT NULL DEFAULT '' COMMENT '类别编码',
  `parentcd` varchar(200) NOT NULL COMMENT '父类别编码',
  `typenm` varchar(150) NOT NULL COMMENT '类别名称',
  `shortkey` varchar(100) DEFAULT NULL COMMENT '快捷码',
  `standard` char(2) DEFAULT NULL COMMENT '标准',
  `datatable` varchar(100) DEFAULT NULL COMMENT '数据表',
  `url` varchar(100) DEFAULT NULL COMMENT '操作页面',
  `version` varchar(100) DEFAULT NULL COMMENT '版本',
  `status` char(1) NOT NULL COMMENT '状态',
  `mark` varchar(600) DEFAULT NULL COMMENT '说明',
  `createdt` datetime NOT NULL COMMENT '创建时间',
  `updatedt` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`typecd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='主数据类别索引';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_bm001`
--

LOCK TABLES `sys_bm001` WRITE;
/*!40000 ALTER TABLE `sys_bm001` DISABLE KEYS */;
INSERT INTO `sys_bm001` VALUES ('auth.GBT.2260','MDDM.MDM.AUTH','行政区划代码','GBT','02','sys_bm003','bm/bm_mddm01.html',NULL,'1',NULL,'2015-12-04 16:41:18','2015-12-07 09:54:34'),('auth.root.001','MDDM.MDM.AUTH','基础代码','ROOT','02','sys_bm003','bm/bm_mddm01.html',NULL,'1',NULL,'2015-12-04 16:42:15','2015-12-07 09:54:03'),('auth.root.002','MDDM.MDM.AUTH','基础数据','ROOT','02','sys_bm003','bm/bm_mddm01.html',NULL,'1',NULL,'2015-12-07 09:51:09','2015-12-07 09:53:44'),('auth.test','MDDM.MDM.AUTH','测试用','CSY','02','sys_bm003','bm/bm_mddm01.html','1.0','1',NULL,'2015-12-07 09:52:36','2015-12-07 09:52:36'),('auth.zr.0014','MDDM.MDM.AUTH','数据库类型','SJKLX','02','sys_bm003','bm/bm_mddm01.html',NULL,'1',NULL,'2015-12-07 10:31:02','2015-12-07 10:31:02'),('auth.zr.001401','auth.zr.0014','MySql','MYSQL','02','sys_bm003','bm/bm_mddm01.html',NULL,'1',NULL,'2015-12-07 10:32:21','2016-11-18 11:48:28'),('BI','BM.MDDM','数据分析','SJFX','02',NULL,NULL,NULL,'1',NULL,'2015-05-13 15:52:11','2015-05-13 15:54:57'),('BM','0','业务模型','YWMX','01',NULL,NULL,NULL,'1',NULL,'2015-01-26 00:00:00','2015-01-26 00:00:00'),('BM.DMLM','BM','操纵模型','CZMX','01',NULL,NULL,NULL,'1',NULL,'2015-01-26 00:00:00','2015-01-26 00:00:00'),('BM.MDDM','BM','多维模型','DWMX','02',NULL,NULL,NULL,'1',NULL,'2015-01-26 00:00:00','2015-12-03 15:56:23'),('BM.MDDM.WSZHGL','BM.MDDM','卫生综合管理','wszhgl','02',NULL,NULL,'1.0','1',NULL,'2016-12-15 10:41:27','2016-12-15 10:43:19'),('BM.MDDM.WSZHGL.TEST','BM.MDDM.WSZHGL','测试问题','cswt','02','sys_bm003','bm/bm_mddm01.html',NULL,'1',NULL,'2016-12-29 15:05:19','2016-12-29 15:05:19'),('BM.MDDM.WSZHGL.TEST2','BM.MDDM.WSZHGL','测试二','cswt2','02','sys_bm003','bm/bm_mddm01.html',NULL,'1',NULL,'2016-12-29 15:39:23','2016-12-29 15:39:23'),('dy1','dyform','人员','RY','02','sys_bm003','bm/bm_mddm01.html',NULL,'1',NULL,'2015-07-03 11:11:31','2015-08-04 17:24:51'),('dy2','dyform','机构','JG','02','sys_bm003','bm/bm_mddm01.html',NULL,'1',NULL,'2015-07-03 11:11:47','2015-08-04 17:24:56'),('dyform','test','动态表单','DTBD','02',NULL,NULL,NULL,'1',NULL,'2015-07-03 11:10:53','2015-07-03 11:11:04'),('etl_daq','ETL_ESB_BPM','ETL采集点','ETLCJD','02','sys_bm003','bm/bm_mddm01.html',NULL,'1',NULL,'2015-05-14 10:46:29','2015-08-04 17:20:37'),('ETL_ESB_BPM','BM.MDDM','ETL_ESB_BPM','ETLESBBPM','02',NULL,NULL,NULL,'1',NULL,'2015-05-14 10:44:51','2015-05-14 10:44:51'),('LOG','BI','日志','RZ','02',NULL,NULL,NULL,'1',NULL,'2015-05-13 15:52:42','2015-05-13 15:54:51'),('MDDM.MDM.AUTH','BM.MDDM','主数据权限','ZSJQX','02','sys_bm003','bm/bm_mddm01.html',NULL,'1','返回typecd,optype\r\ntypecd以下的节点会显示，optype为0为只读，1为可编辑\r\neg:select \'ddd.001\' typecd, \'1\' optype\r\noptype适用于此节点及以下节点','2015-12-04 09:03:03','2016-11-18 12:16:24'),('ORG','SELCET','机构','JG','02','sys_bm003','bm/bm_mddm01.html',NULL,'1',NULL,'2015-05-13 15:53:57','2015-08-04 17:25:04'),('SELCET','LOG','自定义SELECT2','ZDYSELECT','02',NULL,NULL,NULL,'1',NULL,'2015-05-13 15:53:21','2015-05-13 15:54:45'),('static1','test','静态数据1','JTSJ','02','sys_bm003','bm/bm_mddm01.html',NULL,'1',NULL,'2015-04-10 16:46:00','2015-08-04 17:22:38'),('static2','test','静态数据2','JTSJ','02','sys_bm003','bm/bm_mddm01.html',NULL,'1',NULL,'2015-04-10 16:46:17','2015-08-04 17:22:43'),('static3','test','静态数据3','JTSJ','02','sys_bm003','bm/bm_mddm01.html',NULL,'1',NULL,'2015-04-10 16:46:33','2015-08-04 17:22:47'),('t7','test','散点图','T','02','sys_bm003','bm/bm_mddm01.html',NULL,'1',NULL,'2015-03-30 14:43:39','2015-09-09 14:46:06'),('test','BM.MDDM','视图-多维 演示','STDWYS','02','test',NULL,NULL,'1',NULL,'2015-02-28 17:46:54','2015-05-13 16:05:22'),('tt1','test','点状图','DZT','02','sys_bm003','bm/bm_mddm01.html',NULL,'1',NULL,'2015-09-14 11:04:03','2016-09-19 17:05:47');
/*!40000 ALTER TABLE `sys_bm001` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:34:51
