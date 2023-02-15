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
-- Table structure for table `sys_modules`
--

DROP TABLE IF EXISTS `sys_modules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_modules` (
  `appid` varchar(32) NOT NULL COMMENT '应用ID',
  `moduleid` varchar(50) NOT NULL COMMENT '模块ID',
  `modulenm` varchar(50) DEFAULT NULL COMMENT '模块名称',
  `about` varchar(255) DEFAULT NULL COMMENT '关于模块信息',
  `auflag` char(1) NOT NULL COMMENT '模块类型',
  `status` char(1) NOT NULL COMMENT '状态',
  `createdt` datetime NOT NULL COMMENT '创建时间',
  `updatedt` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`appid`,`moduleid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='APP模块（业务）信息';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_modules`
--

LOCK TABLES `sys_modules` WRITE;
/*!40000 ALTER TABLE `sys_modules` DISABLE KEYS */;
INSERT INTO `sys_modules` VALUES ('0cc27966e1a84a17b38ac6a60af62ae3','gaoxy','高血压','高血压数据服务相关接口','0','1','2018-07-03 15:59:52','2018-07-03 15:59:52'),('19b8f5d7d71a4b22b893fda85ee22431','basic','基础',NULL,'0','1','2018-05-30 19:42:03','2018-07-03 14:29:20'),('25930e7d8c0c47719cccca8fd1f3d6d5','mental','心理',NULL,'0','1','2021-07-11 17:16:36','2021-07-11 17:17:07'),('5da44257329a48b0a4e5f4a5c5855d48','weixin','微信服务',NULL,'0','1','2021-07-18 16:26:40','2021-07-18 16:26:40'),('65368a9f968a4f77a0131adc73bd563a','menzcf','门诊处方','门诊处方','0','1','2018-07-03 16:07:59','2018-07-03 16:07:59'),('7654838a4aae4f2bb2044be671290484','analy','客户分析','Customer Analysis 客户分析','0','1','2021-07-09 11:47:04','2021-07-09 11:47:04'),('7654838a4aae4f2bb2044be671290484','cust','客户管理','Customer management 客户管理','0','1','2021-07-09 11:42:32','2021-07-09 11:42:32'),('7654838a4aae4f2bb2044be671290484','relation','关系管理','Relationship 客户关系管理','0','1','2021-07-09 11:45:08','2021-07-09 11:45:08'),('7654838a4aae4f2bb2044be671290484','vips','会员管理','机构orgid，会员等级ID，会员等级，会员积分，会员权益','0','1','2021-06-27 22:09:39','2021-06-27 22:09:39'),('78cf8922c5ea4afa9dae8970215ea796','dict','主数据管理','tree列表、分类，添加、修改、删除','0','1','2021-06-27 22:08:07','2021-07-09 11:35:04'),('78cf8922c5ea4afa9dae8970215ea796','feedback','意见反馈','对小程序的使用方面的问题反馈和建议','0','1','2021-07-09 11:37:11','2021-07-09 11:37:11'),('78cf8922c5ea4afa9dae8970215ea796','logs','运营日志','租户分析报表、服务分析报表、用户操作日志等','0','1','2021-06-27 22:17:09','2021-06-27 22:17:09'),('78cf8922c5ea4afa9dae8970215ea796','order','订单管理','申请订单、退订订单','0','1','2021-06-27 22:11:22','2021-06-27 22:11:22'),('78cf8922c5ea4afa9dae8970215ea796','product','应用管理','云产品管理：产品目录、产品分类、产品属性、产品审核','0','1','2021-06-27 22:16:30','2021-07-09 11:29:13'),('78cf8922c5ea4afa9dae8970215ea796','tenant','租户管理','租户管理（租户管理、租户成员管理、账单管理）添加、修改、删除，对租户授权等','0','1','2021-06-27 22:03:12','2021-06-27 22:03:12'),('ad46646a8d424128ba3b2d6c353c8e99','bprom','流程管理','Business Process Management 业务流程管理','0','1','2021-07-09 11:50:11','2021-07-09 11:50:11'),('ad46646a8d424128ba3b2d6c353c8e99','eform','表单管理','电子表单管理','0','1','2021-07-09 11:48:20','2021-07-09 11:48:20'),('ad46646a8d424128ba3b2d6c353c8e99','formdata','表单数据','表单数据处理及管理','0','1','2021-08-25 15:08:42','2021-08-25 15:08:42'),('bcf60fb77dcb4a85acbf83d202ec58c0','bosoncoin','波子币(仅用于展示)',NULL,'0','1','2018-12-12 11:01:25','2018-12-12 11:10:53'),('cd71e14e92874fe1b766c675d90d5cf4','apidemo','平台api演示',NULL,'0','1','2018-12-08 10:33:42','2018-12-08 10:33:42'),('cd71e14e92874fe1b766c675d90d5cf4','info','资讯管理(演示)',NULL,'0','1','2018-12-12 11:05:39','2018-12-12 11:08:24'),('f1b4adf82ee54a1c8e18d31349988a4b','message','消息发送',NULL,'0','1','2021-08-05 19:23:40','2021-08-05 19:24:07'),('f1b4adf82ee54a1c8e18d31349988a4b','questionnaire','问卷管理',NULL,'0','1','2022-02-27 19:04:32','2022-02-27 19:04:32'),('f1b4adf82ee54a1c8e18d31349988a4b','sched','日程管理','Schedule management','0','1','2021-07-09 11:52:45','2021-07-09 11:52:45'),('f1b4adf82ee54a1c8e18d31349988a4b','task','待办任务','to-do task','0','1','2021-07-09 11:54:02','2021-07-09 11:54:02');
/*!40000 ALTER TABLE `sys_modules` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:34:35
