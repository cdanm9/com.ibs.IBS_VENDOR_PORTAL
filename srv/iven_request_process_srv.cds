using {
  VENDOR_PORTAL,
  USERMASTER_ENTITIES
} from '../db/MASTER_TABLES';
using {
  VENDOR_PORTAL.REQUEST_INFO,
  VENDOR_PORTAL.REGFORM_ADDRESS,
  VENDOR_PORTAL.REGFORM_CONTACTS,
  VENDOR_PORTAL.REGFORM_BANKS,
  VENDOR_PORTAL.REGFORM_FINANCIAL,
  VENDOR_PORTAL.REGFORM_OWNERS,
  VENDOR_PORTAL.REGFORM_PRODUCT_SERVICE,
  VENDOR_PORTAL.REGFORM_CAPACITY,
  VENDOR_PORTAL.REGFORM_CUSTOMERS,
  VENDOR_PORTAL.REGFORM_OEM,
  VENDOR_PORTAL.REGFORM_DISCLOSURE_FIELDS,
  VENDOR_PORTAL.REGFORM_DISCLOSURE_QACERT,
  VENDOR_PORTAL.REGFORM_DISCLOSURE_RELATIVES,
  VENDOR_PORTAL.REGFORM_ATTACH_FIELDS,
  VENDOR_PORTAL.REGFORM_ATTACHMENTS
} from '../db/TRANSACTION_TABLES';


service requestProcessService {

  // @restrict: [
  //   { grant: 'READ', to:['Admin','Approver','PM','Buyer','Vendor']}
  // ]
  entity MasterIvenUsers           as projection on VENDOR_PORTAL.MASTER_IVEN_USERS;
  //  @restrict: [
  //   { grant: 'READ', to:['Admin','Approver','PM','Buyer','Vendor']}
  // ]
  entity MasteriVenAttachments     as projection on VENDOR_PORTAL.MASTER_IVEN_ATTACHMENTS;
  entity MasteriVenMDKAttachments     as projection on VENDOR_PORTAL.MASTER_IVEN_MDK_ATTACHMENTS;
  // @restrict: [
  //   { grant: 'READ', to:['Admin','Approver','PM','Buyer','Vendor']}
  // ]
  entity MasterRequestType         as projection on VENDOR_PORTAL.MASTER_REQUEST_TYPE;
  // @restrict: [
  //   { grant: 'READ', to:['Admin','Approver','PM','Buyer','Vendor']}
  // ]
  entity MasterStatus              as projection on VENDOR_PORTAL.MASTER_STATUS;
  // @restrict: [
  //   { grant: 'READ', to:['Admin','Approver','PM','Buyer','Vendor']}
  // ]
  entity MasterEntityCode          as projection on VENDOR_PORTAL.MASTER_ENTITY_CODE;
  // @restrict: [
  //   { grant: 'READ', to:['Admin','Approver','PM','Buyer','Vendor']}
  // ]
  entity MasterCountry             as projection on VENDOR_PORTAL.MASTER_COUNTRY;
  // @restrict: [
  //   { grant: 'READ', to:['Admin','Approver','PM','Buyer','Vendor']}
  // ]
  entity MasterFormFieldsMandatory as projection on VENDOR_PORTAL.MASTER_REGFORM_FIELDS_MANDATORY;
  // @restrict: [
  //   { grant: 'READ', to:['Admin','Approver','PM','Buyer','Vendor']}
  // ]
  entity MasterFormFieldsVisible   as projection on VENDOR_PORTAL.MASTER_REGFORM_FIELDS_VISIBLE;
  // @restrict: [
  //   { grant: 'READ', to:['Admin','Approver','PM','Buyer','Vendor']}
  // ]
  entity MasterFormFieldsUpdated   as projection on VENDOR_PORTAL.MASTER_REGFORM_FIELDS_UPDATED;
  // @restrict: [
  //   { grant: 'READ', to:['Admin','Approver','PM','Buyer','Vendor']}
  // ]
  entity MasterRegion              as projection on VENDOR_PORTAL.MASTER_REGION;
  // @restrict: [
  //   { grant: 'READ', to:['Admin','Approver','PM','Buyer','Vendor']}
  // ]
  entity MasterCurrency            as projection on VENDOR_PORTAL.MASTER_CURRENCY;
  // @restrict: [
  //   { grant: 'READ', to:['Admin','Approver','PM','Buyer','Vendor']}
  // ]
  entity MasterRequestEvents       as projection on VENDOR_PORTAL.MASTER_REQUEST_EVENTS;
  // @restrict: [
  //   { grant: 'READ', to:['Admin','Approver','PM','Buyer','Vendor']}
  // ]
  @cds.query.limit.max: 5000 
  entity RequestInfo               as projection on VENDOR_PORTAL.REQUEST_INFO;
  entity RegFormAddress            as projection on VENDOR_PORTAL.REGFORM_ADDRESS;
  entity RegFormContacts           as projection on VENDOR_PORTAL.REGFORM_CONTACTS;
  entity RegFormBanks              as projection on VENDOR_PORTAL.REGFORM_BANKS;
  entity RegFormFinancial          as projection on VENDOR_PORTAL.REGFORM_FINANCIAL;
  entity RegFormOwners             as projection on VENDOR_PORTAL.REGFORM_OWNERS;
  entity RegFormProdServ           as projection on VENDOR_PORTAL.REGFORM_PRODUCT_SERVICE;
  entity RegFormCapacity           as projection on VENDOR_PORTAL.REGFORM_CAPACITY;
  entity RegFormCustomers          as projection on VENDOR_PORTAL.REGFORM_CUSTOMERS;
  entity RegFormOEM                as projection on VENDOR_PORTAL.REGFORM_OEM;
  entity RegFormDiscInfo           as projection on VENDOR_PORTAL.REGFORM_DISCLOSURE_FIELDS;
  entity RegFormDiscRelatives      as projection on VENDOR_PORTAL.REGFORM_DISCLOSURE_RELATIVES;
  entity RegFormDiscQaCertif       as projection on VENDOR_PORTAL.REGFORM_DISCLOSURE_QACERT;
  entity RegFormAttachFields       as projection on VENDOR_PORTAL.REGFORM_ATTACH_FIELDS;
  entity RegFormAttachments        as projection on VENDOR_PORTAL.REGFORM_ATTACHMENTS;
  entity RegEventsLog              as projection on VENDOR_PORTAL.REQUEST_EVENTS_LOG;
  // @restrict: [
  //   { grant: 'READ', to:['Admin','Approver','PM','Buyer','Vendor']}
  // ]
  entity VendorMasterS4Hana        as projection on VENDOR_PORTAL.VENDOR_MASTER_S4_HANA;
  //Calculation View
  // @restrict: [
  //   { grant: 'READ', to:['Admin','Approver','PM','Buyer','Vendor']}
  // ]
  entity userMasterEntities        as projection on USERMASTER_ENTITIES;

  // Actions:
  // action RequestProcess(input : String)                    returns many String;

   //Type      
  type User_Details:{
    USER_ROLE: String(50);
    USER_ID: String(50);
  }


  //MDK Changes
  type MDKRequestInfo:{
    value:many {
            REQUEST_NO: Integer64;
            SAP_VENDOR_CODE: String(10);
            VENDOR_NAME1: String(100);
            VENDOR_NAME2: String(100);
            VENDOR_CODE: String(50);
            REGISTERED_ID: String(100);
            ENTITY_CODE: String(10);
            //ENTITY_DESC: .ENTITY_DESC;
            SUPPL_TYPE               : String(50);     
        SUPPL_TYPE_DESC          : String(50);
            BP_TYPE_CODE: String(4);
            NDA_TYPE: String(50);
            STATUS: Integer;
            // CREATED_BY: .REGISTERED_ID;
            LAST_UPDATED_ON: Timestamp;
            REQUEST_TYPE: Integer;
            //COMMENT: sap.ui.getCore().byId(id_comment).getValue();
            CREATED_ON               : Timestamp;
        COMMENT                  : String(1000);
             NEXT_APPROVER            : String(100);
        REQUESTER_ID             : String(100);
            REMINDER_COUNT           : Integer;
        BUYER_ASSIGN_CHECK       : String(1);
            CREATION_TYPE: Integer;
             APPROVER_LEVEL           : Integer;
        APPROVER_ROLE            : String(50);
    }
  }

  type MDKRegEventsLog:{
    value:many{
       REQUEST_NO : Integer64;
     EVENT_NO   : Integer;
        EVENT_CODE : Integer;
        EVENT_TYPE : String(20);
        USER_ID    : String(100);
        USER_NAME  : String(100);
        REMARK     : String(100);
        COMMENT    : String(1000);
        CREATED_ON : Timestamp;
    }
  }

  //MDK Changes

    
  action RequestProcess(action : String, inputData : many RequestInfo, eventsData : many RegEventsLog,userDetails:User_Details) returns many String;    
  action RequestProcessMDK(action : String, inputData : String, eventsData : String,userDetails:User_Details) returns many String;

  // action RequestProcessMDK(action : String, inputData : MDKRequestInfo, eventsData : MDKRegEventsLog,userDetails:User_Details) returns many String;   
               
  action RequestEditProcess(action:String,inputData : String,userDetails:User_Details) returns many String;    

}
