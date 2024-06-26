// get libraries/modules
const { Readable, PassThrough } = require("stream");
const cds = require('@sap/cds')
const { OpenApiRequestBuilder } = require('@sap-cloud-sdk/openapi');
const axios = require("axios");
const FormData = require("form-data");
const dbClass = require("sap-hdbext-promisfied")
const hdbext = require("@sap/hdbext")
const lib_ias = require('./LIB/iven_library_ias')
const lib_common = require('./LIB/iven_library')
const lib_dms = require('./DMS_LIB/BTP_DMS_LIB')
module.exports = cds.service.impl(function () {
    this.on('GetRepository', async (req) => {

        try {
            var { userId, userRole } = req.data;
            var client = await dbClass.createConnectionFromEnv();
            var dbConn = new dbClass(client);
            var response = await lib_dms._GetRepositores();   
            req.reply(response);    
    
        } catch (error) {

            var sType = error.code ? "Procedure" : "Node Js";
            var iErrorCode = error.code ?? 500;
            let Result = {
                OUT_ERROR_CODE: iErrorCode,
                OUT_ERROR_MESSAGE: error.message ? error.message : error
            }
            lib_common.postErrorLog(Result, null, userId, userRole, "Get DMS Repository", sType, dbConn, hdbext);
            // console.error(error)     
            // return error.messsage            
            req.error({ code: iErrorCode, message: error.message ? error.message : error });
        }
    })

    this.on('GetSubFolderItem', async (req) => {

        try {
            var { externalId, folderName, userId, userRole } = req.data;

            var client = await dbClass.createConnectionFromEnv();
            var dbConn = new dbClass(client);

            //      var fname = '10000002'; //optional if need to read main repo iVEN only
            // //    var fname = '';//all folders within repo
            //      var RepoID = 'iVEN';
            //     let a = await lib_dms._getSubFolderItems(RepoID, fname);
            let response = await lib_dms._getSubFolderItems(externalId, folderName);
            req.reply(response);   
        } catch (error) {

            var sType = error.code ? "Procedure" : "Node Js";
            var iErrorCode = error.code ?? 500;
            let Result = {
                OUT_ERROR_CODE: iErrorCode,
                OUT_ERROR_MESSAGE: error.message ? error.message : error
            }
            lib_common.postErrorLog(Result, null, userId, userRole, "Get DMS Sub Folders", sType, dbConn, hdbext);
            console.error(error)
            // return error.messsage            
            req.error({ code: iErrorCode, message: error.message ? error.message : error });
        }
    })

    this.on('CreateSubFolderItem', async (req) => {

        try {
            var { folderDetails, userDetails } = req.data;
            var sId = folderDetails.cmisRepositoryId || null;
            var sExternalId = folderDetails.externalId || null;
            var sFName = folderDetails.fname || null;

            var sUserId = userDetails.USER_ID || null;
            var sUserRole = userDetails.USER_ROLE || null;

            var client = await dbClass.createConnectionFromEnv();
            var dbConn = new dbClass(client);
            let response = await lib_dms._createSubFolder(sId, sExternalId, sFName);
            var responseChk = response.properties ?? null;
            if (responseChk) {
                response.properties.statusText = "Folder " + response.properties["cmis:name"].value + " Created Successfully";
                req.reply(response);
            }
        } catch (error) {

            var sType = error.code ? "Procedure" : "Node Js";
            var iErrorCode = error.code ?? 500;
            let Result = {
                OUT_ERROR_CODE: iErrorCode,
                OUT_ERROR_MESSAGE: error.message ? error.message : error
            }
            lib_common.postErrorLog(Result, null, sUserId, sUserRole, "Create DMS Sub Folders", sType, dbConn, hdbext);
            console.error(error)
            // return error.messsage            
            req.error({ code: iErrorCode, message: error.message ? error.message : error });
        }
    })

    // this.on('DeleteSubFolderItem', async (req) => {

    //     try {
    //         var {deleteFolderDetails,userDetails} = req.data;
    //         var sExternalId=deleteFolderDetails.externalId||null;
    //         var sObjectId=deleteFolderDetails.objectId||null;       

    //         var sUserId=userDetails.USER_ID||null;
    //         var sUserRole=userDetails.USER_ROLE||null;

    //         var client = await dbClass.createConnectionFromEnv();
    //         var dbConn = new dbClass(client);
    //         let response = await lib_dms._DeleteSubFolder(sObjectId,sExternalId);                    
    //         req.reply(response);        
    //     } catch (error) {

    //         var sType=error.code?"Procedure":"Node Js";    
    //         var iErrorCode=error.code??500;
    //         let Result = {
    //             OUT_ERROR_CODE: iErrorCode,
    //             OUT_ERROR_MESSAGE:  error.message ? error.message : error
    //         }
    //         lib_common.postErrorLog(Result,null,sUserId,sUserRole,"Delete DMS Sub Folders",sType,dbConn,hdbext);
    //         console.error(error)     
    //         // return error.messsage            
    //         req.error({ code:iErrorCode, message:  error.message ? error.message : error });
    //     }
    // })

    this.on('DeleteObject', async (req) => {

        try {
            var { deleteObjDetails, userDetails } = req.data;
            var sExternalId = deleteObjDetails.externalId || null;
            var sObjectId = deleteObjDetails.objectId || null;
            var sObjectTypeId = deleteObjDetails.objectTypeId || null;
            var response;

            var sUserId = userDetails.USER_ID || null;
            var sUserRole = userDetails.USER_ROLE || null;

            var client = await dbClass.createConnectionFromEnv();
            var dbConn = new dbClass(client);
            if (sObjectTypeId == 'cmis:folder') {
                response = await lib_dms._DeleteSubFolder(sObjectId, sExternalId);
            } else if (sObjectTypeId == 'cmis:document') {
                response = await lib_dms._DeleteFile(sObjectId, sExternalId);
            }
            req.reply(response);
        } catch (error) {

            var sType = error.code ? "Procedure" : "Node Js";
            var iErrorCode = error.code ?? 500;
            let Result = {
                OUT_ERROR_CODE: iErrorCode,
                OUT_ERROR_MESSAGE: error.message ? error.message : error
            }
            lib_common.postErrorLog(Result, null, sUserId, sUserRole, "Delete DMS Object", sType, dbConn, hdbext);
            console.error(error)
            // return error.messsage            
            req.error({ code: iErrorCode, message: error.message ? error.message : error });
        }
    })

    this.on('CreateRepository', async (req) => {

        try {
            var { externalId, description, userDetails } = req.data;
            var sUserId = userDetails.USER_ID || null;
            var sUserRole = userDetails.USER_ROLE || null;
            var client = await dbClass.createConnectionFromEnv();
            var dbConn = new dbClass(client);
            let response = await lib_dms._CreateRepositorie(externalId, description);
            req.reply(response);   

        } catch (error) {

            var sType = error.code ? "Procedure" : "Node Js";
            var iErrorCode = error.code ?? 500;
            let Result = {
                OUT_ERROR_CODE: iErrorCode,
                OUT_ERROR_MESSAGE: error.message ? error.message : error
            }
            lib_common.postErrorLog(Result, null, sUserId, sUserRole, "Create DMS Repository", sType, dbConn, hdbext);
            // console.error(error)     
            // return error.messsage            
            req.error({ code: iErrorCode, message: error.message ? error.message : error });
        }
    })

    this.on('DeleteRepository', async (req) => {

        try {
            var { id, userDetails } = req.data;
            var sUserId = userDetails.USER_ID || null;
            var sUserRole = userDetails.USER_ROLE || null;
            var client = await dbClass.createConnectionFromEnv();
            var dbConn = new dbClass(client);
            let response = await lib_dms._DeleteRepositore(id);      
            req.reply(response);

        } catch (error) {

            var sType = error.code ? "Procedure" : "Node Js";
            var iErrorCode = error.code ?? 500;
            let Result = {
                OUT_ERROR_CODE: iErrorCode,
                OUT_ERROR_MESSAGE: error.message ? error.message : error
            }
            lib_common.postErrorLog(Result, null, sUserId, sUserRole, "Delete DMS Repository", sType, dbConn, hdbext);
            // console.error(error)     
            // return error.messsage            
            req.error({ code: iErrorCode, message: error.message ? error.message : error });
        }
    })

    this.on('RenameObject', async (req) => {

        try {
            var { renameObjDetails, userDetails } = req.data;
            var sExternalId = renameObjDetails.externalId || null;
            var sObjectId = renameObjDetails.objectId || null;
            var sNewFname = renameObjDetails.newFname || null;

            var sUserId = userDetails.USER_ID || null;
            var sUserRole = userDetails.USER_ROLE || null;

            var client = await dbClass.createConnectionFromEnv();
            var dbConn = new dbClass(client);
            let response = await lib_dms._RenameFolder(sObjectId, sExternalId, sNewFname);
            req.reply(response);
        } catch (error) {

            var sType = error.code ? "Procedure" : "Node Js";
            var iErrorCode = error.code ?? 500;
            let Result = {
                OUT_ERROR_CODE: iErrorCode,
                OUT_ERROR_MESSAGE: error.message ? error.message : error
            }
            lib_common.postErrorLog(Result, null, sUserId, sUserRole, "Rename DMS Object", sType, dbConn, hdbext);
            console.error(error)
            // return error.messsage            
            req.error({ code: iErrorCode, message: error.message ? error.message : error });
        }
    })

    this.on('MoveObjectFTF', async (req) => {

        try {
            var { objectId, externalId, srcFolderId, trgFolderId, userDetails } = req.data;

            var sUserId = userDetails.USER_ID || null;
            var sUserRole = userDetails.USER_ROLE || null;

            var client = await dbClass.createConnectionFromEnv();
            var dbConn = new dbClass(client);
            let response = await lib_dms._MoveObjectFTF(objectId, externalId, trgFolderId, srcFolderId);
            req.reply(response);
        } catch (error) {

            var sType = error.code ? "Procedure" : "Node Js";
            var iErrorCode = error.code ?? 500;
            let Result = {
                OUT_ERROR_CODE: iErrorCode,
                OUT_ERROR_MESSAGE: error.message ? error.message : error
            }
            lib_common.postErrorLog(Result, null, sUserId, sUserRole, "Moving Object Folder To Folder", sType, dbConn, hdbext);
            console.error(error)
            // return error.messsage            
            req.error({ code: iErrorCode, message: error.message ? error.message : error });
        }
    })
    
    this.on('FileAccess', async (req) => {

        try {
            var { action,fileDetails, userDetails } = req.data;
            var sUserId = userDetails.USER_ID || null;
            var sUserRole = userDetails.USER_ROLE || null;
            var client = await dbClass.createConnectionFromEnv();
            var dbConn = new dbClass(client);
            var response;    

            var sExternalId = fileDetails.externalId || null;
            var sObjectId = fileDetails.objectId || null;
            var sMimeType = fileDetails.contentStreamMimeType || null;
            var sFileName = fileDetails.fname || null;
            if (action == 'Download'||action == 'View') {   
                response = await lib_dms._DownloadFile(sObjectId, sExternalId);
            } else if (action == 'Upload') {
                // response = await lib_dms._DeleteFile(sObjectId, sExternalId);
            }     

            req._.res.set('Content-disposition', 'attachment; filename='+sFileName+'');         
            // req._.res.set('Content-disposition', 'form-data; attachment; filename='+sFileName+'');    
            req._.res.set('Content-type',sMimeType);     
            var base64content=response.toString("base64")      
            var base64DataUri = 'data:'+sMimeType+';base64,' + base64content;   
            if(action=="View")       
                req._.res.send(response);           
            else   
                req._.res.send(base64DataUri);                                                                             
            req._.res.end();                             
        } catch (error) {

            var sType = error.code ? "Procedure" : "Node Js";
            var iErrorCode = error.code ?? 500;
            let Result = {
                OUT_ERROR_CODE: iErrorCode,
                OUT_ERROR_MESSAGE: error.message ? error.message : error
            }
            lib_common.postErrorLog(Result, null, sUserId, sUserRole, "Download DMS Repository", sType, dbConn, hdbext);
            // console.error(error)     
            // return error.messsage            
            req.error({ code: iErrorCode, message: error.message ? error.message : error });
        }
    })
          

    this.on('FileUpload', async (req) => {   
        try {     
            var { action,fileDetails, userDetails } = req.data;
            var sUserId = userDetails.USER_ID || null;
            var sUserRole = userDetails.USER_ROLE || null;
            var client = await dbClass.createConnectionFromEnv();
            var dbConn = new dbClass(client);                        
            var response;    

            var sExternalId = fileDetails.externalId || null;
            var sObjectId = fileDetails.objectId || null;
            var sFileName = fileDetails.fname || null;
            var fileContent = fileDetails.fileContent || null;    
            var sFileMimeType = fileDetails.contentStreamMimeType || null;          
            if (action == 'Download') {
                response = await lib_dms._DownloadFile(sObjectId, sExternalId);
            } else if (action == 'Upload') {   
                response = await lib_dms._UploadFile(sExternalId,sObjectId,sFileName,sFileMimeType,fileContent);     
            }  

            if(response||response.properties){                       
                response.properties.statusText="File "+sFileName+" uploaded successfully"
                response.properties.status=200;        
            }    
                    
            
            // req._.res.set('Content-disposition', 'attachment; filename=Quick_Time_Entry.pdf');
            // req._.res.set('Content-type', 'application/pdf');
            // var base64DataUri = 'data:application/pdf;base64,' + response;            
            // req._.res.send(base64DataUri);
            // req._.res.end();
            req.reply(response);             
        } catch (error) {

            var sType = error.code ? "Procedure" : "Node Js";  
            var iErrorCode = error.code ??(error.status??500);
            var iErrorMessage = error.message ??(error.statusText??error);    
            let Result = {
                OUT_ERROR_CODE: iErrorCode,
                OUT_ERROR_MESSAGE: iErrorMessage      
            }
            lib_common.postErrorLog(Result, null, sUserId, sUserRole, "Upload DMS Repository", sType, dbConn, hdbext);
            // console.error(error)     
            // return error.messsage            
            req.error({ code: iErrorCode, message: iErrorMessage });    
        }
    })


    // this.on('DeleteFile', async (req) => {

    // try {
    //     var {deleteFileDetails,userDetails} = req.data;    

    //     var sExternalId=deleteFileDetails.externalId||null;
    //     var sObjectId=deleteFileDetails.objectId||null;  

    //     var sUserId=userDetails.USER_ID||null;          
    //     var sUserRole=userDetails.USER_ROLE||null;

    //     var client = await dbClass.createConnectionFromEnv();        
    //     var dbConn = new dbClass(client);
    //     let response = await lib_dms._DeleteFile(sObjectId,sExternalId);                                         
    //     req.reply(response);        
    // } catch (error) {    

    //     var sType=error.code?"Procedure":"Node Js";    
    //     var iErrorCode=error.code??500;
    //     let Result = {
    //         OUT_ERROR_CODE: iErrorCode,
    //         OUT_ERROR_MESSAGE:  error.message ? error.message : error
    //     }
    //     lib_common.postErrorLog(Result,null,sUserId,sUserRole,"Rename DMS Folders",sType,dbConn,hdbext);
    //     console.error(error)     
    //     // return error.messsage            
    //     req.error({ code:iErrorCode, message:  error.message ? error.message : error });
    // }
    // })

}
)