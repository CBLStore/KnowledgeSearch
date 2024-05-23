public with sharing class knowledgeSearchController { 
    
    public knowledgeSearchController() { 
    } 
    
  
    //fetch RecordTypes 
    @AuraEnabled(cacheable=true) 
    public static List<String> KnowledgeRecordTypes(){ 
        List<String> knowledgeRecordTypesValues = new List<String>(); 

        for (RecordType rt : [SELECT Name FROM RecordType WHERE IsActive = true AND SobjectType = 'Knowledge__kav']) { 
            knowledgeRecordTypesValues.add(rt.Name); 
        } 

        System.debug('knowledge object RecordTypes - ' + knowledgeRecordTypesValues); 
        return knowledgeRecordTypesValues; 
    }
    
     
    //fetch available article List based on Input 
    @AuraEnabled(cacheable=true) 
    public static List<Knowledge__kav> KnowledgeArticles(String input, String cat) { 
        List<Knowledge__kav> knowledgeArticlesList = new List<Knowledge__kav>(); 
        
        String key = '%' + input + '%'; 
        String catkey = '%' + cat + '%'; 

        if (input != '' && input != null){ 
            if (cat != null && cat != '' && cat != 'All'){ 
                knowledgeArticlesList = [SELECT Id, Title
                                         FROM Knowledge__kav  
                                         WHERE PublishStatus='Online' AND Language = 'en_US' AND (Title LIKE :key ) AND (RecordType.Name LIKE: catkey) 
                                         LIMIT 10]; 
            }else{ 
            knowledgeArticlesList = [SELECT Id, Title,Ans__c  
                                     FROM Knowledge__kav      
                                     WHERE PublishStatus='Online' AND Language = 'en_US' AND (Title LIKE :key ) 
                                     LIMIT 10];  
            } 
        }
        System.debug('knowledgeArticlesList - ' +knowledgeArticlesList); 
        return knowledgeArticlesList;  
    } 
    
     
    //fetch selected article ans field 
    @AuraEnabled(cacheable=true) 
    public static Map<String, String> fetchAnsFieldValue(String input){ 
    
        Map<String, String> ansAndUrlValues = new Map<String, String>(); 
        Knowledge__kav record = [SELECT Id, Title, Ans__c FROM Knowledge__kav WHERE Title = :input LIMIT 1]; 
    
        if(record != null) { 
            ansAndUrlValues.put('ans', record.Ans__c);  
            ansAndUrlValues.put('recordID', record.Id); 
        } 
        return ansAndUrlValues; 
    } 
    

     /* //fetch Contact Email address 
     @AuraEnabled(cacheable=true) 
     public static String getContactEmail(Id caseId){ 
 
        String ContactEmail; 
        Case caseEmail = [SELECT Id, ContactEmail FROM Case WHERE Id = :caseId]; 
         // if (workOrderRecord != null && workOrderRecord.Contact != null) { 
         //contactEmail = workOrderRecord.Contact.Email; 
         //}  
         
         if(caseEmail !=null){
            ContactEmail = caseEmail.ContactEmail;
         }
         
         System.debug('Case - Contact Email'+ ContactEmail); 
         return ContactEmail;     
     } 
     

    //fetch selected article Attachments 
    @AuraEnabled(cacheable=true) 
    public static Map<String, Object> attachments(String articletitle) { 
    
        Map<String, Object> Values1 = new Map<String, Object>(); 
        Knowledge__kav record1 = [SELECT Id, Title, Ans__c, (SELECT ContentDocumentId 
                                  FROM ContentDocumentLinks) 
                                  FROM Knowledge__kav  
                                  WHERE Title = :articletitle LIMIT 1 ]; 
        if(record1 != null) { 
            List<Id> contentDocumentIds = new List<Id>();    

            for (ContentDocumentLink link : record1.ContentDocumentLinks){ 
                contentDocumentIds.add(link.ContentDocumentId); 
            } 
            Values1.put('contentDocumentIds', contentDocumentIds); 
        }    
        return Values1; 
    } 
    */
    
    @AuraEnabled(cacheable=true)
        public static Map<ID, String> getAttachmentsByRecordId(String recordId) {
            // Get record file IDs        
            List<ContentDocumentLink> files = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :recordId];
            List<ID> fileIDs = new List<ID>();
            for (ContentDocumentLink docLink : files) {
                fileIDs.add(docLink.ContentDocumentId);
            }
     
            List<ContentVersion> docs = [SELECT ContentDocumentId, FileExtension, Title 
                FROM ContentVersion WHERE ContentDocumentId IN : fileIDs];
            Map<ID, String> mapIdTitle = new Map<ID, String>();
            for (ContentVersion docLink : docs) {
                mapIdTitle.put(docLink.ContentDocumentId, docLink.Title);
            }
            return mapIdTitle;
        }
     
   
    /* //email functionality 
    @AuraEnabled(cacheable=true) 
    public static String sendEmailMethod(String articleTitle, String ansFieldValue, String Contactmail, List<Id> contentDocuments){ 
        try { 
            System.debug('articleTitle - '+ articleTitle); 
            System.debug('ansFieldValue - '+ ansFieldValue); 
            System.debug('contentDocuments - '+ contentDocuments); 

        //email content 
            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage(); 

            email.setToAddresses(new String[]{Contactmail}); 
            email.setSubject('Knowledge Article Details'); 
            email.setHtmlBody('<h2><strong>' + articleTitle + '</strong></h2>' +'<p>' + ansFieldValue ); 
            
            List<Messaging.EmailFileAttachment> attachments = new List<Messaging.EmailFileAttachment>(); 
            
            for (Id contentDocumentId : contentDocuments) {     //fetch ContentVersion records associated with ContentDocumentId

                ContentVersion[] contentVersions = [SELECT Id,ContentDocumentId, VersionData FROM ContentVersion WHERE ContentDocumentId = :contentDocuments]; 
                if (!contentVersions.isEmpty()) {           
                    Messaging.EmailFileAttachment attachment = new Messaging.EmailFileAttachment();     //creating EmailFileAttachment for each ContentVersion 
                    attachment.setFileName('Attachment_' + contentDocumentId + '.pdf');  
                    attachment.setContentType('application/pdf'); // Set the content type 
                    attachment.setInline(false); // Set to false if not inline 
                    attachment.setBody(contentVersions[0].VersionData); // Set the attachment body 
                    attachments.add(attachment); // Add the attachment to the list 
                } 
            } 
            email.setFileAttachments(attachments); // Add the attachments to the email 
            Messaging.sendEmail(new List<Messaging.Email>{email}); 

            return 'Email sent successfully'; 
        }catch(Exception e) { 
            System.debug('Exception occurred: ' + e.getMessage()); 
            throw new AuraHandledException('Failed to send email: ' + e.getMessage()); 
        } 

    }     */
}