import { LightningElement, api, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//import {NavigationMixin} from 'lightning/navigation';

import getAttachmentsByRecordId from '@salesforce/apex/knowledgeSearchController.getAttachmentsByRecordId';
//import attachments from '@salesforce/apex/knowledgeSearchController.attachments';

export default class modalPopup extends LightningElement {
    @api showModal = false;
    @api selectedArticleTitle;
    @api ansFieldValue;
    @api recordId;
   
   // @api articlerecordId;
    
    //contentDocumentID;

    @track modalClass = 'modal';
    
    
    connectedCallback(){
        console.log("In Child Component");
    } 

    filesList =[];
    @wire(getAttachmentsByRecordId, {recordId: '$recordId'})
    wiredResult({data, error}){ 
        if(data){ 
            console.log(data)
            this.filesList = Object.keys(data).map(item=>({"label":data[item],
             "value": item,
             "url":`/sfc/servlet.shepherd/document/download/${item}`
            }))
            console.log(this.filesList)
        }
        if(error){ 
            console.log(error)
        }
    }
    previewHandler(event){
        console.log(event.target.dataset.id)
        this[NavigationMixin.Navigate]({ 
            type:'standard__namedPage',
            attributes:{ 
                pageName:'filePreview'
            },
            state:{ 
                selectedRecordId: event.target.dataset.id
            }
        })
    }

   /*  @wire(attachments, {articletitle: '$selectedArticleTitle'}) 
    wiredAnsValue({ error, data }) { 

        if (data) { 
            console.log(" cd data - " , JSON.stringify(data)); 
            if (data.contentDocumentIds && data.contentDocumentIds.length > 0) { 
                this.contentDocumentID = data.contentDocumentIds; 
                this.handleCd(); 
            } 
            console.log("contentDocumentID- ",this.contentDocumentID); 
        }else if (error) { 
            console.error('Error fetching content Document', error); 
        } 
    }  
    sendEmail(){ 
        this.dispatchEvent(new CustomEvent('sendemail')); 
    }*/

   

  /*   handleCd() { 
        this.dispatchEvent(new CustomEvent('contentdocumentid', { detail: this.contentDocumentID })); 
    }  */ 


    handleCancel(){
        this.dispatchEvent(new CustomEvent('cancel'));  
    }
 
   

    // Computed property to conditionally apply CSS class for modal display
    get modalClass() {
        return this.showModal ? 'modal show-modal' : 'modal';
    }
}