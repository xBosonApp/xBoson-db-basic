/**
 *  Copyright 2023 Jing Yanming
 * 
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
"use strict";
//1 表单填写,整个填写json数据存入 mongodb；
//2 字段值存入:DATA_CRFID
//3 记录修改日志:data_CRFID_LOG
//4 根据维护规则产生质疑;
var cfg=require("config");
var config = cfg.get("全院配置");
var sydbId=config.sydbId;

sql.connection(config.sydbId);// 
//校验token-------------------------------------------
function CheckToken()
{
   var  EncryptedStr=config.EncryptedStr;//加密字符串;
   var  date=sys.currentTimeString().substr(0,10);
   var  headers= JSON.parse(JSON.stringify( http.headers()));
   var  token=(headers.token);//前端传递过来的Token;
   if(sys.md5(EncryptedStr+date)==token)
   {
     return true;
   }
   else
   {
      return false;
   }
}
if(CheckToken()==false)
{
    sys.setRetData(1101,'无API访问权限!');
    return;
}
//-----------------------------------------------
//移动端表单保存提交需要传次参数;DATACRFID
var TAG           =sys.requestJson.TAG;// 1 表示移动端保存
var DATACRFID     = sys.requestJson.DATACRFID;//数据存储的CRFID
var CRFID         = sys.requestJson.CRFID;//CRFID
var RESEARCHID    = sys.requestJson.RESEARCHID;//科研ID
var TESTID        = sys.requestJson.TESTID;//受试者ID
//var JOSNFORMAT    = sys.requestJson.JOSNFORMAT;//整个jons
var PROCESSID     = sys.requestJson.PROCESSID;//节点ID
var PROCESSNAME   = sys.requestJson.PROCESSNAME;//节点名称; ??
var CRFNAME       = sys.requestJson.CRFNAME;//CRF名称
var TESTFillJson  = sys.requestJson.TESTFillJson;//受试者填写数据JSON
var INPUTID       = sys.requestJson.INPUTID;//填表人ID
var INPUTNAME     = sys.requestJson.INPUTNAME;//填表人姓名

if(CRFID == null)
{
  sys.setRetData(1,'CRFID:为空');
  return;
}

if(INPUTID == null)
{
  sys.setRetData(1,'INPUTID:为空');
  return;
}

if(INPUTNAME == null)
{
  sys.setRetData(1,'INPUTNAME:为空');
  return;
}

if(PROCESSNAME == null)
{
  sys.setRetData(1,'PROCESSNAME:为空');
  return;
}

if(RESEARCHID == null)
{
  sys.setRetData(1,'RESEARCHID:为空');
  return;
}

if(TESTID == null)
{
  sys.setRetData(1,'TESTID:为空');
  return;
}

if(PROCESSID == null)
{
  sys.setRetData(1,'PROCESSID:为空');
  return;
}

if(CRFNAME == null)
{
  sys.setRetData(1,'CRFNAME:为空');
  return;
}

if(TESTFillJson == null)
{
  sys.setRetData(1,'TESTFillJson:为空');
  return;
}


// 移动端表单保存l;数据存储在 DATACRFID 对应的DATA表;
if(TAG!=null && TAG=='1')
{
   if(DATACRFID==null)
   {
       sys.setRetData(1,'DATACRFID:为空');
      return;
   }
   CRFID=DATACRFID;//****
}
//================================================
//查找字符串中某个特殊字符的个数
function getStrCount(scrstr,armstr) { //scrstr 源字符串 armstr 特殊字符
     var count=0;
     while(scrstr.indexOf(armstr) != -1 ) {
        scrstr = scrstr.replace(armstr,"")
        count++;    
     }
     return count;
}

    //------表单保存的判断条件---------------------------
    //0：未填报 1：保存 2：提交 3：审核
    var sqls=" select STATUS from data_testprocess "+
             "   where  testid=? and researchid=?"+
             "   and processid=? and crfid=? ";
      paramIns=[];//
    
      list.add(paramIns,TESTID);
      list.add(paramIns,RESEARCHID);
      list.add(paramIns,PROCESSID);
      list.add(paramIns,CRFID);

   sql.query(sqls,paramIns,"dataProcess");
   var dataProcess=sys.result.dataProcess;
   
   var status='';
   status=dataProcess[0].STATUS;
   
  if(status=="2")
  {
        sys.setRetData(1,'该表单已经提交,不能保存 !');
        return;
  }
   
  if(status=="3")
  {
        sys.setRetData(1,'该表单已经审核,不能保存 !');
        return;
  }
   
  //========================================================
  var ORGID='';//所属分中心ID
  var DOCTOR='';//受试者所属医生ID
  var TESTNO='';//受试者编号
  var RECRUITDATE='';//受试者招募日期
  var sqls="select ORGID,DOCTOR,TESTNO,"+
  " to_char(RECRUITDATE,'yyyy-mm-dd')RECRUITDATE from "+
  " sys_testper where researchid=? and testid=? ";
 var   paramIns=[]; 
 list.add(paramIns,RESEARCHID);
 list.add(paramIns,TESTID);
 sql.query(sqls,paramIns,"dataTest"); 
 var dataTest=sys.result.dataTest;
 
 if(dataTest.length==0)
 {
    sys.setRetData(1,'未找到受试者数据:受试者ID:'+TESTID);
    return;
 }
  ORGID= dataTest[0].ORGID;
  DOCTOR=dataTest[0].DOCTOR;
  TESTNO=dataTest[0].TESTNO;
  RECRUITDATE=dataTest[0].RECRUITDATE;
  
//检查表单填写日期是否合法!
//RECRUITDATE 招募日期,PROCESSID:节点ID;
//检查表单填写日期是否合法!
//RECRUITDATE 招募日期,PROCESSID:节点ID;
function CheckFillDate(RECRUITDATE,PROCESSID)
{
    var PROCESSNAME='';//节点名称
    var FOLLOWUP='-1';//随访周期
    var FOLLOWUPUNIT='-1';//随访周期单位;
    var CHANGEFOLLOWUP='-1';//浮动周期
    var CHANGEFOLLOWUPUNIT='-1';//浮动周期单位;
    var ChangeDays=1;// 将浮动周期全部转换为 天 进行计算;
    var FOLLOWUPDays=0;//计算多少天后随访
     // 周期单位:bzcode 1-小时;2 日 ;3 周 4 月;
    var paramIns=[];
    var sqlIns="";
    sqlIns="select PROCESSNAME,"+
    "FOLLOWUP,FOLLOWUPUNIT, "+
    "CHANGEFOLLOWUP,CHANGEFOLLOWUPUNIT "+
    "from crf_process a "+
    "where a.researchid=?  and processid=? ";
    list.add(paramIns,RESEARCHID);
    list.add(paramIns,PROCESSID);
    sql.query(sqlIns,paramIns,"dataProcessInfo"); 
    var dataProcessInfo=sys.result.dataProcessInfo;
    if(dataProcessInfo.length==0)
    {
        sys.setRetData(1,'节点ID:'+PROCESSID +'未找到节点信息!');
        return;
    }
     PROCESSNAME=dataProcessInfo[0].PROCESSNAME;//
     FOLLOWUP=parseInt(dataProcessInfo[0].FOLLOWUP);
     FOLLOWUPUNIT=dataProcessInfo[0].FOLLOWUPUNIT;
     CHANGEFOLLOWUP=parseInt(dataProcessInfo[0].CHANGEFOLLOWUP);
     CHANGEFOLLOWUPUNIT=dataProcessInfo[0].CHANGEFOLLOWUPUNIT;
     //结算表单可以填写的开始日期

     if(CHANGEFOLLOWUPUNIT=='1')
     {
       ChangeDays=CHANGEFOLLOWUP/24;//小时
     }
     else if (CHANGEFOLLOWUPUNIT=='2')
     {
       ChangeDays=CHANGEFOLLOWUP;//日
     }
     else if (CHANGEFOLLOWUPUNIT=='3')
     {
       ChangeDays=CHANGEFOLLOWUP *7;//周
     }
     else if (CHANGEFOLLOWUPUNIT=='4')
     {
       ChangeDays=CHANGEFOLLOWUP *30;//月
     }
     
     if(FOLLOWUPUNIT=='1')
     {
       FOLLOWUPDays=FOLLOWUP/24;//小时
     }
     else if (FOLLOWUPUNIT=='2')
     {
       FOLLOWUPDays=FOLLOWUP;//日
     }
     else if (FOLLOWUPUNIT=='3')
     {
       FOLLOWUPDays=FOLLOWUP *7;//周
     }
     else if (FOLLOWUPUNIT=='4')
     {
       FOLLOWUPDays=FOLLOWUP *30;//月
     }

      var paramIns=[];
      var sqlIns="select to_char(sysdate,'yyyy-mm-dd')TODAY,"+
        "to_char(to_date(?,'yyyy-mm-dd')+?-?,'yyyy-mm-dd') BDATE,"+
        "to_char(to_date(?,'yyyy-mm-dd')+?+?,'yyyy-mm-dd') EDATE  "+
        "from dual";
    list.add(paramIns,RECRUITDATE);
    list.add(paramIns,FOLLOWUPDays);
    list.add(paramIns,ChangeDays);
    list.add(paramIns,RECRUITDATE);
    list.add(paramIns,FOLLOWUPDays);
    list.add(paramIns,ChangeDays);
    
    sql.query(sqlIns,paramIns,"dataDate"); 
    var dataDate=sys.result.dataDate;
    sys.printValue(dataDate);
    var TODAY=dataDate[0].TODAY;
    var BDATE=dataDate[0].BDATE;
    var EDATE=dataDate[0].EDATE;
    var TODAYD = new Date(TODAY);
    var BDATED = new Date(BDATE);
    var EDATED = new Date(EDATE);
    return dataDate;
    
    if(TODAYD.getTime()<BDATED.getTime())
    {
       //sys.setRetData(1,'【'+PROCESSNAME+'】还未到表单填写开始日期:'+BDATE);
       sys.setRetData(8,'还未到表单填写开始日期:');
       return; 
    }
    
    if(TODAYD.getTime()>EDATED.getTime())
    {
     sys.setRetData(1,'【'+PROCESSNAME+'】 已经超过到表单填写结束日期:'+EDATE);
       return; 
    }
}
 //========================================================
 //-----将整个表单数据存入mongodb开始----------------------
 try
 {
  var mongodb = require('mongodb');
  var conntion= config.mongdbConnection;
  var client = mongodb.connect(conntion);
  var db = client.db('SYDb');//数据库;
  var TEST_CRF_INFO = db.collection("TEST_CRF_INFO");
  //----------------------------------------------------
 }
 catch(e)
{
    sys.setRetData(1,'连接:mongodb 失败!' +e);
    return;
}
   //-----将整个表单数据存入mongodb结束------------
   //==============================================
     var sqls=" select FIELDNAME,CONTROLTYPE,FIELDID from crf_detail "+
              " where researchid=? and CRFID=? ";
     var paramIns=[];
     list.add(paramIns,RESEARCHID);
     list.add(paramIns,CRFID);
     sql.query(sqls,paramIns,"CRFDetail");
     var CRFDetail=sys.result.CRFDetail;
 
   //根据 FIELDID 获取该字段ID所对应的 crf_detail 信息;
  function GetFieldInfo(FIELDID)
  {
     var FieldInfo=[];
    for(var i=0;i<CRFDetail.length;i++)
    {
      if(CRFDetail[i].FIELDID==FIELDID)
      {   
          FieldInfo=CRFDetail[i];
          break;
      }
    }
     return FieldInfo;
  }
   //==处理子表单开始(特殊处理[SERIALNO]:从0开始;
  function DealTable(tableFillJson)
  {
     var FieldIdArr=[];
     for(var i=0;i<tableFillJson.length;i++)
      {
         var TESTFillJson=tableFillJson[i];
         for(var KEY in TESTFillJson)
          {
            if(FieldIdArr.indexOf(KEY)==-1)
            {
              FieldIdArr.push(KEY);
            }
          }
      }
     ///------------------------------------------
     for(var i=0;i<FieldIdArr.length;i++)
     {
        var sqls='';
        var paramIns=[];
        sqls= "delete from DATA_"+CRFID+" "+
      " where RESEARCHID=? and CRFID=?"+
      " and TESTID=?"+
      " and FIELDID=? "+
      " and PROCESSID=? ";
       list.add(paramIns,RESEARCHID);
       list.add(paramIns,CRFID);
       list.add(paramIns,TESTID);
       list.add(paramIns,FieldIdArr[i]);//FIELDID
       list.add(paramIns,PROCESSID);
       sql.update(sqls,paramIns,"1");
     }
    ///------------------------------------------
    //子表单： SERIALNO 从0开始;
     for(var i=0;i<tableFillJson.length;i++)
     {
       var TESTFillJson=tableFillJson[i];
       for(var KEY in TESTFillJson)
       {
          var   FIELDID=KEY;
          var   CONTROLTYPE='';//控件类型
          var   FIELDNAME='';
          var   SERIALNO=i;//子表单的序号; ****************
          var   fieldinfo=GetFieldInfo(FIELDID);
        if(fieldinfo.length==0)
        {
           sql.rollback();
           sys.setRetData(1,'字段ID:'+KEY +' 不存在!');
           return;
        }
       else
        {
          FIELDNAME=fieldinfo.FIELDNAME;
          CONTROLTYPE=fieldinfo.CONTROLTYPE;
        }
      //---------------------------------
      var VALUE='';//
      var SCORE='';//
      var REMARK='';//其他
      var UNIT='';//单位
      var FIELDVALUE='';//字段值;
     
     switch (CONTROLTYPE) 
     {
      case 'select'://下拉
        var item =TESTFillJson[KEY];
            FIELDVALUE=item.value;
            SCORE=item.score;
            REMARK=item.remark;
        break;
      case 'radio'://单选
        var item =TESTFillJson[KEY];
            FIELDVALUE=item.value;
            SCORE=item.score;
            REMARK=item.remark;
        break;
       case 'checkbox'://多选
        var  item =TESTFillJson[KEY];
             FIELDVALUE=item.value.join('|');//医竖线分隔;
             SCORE=item.score;
             var remarks=JSON.stringify(item.remark);
             REMARK=remarks=='{}' ? '' :remarks;
      break;
       case 'units'://单位
         var item =TESTFillJson[KEY];
            FIELDVALUE=item.value;
            UNIT=item.unit;
        break;
      default:
           FIELDVALUE=TESTFillJson[KEY];
        break;   
      }
      
        sqls=" insert into DATA_"+CRFID+" ("+
        "RESEARCHID,CRFID,TESTID,SERIALNO, FIELDID,"+
        "PROCESSID,CRFNAME,FIELDNAME,FIELDVALUE,"+
        "SCORE,REMARK,UNIT,CONTROLTYPE,TESTNO"+
        ") values( ?,?,?,?,?,?,?,?,?,?,?,?,?,?) ";
        
        paramIns=[]; 
        list.add(paramIns,RESEARCHID);
        list.add(paramIns,CRFID);
        list.add(paramIns,TESTID);
        list.add(paramIns,SERIALNO);//SERIALNO
        list.add(paramIns,FIELDID);//FIELDID
        list.add(paramIns,PROCESSID);//
        list.add(paramIns,CRFNAME);//
        list.add(paramIns,FIELDNAME); //
        if(CONTROLTYPE=='imgupload')//图片上传 base64存储在mongeb里面 
        { 
          list.add(paramIns,'图片');
        }
        else
        {
         list.add(paramIns,FIELDVALUE);//
        }
        list.add(paramIns,SCORE);//
        list.add(paramIns,REMARK);//
        list.add(paramIns,UNIT);//
        list.add(paramIns,CONTROLTYPE);//
        list.add(paramIns,TESTNO);//
        sql.update(sqls,paramIns,"1");
      //=============================================
      //---------------------------------------------
       if(CONTROLTYPE=='imgupload')
       { 
          
           var sqls="delete from test_pic "+
           "where PROCESSID=? and  RESEARCHID=? "+
           " and CRFID=?  and TESTID=? "+
           " and FIELDID=?";
          var    paramIns=[];//
          list.add(paramIns,PROCESSID);//
          list.add(paramIns,RESEARCHID);
          list.add(paramIns,CRFID);
          list.add(paramIns,TESTID);
          list.add(paramIns,FIELDID);
  
          sql.update(sqls,paramIns,"1");
          var arrPic=TESTFillJson[KEY];
          for(var index in arrPic)
          {
          var sqls="insert into test_pic(processid,"+
                       "researchid,"+
                       "crfid,"+
                       "testid,"+
                       "crfname,"+
                       "fieldid,"+
                       "fieldname,"+
                       "key,"+
                       "url,"+
                       "createuserid,"+
                       "createtime)"+
        "values(?,?,?,?,?,?,?,?,?,?,sysdate)";
        
          var    paramIns=[];//
          list.add(paramIns,PROCESSID);//
          list.add(paramIns,RESEARCHID);
          list.add(paramIns,CRFID);
          list.add(paramIns,TESTID);
          list.add(paramIns,CRFNAME);
          list.add(paramIns,FIELDID);
          list.add(paramIns,FIELDNAME);
          
          list.add(paramIns,arrPic[index].key);
          list.add(paramIns,arrPic[index].url);
          list.add(paramIns,INPUTID);
          
          sql.update(sqls,paramIns,"1");
  
          }

       }
      //-------------------------------------------------------
      
      //======修改日志记录表=========================
        var sqls="insert into data_"+CRFID+"_LOG(logid,"+
                            "    testid,"+
                            "    testno,"+
                            "    researchid,"+
                            "    serialno,"+
                            
                            "    crfid,"+
                            "    fieldid,"+
                            "    processid,"+
                            "    processname,"+
                            "    crfname,"+
                            
                            "    fieldname,"+
                            "    fieldvalueoriginal,"+
                            "    fieldvaluemodify,"+
                            "    controltype,"+
                            "    score,"+
                            
                            "    remark,"+
                            "    unit,"+
                            "    inputid,"+
                            "    inputname,"+
                            "    inputtime,"+
                         
                            "    status,"+
                            "    memo,"+
                            "    orgid,"+
                            "    doctor)"+
" values(logid.nextval,?,?,?,?,  ?,?,?,?,?,"+
" ?,?,?,?,?,  ?,?,?,?,sysdate,  ?,?,?,?) ";
  var    paramIns=[];//
  list.add(paramIns,TESTID);
  list.add(paramIns,TESTNO);
  list.add(paramIns,RESEARCHID);
  list.add(paramIns,SERIALNO);

  list.add(paramIns,CRFID);
  list.add(paramIns,FIELDID);
  list.add(paramIns,PROCESSID);
  list.add(paramIns,PROCESSNAME);//节点名称
  list.add(paramIns,CRFNAME);
  
  list.add(paramIns,FIELDNAME);
   if(CONTROLTYPE=='imgupload')//图片上传 base64存储在mongeb里面 
   { 
      list.add(paramIns,'图片');
   }
   else
   {
    list.add(paramIns,JSON.stringify(TESTFillJson[KEY]));//
   }
  var FIELDVALUEMODIFY='';//修改值
  list.add(paramIns,FIELDVALUEMODIFY);
  list.add(paramIns,CONTROLTYPE);
  list.add(paramIns,SCORE);
  
  list.add(paramIns,REMARK);//remark
  list.add(paramIns,UNIT);
  list.add(paramIns,INPUTID);//填表人ID
  list.add(paramIns,INPUTNAME);//填表人

  list.add(paramIns,'0');//
  list.add(paramIns,'表单填写');//memo 
  list.add(paramIns,ORGID);
  list.add(paramIns,DOCTOR);
  sql.update(sqls,paramIns,"1");
  //======修改日志记录表结束=========================
     }
    }
  }
  //=======处理子表单结束============================
  
  //根据 crf_detail,将 不显示的内容也插入 data表,并且做标记--END
  function DealDisplay()
  {
    
     //根据 crf_detail,将 不显示的内容也插入 data表,并且做标记--BEGIN
     var sqls=" select * from crf_detail "+
             " where RESEARCHID=? and CRFID=? and "+
             " CVS=1 ";//
      paramIns=[];//
      list.add(paramIns,RESEARCHID);
      list.add(paramIns,CRFID);
      
      sql.query(sqls,paramIns,"CRFDATA"); 
      var CRFDATA=sys.result.CRFDATA;
      
      for(var i=0;i<CRFDATA.length;i++)
      {
        paramIns=[];
        var sqls="declare "+
         " v_cnt number;"+
         " begin "+
         " select count(*) into v_cnt from data_"+CRFID+" "+
         " where RESEARCHID=? and  TESTID=?  "+
         " and CRFID=? "+
         " and PROCESSID=? and FIELDID=? ;"+
         " if v_cnt = 0 then "+
         " insert into DATA_"+CRFID+" ("+
         " RESEARCHID,CRFID,TESTID,SERIALNO, FIELDID,"+
         " PROCESSID,CRFNAME,FIELDNAME,FIELDVALUE,"+
         " SCORE,REMARK,UNIT,CONTROLTYPE,TESTNO,DISPLAY"+
         ") values( ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?); "+
         " end if;"+
         " end;";
         
        list.add(paramIns,RESEARCHID);
        list.add(paramIns,TESTID);
        list.add(paramIns,CRFDATA[i].CRFID);
        list.add(paramIns,PROCESSID);
        list.add(paramIns,CRFDATA[i].FIELDID);
        
        list.add(paramIns,RESEARCHID);
        list.add(paramIns,CRFID);
        list.add(paramIns,TESTID);
        list.add(paramIns,'-1');//SERIALNO
        list.add(paramIns,CRFDATA[i].FIELDID);//FIELDID
        list.add(paramIns,PROCESSID);//
        list.add(paramIns,CRFNAME);//
        list.add(paramIns,CRFDATA[i].FIELDNAME); //
        if(CRFDATA[i].CONTROLTYPE=='imgupload')//
        { 
          list.add(paramIns,'不显示');
        }
        else
        {
          list.add(paramIns,'不显示');//
        }
        list.add(paramIns,'');//SCORE
        list.add(paramIns,REMARK);//
        list.add(paramIns,'');//UNIT
        list.add(paramIns,CRFDATA[i].CONTROLTYPE);//
        list.add(paramIns,TESTNO);//
        list.add(paramIns,'0');//DISPLAY
        
        sql.update(sqls,paramIns,"1");
      }
  }
  
  //========产生系统质疑========================
  function DealInspect(dataIns,INSPECTID,INSPECTTIP,INSPECTTYPE)
  {
    for(var i=0;i<dataIns.length;i++)
    {
      //判断是否重复; 如果有了就不需要插入;
      var sqls='';
      var paramIns=[];
      sqls= "select * from data_question_"+RESEARCHID+" "+
      " where RESEARCHID=? and CRFID=? "+
      " and TESTID=?    "+
      " and FIELDID=?   "+
      " and PROCESSID=? "+
      " and INSPECTID=? and status=0 ";
      list.add(paramIns,RESEARCHID);
      list.add(paramIns,CRFID);
      list.add(paramIns,TESTID);
      list.add(paramIns,dataIns[i].FIELDID);//FIELDID
      list.add(paramIns,PROCESSID);
      list.add(paramIns,INSPECTID);
      sql.query(sqls,paramIns,"DATA_QUES"); 
      var DATA_QUES=sys.result.DATA_QUES;

      //不存在的时候; 直接插入; 存在直接更新;
      if(sys.size(sys.result.DATA_QUES) == 0)
      {
        var sqls="insert into data_question_"+RESEARCHID+"(QUESID,"+
                            "    testid,"+
                            "    testno,"+
                            "    researchid,"+
                            "    serialno,"+
                            
                            "    crfid,"+
                            "    fieldid,"+
                            "    processid,"+
                            "    processname,"+
                            "    crfname,"+
                            
                            "    fieldname,"+
                            "    fieldvalueoriginal,"+
                            "    fieldvaluemodify,"+
                            "    controltype,"+
                            "    score,"+
                            
                            "    remark,"+
                            "    unit,"+
                            "    questionid,"+
                            "    questionname,"+
                            "    questiontime,"+
                            
                            "    inputid,"+
                            "    inputname,"+
                            "    inputtime,"+
                            "    questionreason,"+
                            "    status,"+
                            
                            "    questiontype,"+
                            "    memo,"+
                            "    orgid,"+
                            "    doctor,INSPECTID)"+
	" values(questionid.nextval,?,?,?,?,  ?,?,?,?,?,"+
	" ?,?,?,?,?,  ?,?,?,?,sysdate, "+
	" ?,?,sysdate,?,?,  ?,?,?,? ,?) ";

  var    paramIns=[];//
  //list.add(paramIns,LOGID);
  list.add(paramIns,TESTID);
  list.add(paramIns,TESTNO);
  list.add(paramIns,RESEARCHID);
  var SERIALNO=-1;
  list.add(paramIns,SERIALNO);
  
  list.add(paramIns,CRFID);
  list.add(paramIns,dataIns[i].FIELDID);
  list.add(paramIns,PROCESSID);
  list.add(paramIns,PROCESSNAME);
  list.add(paramIns,CRFNAME);
  
  list.add(paramIns,dataIns[i].FIELDNAME);//dataIns[i].FIELDNAME ??
  list.add(paramIns,dataIns[i].FIELDVALUE);//FIELDVALUEORIGINAL ??
  var FIELDVALUEMODIFY='';//修改值
  list.add(paramIns,FIELDVALUEMODIFY);
  var CONTROLTYPE=''//控件类型
  list.add(paramIns,CONTROLTYPE);
  var SCORE='';//
  list.add(paramIns,SCORE);
  
  list.add(paramIns,'');//remark
  var UNIT='';
  list.add(paramIns,UNIT);
  list.add(paramIns,'系统质疑');//questionid   质疑人ID;
  list.add(paramIns,'系统质疑');//questionname 质疑人姓名;
  
  
  list.add(paramIns,INPUTID);//填表人ID
  list.add(paramIns,INPUTNAME);//填表人
  //list.add(paramIns,INPUTTIME);//填表时间 
  list.add(paramIns,INSPECTTIP);//质疑原因
  list.add(paramIns,'0');
  
  list.add(paramIns,INSPECTTYPE);
  list.add(paramIns,'系统质疑');//memo 
  list.add(paramIns,ORGID);
  list.add(paramIns,DOCTOR);
  list.add(paramIns,INSPECTID);
  sql.update(sqls,paramIns,"1");
  
  
     var sqls="  update  data_testprocess set QUESTION=1 "+
             ",QUESTIONID=?,QUESTIONTIME=sysdate "+
             "   where  testid=? and researchid=? "+
             "  and processid=? and crfid=?  ";
      paramIns=[];//
     
      list.add(paramIns,INPUTID);
      list.add(paramIns,TESTID);
      list.add(paramIns,RESEARCHID);
      list.add(paramIns,PROCESSID);
      list.add(paramIns,CRFID);
     sql.update(sqls,paramIns,"1");

    }
   }
  }
 //========处理系统质疑结束========================
 
try{
      //=============先全部删除!============================
       var sqls='';
       var paramIns=[];
        sqls= "delete from DATA_"+CRFID+" "+
      " where RESEARCHID=? and CRFID=?"+
      " and TESTID=?"+
      " and PROCESSID=? ";
       list.add(paramIns,RESEARCHID);
       list.add(paramIns,CRFID);
       list.add(paramIns,TESTID);
       list.add(paramIns,PROCESSID);
       sql.update(sqls,paramIns,"1");
       //================================================
   var REMARK='';
   //处理表单提交过来的数据;
   for(var KEY in TESTFillJson)
   {
      var  FIELDID=KEY;
      var   CONTROLTYPE='';//控件类型
      var   FIELDNAME='';
      var   SERIALNO=-1;//非子表单 统一为:-1;
      
      //===============================================
      // select,radio,checkbox,units 比较特殊
      //下拉: select :{?value:'',score:0,remark:''}//备注
      //单选: radio :{?value:'',score:0,remark:''}//备注
      //多选: checkbox ： {?value:[ "1", "2"],score:33,remark:{ "1": "22", "2": "44"}
      //单位:units  { "value": "333", "unit": "Option 1"}
      //=============================================
      //获取对应的字端信息----------------
      var fieldinfo=GetFieldInfo(FIELDID);
      if(fieldinfo.length==0)
      {
        sql.rollback();
        sys.setRetData(1,'字段ID:'+KEY +' 不存在!');
        return;
      }
      else
      {
        FIELDNAME=fieldinfo.FIELDNAME;
        CONTROLTYPE=fieldinfo.CONTROLTYPE;
      }
      //---------------------------------
      var VALUE='';//
      var SCORE='';//
      var REMARK='';//其他
      var UNIT='';//单位
      var FIELDVALUE='';//字段值;
      
     switch (CONTROLTYPE) 
     {
      case 'select'://下拉
        var item =TESTFillJson[KEY];
            FIELDVALUE=item.value;
            SCORE=item.score;
            REMARK=item.remark;
        break;
      case 'radio'://单选
        var item =TESTFillJson[KEY];
            FIELDVALUE=item.value;
            SCORE=item.score;
            REMARK=item.remark;
        break;
       case 'checkbox'://多选
        var  item =TESTFillJson[KEY];
             FIELDVALUE=item.value.join('|');//医竖线分隔;
             SCORE=item.score;
             var remarks=JSON.stringify(item.remark);
             REMARK=remarks=='{}' ? '' :remarks;
      break;
       case 'units'://单位
         var item =TESTFillJson[KEY];
            FIELDVALUE=item.value;
            UNIT=item.unit;
        break;
        
      default:
           FIELDVALUE=TESTFillJson[KEY];
        break;   
     }
     
      //子表单特殊处理;
      if(CONTROLTYPE=='table')
      {
        DealTable(TESTFillJson[KEY],KEY);
        continue;
      }
      var sqls='';
      var paramIns=[];
      
      sqls= "select * from DATA_"+CRFID+" "+
      " where RESEARCHID=? and CRFID=?"+
      " and TESTID=?"+
      " and SERIALNO=? "+
      " and FIELDID=? "+
      " and PROCESSID=? ";
      list.add(paramIns,RESEARCHID);
      list.add(paramIns,CRFID);
      list.add(paramIns,TESTID);
      list.add(paramIns,SERIALNO);//SERIALNO
      list.add(paramIns,FIELDID);//FIELDID
      list.add(paramIns,PROCESSID);
      
      sql.query(sqls,paramIns,"DATA_CRFINFO"); 
      var DATA_CRFINFO=sys.result.DATA_CRFINFO;

      //不存在的时候; 直接插入; 存在直接更新;
      if(sys.size(sys.result.DATA_CRFINFO) == 0)
      {
        sqls=" insert into DATA_"+CRFID+" ("+
        "RESEARCHID,CRFID,TESTID,SERIALNO, FIELDID,"+
        "PROCESSID,CRFNAME,FIELDNAME,FIELDVALUE,"+
        "SCORE,REMARK,UNIT,CONTROLTYPE,TESTNO"+
        ") values( ?,?,?,?,?,?,?,?,?,?,?,?,?,?) ";
        
        paramIns=[]; 
        list.add(paramIns,RESEARCHID);
        list.add(paramIns,CRFID);
        list.add(paramIns,TESTID);
        list.add(paramIns,SERIALNO);//SERIALNO
        list.add(paramIns,FIELDID);//FIELDID
        list.add(paramIns,PROCESSID);//
        list.add(paramIns,CRFNAME);//
        list.add(paramIns,FIELDNAME); //
        if(CONTROLTYPE=='imgupload')//图片上传 base64存储在mongeb里面 
        { 
          list.add(paramIns,'图片');
        }
        else
        {
          list.add(paramIns,FIELDVALUE);//
        }
        list.add(paramIns,SCORE);//
        list.add(paramIns,REMARK);//
        list.add(paramIns,UNIT);//
        list.add(paramIns,CONTROLTYPE);//
        list.add(paramIns,TESTNO);//
        sql.update(sqls,paramIns,"1");
        
      }
      else
      {
        sqls=" update DATA_"+CRFID+" "+
        " set FIELDVALUE=?, "+
        "  SCORE=?,REMARK=?,UNIT=? "+
         " where " +
        "  RESEARCHID=? " +
        " AND CRFID=? " +
        " AND TESTID=? " +
        " AND SERIALNO=? " +
        " AND PROCESSID=? " +
        " AND FIELDID=? ";
         paramIns=[];
         if(CONTROLTYPE=='imgupload')//图片上传 base64存储在mongeb里面 
        { 
          list.add(paramIns,'图片');
        }
        else
        {
          list.add(paramIns,FIELDVALUE);//
        }
        list.add(paramIns,SCORE);//
        list.add(paramIns,REMARK);//
        list.add(paramIns,UNIT);//
        list.add(paramIns,RESEARCHID);//
        list.add(paramIns,CRFID);//
        list.add(paramIns,TESTID);//
        list.add(paramIns,SERIALNO);//
        list.add(paramIns,PROCESSID);//
        list.add(paramIns,FIELDID);//
        sql.update(sqls,paramIns,"1");
        //REMARK='修改表单'
     }
     //-------------------------------------------------------
       if(CONTROLTYPE=='imgupload')
        { 
          var sqls="delete from test_pic "+
         "where PROCESSID=? and  RESEARCHID=? "+
         " and CRFID=?  and TESTID=? "+
         " and FIELDID=?";
        var    paramIns=[];//
        list.add(paramIns,PROCESSID);//
        list.add(paramIns,RESEARCHID);
        list.add(paramIns,CRFID);
        list.add(paramIns,TESTID);
        list.add(paramIns,FIELDID);

        sql.update(sqls,paramIns,"1");
         var arrPic=TESTFillJson[KEY];
         for(var index in arrPic)
         {
        var sqls="insert into test_pic(processid,"+
                     "researchid,"+
                     "crfid,"+
                     "testid,"+
                     "crfname,"+
                     "fieldid,"+
                     "fieldname,"+
                     "key,"+
                     "url,"+
                     "createuserid,"+
                     "createtime)"+
      "values(?,?,?,?,?,?,?,?,?,?,sysdate)";
      
        var    paramIns=[];//
        list.add(paramIns,PROCESSID);//
        list.add(paramIns,RESEARCHID);
        list.add(paramIns,CRFID);
        list.add(paramIns,TESTID);
        list.add(paramIns,CRFNAME);
        list.add(paramIns,FIELDID);
        list.add(paramIns,FIELDNAME);
        
        list.add(paramIns,arrPic[index].key);
        list.add(paramIns,arrPic[index].url);
        list.add(paramIns,INPUTID);
        
        sql.update(sqls,paramIns,"1");

         }
       }
      //-------------------------------------------------------

      //======修改日志记录表=========================
        var sqls="insert into data_"+CRFID+"_LOG(logid,"+
                            "    testid,"+
                            "    testno,"+
                            "    researchid,"+
                            "    serialno,"+
                            
                            "    crfid,"+
                            "    fieldid,"+
                            "    processid,"+
                            "    processname,"+
                            "    crfname,"+
                            
                            "    fieldname,"+
                            "    fieldvalueoriginal,"+
                            "    fieldvaluemodify,"+
                            "    controltype,"+
                            "    score,"+
                            
                            "    remark,"+
                            "    unit,"+
                            "    inputid,"+
                            "    inputname,"+
                            "    inputtime,"+
                         
                            "    status,"+
                            "    memo,"+
                            "    orgid,"+
                            "    doctor)"+
" values(logid.nextval,?,?,?,?,  ?,?,?,?,?,"+
" ?,?,?,?,?,  ?,?,?,?,sysdate,  ?,?,?,?) ";

  var    paramIns=[];//
  list.add(paramIns,TESTID);
  list.add(paramIns,TESTNO);
  list.add(paramIns,RESEARCHID);
  list.add(paramIns,SERIALNO);

  list.add(paramIns,CRFID);
  list.add(paramIns,FIELDID);
  list.add(paramIns,PROCESSID);
  list.add(paramIns,PROCESSNAME);
  list.add(paramIns,CRFNAME);
  
  list.add(paramIns,FIELDNAME);
   if(CONTROLTYPE=='imgupload')//图片上传 base64存储在mongeb里面 
   { 
      list.add(paramIns,'图片');
   }
   else
   {
    list.add(paramIns,JSON.stringify(TESTFillJson[KEY]));//FIELDVALUEORIGINAL
   }
  var FIELDVALUEMODIFY='';//修改值
  list.add(paramIns,FIELDVALUEMODIFY);
  list.add(paramIns,CONTROLTYPE);
  list.add(paramIns,SCORE);
  
  
  list.add(paramIns,REMARK);//remark
  list.add(paramIns,UNIT);
  list.add(paramIns,INPUTID);//填表人ID
  list.add(paramIns,INPUTNAME);//填表人

  list.add(paramIns,'0');//
  list.add(paramIns,'表单填写');//memo 
  list.add(paramIns,ORGID);
  list.add(paramIns,DOCTOR);
  sql.update(sqls,paramIns,"1");

  //======修改日志记录表结束=======================
 }

  //===============================================
  //  数据核查 需要提示给前端,不进入数据库
    var sqls=" select INSPECTID,INSPECTSQL,INSPECTTIP,INSPECTTYPE from "+
    " crf_datainspect where RESEARCHID=? "+
    " and PROCESSID=? and CRFID=? and STATUS=1 and INSPECTTYPE='1' ";
    paramIns=[];
    list.add(paramIns,RESEARCHID);
    list.add(paramIns,PROCESSID);
    list.add(paramIns,CRFID);
    sql.query(sqls,paramIns,"datainspect"); 
    var datainspect=sys.result.datainspect;
    var DataCheck=[];//逻辑质疑;
    for(var i=0;i<datainspect.length;i++)
    {
      paramIns=[];
      sqls=datainspect[i].INSPECTSQL+"  ";//自定义规则生成的sql语句;
      var  CountQ=parseInt(getStrCount(datainspect[i].INSPECTSQL,'?'));
      for(var j=0;j<CountQ;j++)
      {
        list.add(paramIns,TESTID);
      }
      sql.query(sqls,paramIns,"dataCheck"); 
      var dataCheck=sys.result.dataCheck;
      for(var index in dataCheck)
      {
        DataCheck.push(dataCheck[index]);
      }
    }
    //有数据核查的情况下，需要返回给前端,同时数据库要进行回滚!
    if(DataCheck.length>=1)
    {
       sys.addRetData(DataCheck, "DataCheck")
       sql.rollback();
       sys.setRetData(0,'数据核查',"DataCheck");
       return; 
    }
    //===============================================
    
    //===============================================
    //产生系统质疑;
    var sqls=" select INSPECTID,INSPECTSQL,INSPECTTIP,INSPECTTYPE from "+
    " crf_datainspect where RESEARCHID=? "+
    " and PROCESSID=? and CRFID=? and STATUS=1  and  INSPECTTYPE='0'";
    paramIns=[];
    list.add(paramIns,RESEARCHID);
    list.add(paramIns,PROCESSID);
    list.add(paramIns,CRFID);
    sql.query(sqls,paramIns,"datainspect"); 
    var datainspect=sys.result.datainspect;
    
    for(var i=0;i<datainspect.length;i++)
    {
       paramIns=[];
   sqls=datainspect[i].INSPECTSQL+"  ";//自定义规则生成的sql语句;
      var  CountQ=parseInt(getStrCount(datainspect[i].INSPECTSQL,'?'));
      for(var j=0;j<CountQ;i++)
      {
          list.add(paramIns,TESTID);
      }
       sql.query(sqls,paramIns,"dataIns"); 
       var dataIns=sys.result.dataIns;
       //INSPECTTIP 质疑提示  INSPECTTYPE:质疑类型
       DealInspect(dataIns,datainspect[i].INSPECTID,
       datainspect[i].INSPECTTIP,
       datainspect[i].INSPECTTYPE);
    }
    //============================================================
    
      //回写:DATA_TESTPROCESS 状态;
      var sqls=" update data_testprocess set STATUS=1,INPUTID=?,"+
      "      inputtime=sysdate  "+
      "      where  testid=? and researchid=?"+
      "      and processid=? and crfid=? ";
      paramIns=[];//
      
      list.add(paramIns,INPUTID);
      list.add(paramIns,TESTID);
      list.add(paramIns,RESEARCHID);
      list.add(paramIns,PROCESSID);
      list.add(paramIns,CRFID);
      sql.update(sqls,paramIns,"1");
    //===========================================================
    //-----------------------------------------------------------
   
   //处理不显示数据;
   DealDisplay();
   
   //sql.commit(); 
  //---------进行mongdb处理BEGIN-------------------------------- 
  var findx = TEST_CRF_INFO.find(
    {
      CRFID: CRFID,
      RESEARCHID: RESEARCHID,
      TESTID:TESTID,
      PROCESSID:PROCESSID
    });
   
   if(findx.length>1)
   {
     var msgTips='受试者ID:'+TESTID+' CRFID:'+CRFID+':对于多条数据(mongodb)';
      sql.rollback();
      sys.setRetData(1,msgTips);
      return; 
   }
    
  if(findx.length==0)
  {
     sql.rollback();
 var msgTips='受试者ID:'+TESTID+' CRFID:'+CRFID+':保存CRF表单数据失败(mongodb)';
    sys.setRetData(1,msgTips);
    return;
  }
  else 
  {  // 进行受试者填写的表更新;
     TEST_CRF_INFO.updateOne//?
      (
       { "CRFID": CRFID,"RESEARCHID":RESEARCHID,
         "TESTID":TESTID,"PROCESSID":PROCESSID},//条件
        {
          $set: 
          { 
          "TESTFillJson":JSON.stringify(TESTFillJson)
          }
        }
      );
  } 
   //---------进行mongdb处理END-----------------------  
  
   //---------查询系统质疑---------------------------- 
    var sqls="select crfname,fieldname,memo,questionreason "+
          " from data_question_"+RESEARCHID+" "+
    " where researchid=? and testid=? "+
    " and crfid=? "+
    " and status=0 and  questiontype='0' ";
    paramIns=[];
    list.add(paramIns,RESEARCHID);
    list.add(paramIns,TESTID);
    list.add(paramIns,CRFID);
    sql.query(sqls,paramIns,"dataQuestion");
    //-------------------------------------------------------  
    sys.addRetData(DataCheck, "DataCheck")
    sys.setRetData(0,"保存表单成功","dataQuestion","DataCheck");
}
 catch(e)
 {
   sql.rollback();
   sys.setRetData("999","保存表单失败"+e);
 }