import { LightningElement, track, wire, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord } from 'lightning/uiRecordApi'; //to fetch the Case record details

import KnowledgeRecordTypes from '@salesforce/apex/knowledgeSearchController.KnowledgeRecordTypes';
import KnowledgeArticles from '@salesforce/apex/knowledgeSearchController.KnowledgeArticles';
import fetchAnsFieldValue from '@salesforce/apex/knowledgeSearchController.fetchAnsFieldValue';
//import getContactEmail from '@salesforce/apex/knowledgeSearchController.getContactEmail';


export default class KnowledgeSearchLWC extends LightningElement {
    @track article; //store search input value
    @track articleList = []; //array-store list of articles fetched from Apex
    @track results;
    @track rt = 'All'; //selected Record Type for searching-default is All
    @track rtList = []; //stores list of available Record Types
    @api displayCard; //controls display style of component

    @track showModal = false;
    @track selectedArticleTitle;
    @track selectedArticleId;
    @track ansFieldValue;
    @track articleRecordLink;
    contentdoc = [];
    @api recordId;  
    
    //articlerecordId;
    ContactEmail;

    
    /* @wire(getRecord, { recordId: '$recordId' })
    caseRecord;  */

     
    @wire(KnowledgeRecordTypes)
    wiredRecordTypes({error, data}) {
        if (data) {
            this.rtList = data;
            console.log('KnowledgeRecordTypes data - ', data);
            this.error = undefined;
        }
        if (error) {
            this.error = error;
            console.log('data error', error);
            this.rtList = undefined;
        }
    };
   
    handleCible(event) {
        this.rt = event.target.value;
        console.log('handleCible rt - ', this.rt);
    }


    @wire(KnowledgeArticles, {input : '$article', cat : '$rt'})
    wiredArticles({error, data}) {
        if (data) {
            this.articleList = [];
            for (let article of data) {
                let myArticle = {};
                myArticle.data = article;
                this.articleList.push(myArticle);
            }
            this.error = undefined;
        }
        if (error) {
            this.error = error;
            this.articleList = undefined;
        }
    }

    changeHandler(event) {
        this.article = event.target.value;
        console.log('changeHandler article - ', this.article);
    }
 
    handleArticleClick(event) {
        let articleTitle = event.target.innerText;
        this.selectedArticleTitle = articleTitle;
  
    }


    @wire(fetchAnsFieldValue, { input: '$selectedArticleTitle' })
    wiredAnsValue({ error, data }) {
        if (data) {
            console.log("fetchAnsFieldValue data - " , JSON.stringify(data));

            this.ansFieldValue = data.ans;
            this.recordId = data.recordID;
            console.log("Article Title - ", this.selectedArticleTitle);
            console.log("Article Ans - ",this.ansFieldValue);
            console.log("Article recordId - ",this.recordId);
            
        } else if (error) {
            console.error('Error fetching ans__c or UrlName field value:', error);
        }
    }

   /*  @wire(getContactEmail, { caseId: '$recordId' }) 
    wiredWorkOrders({ error, data }) { 
        if (data) { 
            console.log("getContactEmail data - ", JSON.stringify(data)); 
            this.ContactEmail = data; 
        }else if (error) { 
            console.error('Error fetching Case Email:', error); 
        } 
    } 
    
    handleContentDocument(event) { 
        this.contentdoc = event.detail; 
        console.log('In Parent - ' ); 
        console.log('contentdoc - ' , this.contentdoc); 
    }   */

    handleModalView(event) {
        this.showModal = true;
    }

    handleCancel(){
        this.showModal = false;
    }


   /*  sendEmail(){ 
        console.log('handle sendEmail '); 
        console.log('title - ',this.selectedArticleTitle); 
        console.log('ans - ',this.ansFieldValue); 
        console.log('email - ',this.ContactEmail); 
        console.log('contentdoc - ',this.contentdoc); 
    
        if (!this.selectedArticleTitle || !this.ansFieldValue || !this.ContactEmail) { 
            console.error('Missing data to send email.'); 
            return; 
        }else{ 
    
            sendEmailMethod({  
            articleTitle: this.selectedArticleTitle,  
            ansFieldValue: this.ansFieldValue,  
            Contactmail: this.ContactEmail, 
            contentDocuments: this.contentdoc}) 
    
            .then(result => { 
                this.dispatchEvent( 
                    new ShowToastEvent({ 
                    title: 'Success', 
                    message: result, 
                    variant: 'success', 
                }) 
            ); 
    
            }).catch(error => { 
            this.dispatchEvent( 
                new ShowToastEvent({ 
                title: 'Error', 
                message: error.body.message, 
                variant: 'error', 
                }) 
            ); 
    
            //console.error('Error sending email:', error); 
            }); 
    
     }  
    
     }  */


    
}