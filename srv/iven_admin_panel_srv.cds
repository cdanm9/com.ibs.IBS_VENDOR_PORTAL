using {VENDOR_PORTAL} from '../db/MASTER_TABLES';
using {VENDOR_PORTAL.IVEN_ERROR_LOG,  VENDOR_PORTAL.REGFORM_FOLDER_IDS} from '../db/TRANSACTION_TABLES';


service adminPanelService {

    entity MasterTableNames as projection on VENDOR_PORTAL.MASTER_TABLENAMES;
    entity MasteriVenAttachments as projection on VENDOR_PORTAL.MASTER_IVEN_ATTACHMENTS;
    entity MasterAttachmentTypes as projection on VENDOR_PORTAL.MASTER_ATTACHMENT_TYPES;
    entity MasterRequestType as projection on VENDOR_PORTAL.MASTER_REQUEST_TYPE;
    entity MasterIvenSettings as projection on VENDOR_PORTAL.MASTER_IVEN_SETTINGS;
    entity IvenErrorLog as projection on VENDOR_PORTAL.IVEN_ERROR_LOG;
    entity RegFormFolderIds as projection on VENDOR_PORTAL.REGFORM_FOLDER_IDS; 
    entity MasterCountry    as projection on VENDOR_PORTAL.MASTER_COUNTRY;
    entity MasterEntityCode   as projection on VENDOR_PORTAL.MASTER_ENTITY_CODE;

     
      //Get data for Admin Panel
       function GetAdminPanelData(action : String,tableCode:String,requestNo:Integer) returns array of String;
       //Post Data for Admin Panel
       action PostAdminPanelData(input : String) returns array of String; 
       //Admin Panel Edit Functionality
       action EditAdminPanelData(input : String) returns array of String;
       //Get Visible and Mandatory Fields
        function GetVisbleMandatoryFields(requestType : Integer, entityCode : String) returns array of String;
 
}