// get libraries/modules
const cds = require('@sap/cds')
const dbClass = require("sap-hdbext-promisfied")
const hdbext = require("@sap/hdbext")
const lib_ias = require('./LIB/iven_library_ias')
const lib_common = require('./LIB/iven_library')
const lib_dms = require('./DMS_LIB/BTP_DMS_LIB')
module.exports = cds.service.impl(function () {
    this.on('GetRepository', async (req) => {
        
        try {
            var {userId,userRole}= req.data;
            var client = await dbClass.createConnectionFromEnv();
            var dbConn = new dbClass(client);
            let response = await lib_dms._GetRepositores();
            req.reply(response);
       
        } catch (error) {
            
            var sType=error.code?"Procedure":"Node Js";    
            var iErrorCode=error.code??500;
            let Result = {
                OUT_ERROR_CODE: iErrorCode,
                OUT_ERROR_MESSAGE:  error.message ? error.message : error
            }
            lib_common.postErrorLog(Result,null,userId,userRole,"Get DMS Repository",sType,dbConn,hdbext);
            // console.error(error)     
            // return error.messsage            
            req.error({ code:iErrorCode, message:  error.message ? error.message : error });
        }
    })
   
    this.on('GetSubFolderItem', async (req) => {
        
        try {
            var {parentFolderID,folderName,userId,userRole} = req.data;

            var client = await dbClass.createConnectionFromEnv();
            var dbConn = new dbClass(client);

              //      var fname = '10000002'; //optional if need to read main repo iVEN only
        // //    var fname = '';//all folders within repo
        //      var RepoID = 'iVEN';
        //     let a = await lib_dms._getSubFolderItems(RepoID, fname);
            let response = await lib_dms._getSubFolderItems(parentFolderID,folderName);   
            req.reply(response);
        } catch (error) {
            
            var sType=error.code?"Procedure":"Node Js";    
            var iErrorCode=error.code??500;
            let Result = {
                OUT_ERROR_CODE: iErrorCode,
                OUT_ERROR_MESSAGE:  error.message ? error.message : error
            }
            lib_common.postErrorLog(Result,null,userId,userRole,"Get DMS Sub Folders",sType,dbConn,hdbext);
            console.error(error)     
            // return error.messsage            
            req.error({ code:iErrorCode, message:  error.message ? error.message : error });
        }
    })

    this.on('CreateSubFolderItem', async (req) => {
        
        try {
            var {folderDetails,userDetails} = req.data;
            var sId=folderDetails.cmisRepositoryId||null;
            var sExternalId=folderDetails.externalId||null;
            var sFName=folderDetails.fname||null;
            
            var sUserId=userDetails.USER_ID||null;
            var sUserRole=userDetails.USER_ROLE||null;

            var client = await dbClass.createConnectionFromEnv();
            var dbConn = new dbClass(client);
            let response = await lib_dms._createSubFolder(sId,sExternalId,sFName);   
            req.reply(response);
        } catch (error) {
            
            var sType=error.code?"Procedure":"Node Js";    
            var iErrorCode=error.code??500;
            let Result = {
                OUT_ERROR_CODE: iErrorCode,
                OUT_ERROR_MESSAGE:  error.message ? error.message : error
            }
            lib_common.postErrorLog(Result,null,sUserId,sUserRole,"Create DMS Sub Folders",sType,dbConn,hdbext);
            console.error(error)     
            // return error.messsage            
            req.error({ code:iErrorCode, message:  error.message ? error.message : error });
        }
    })

    this.on('DeleteSubFolderItem', async (req) => {
        
        try {
            var {deleteFolderDetails,userDetails} = req.data;
            var sExternalId=deleteFolderDetails.externalId||null;
            var sObjectId=deleteFolderDetails.objectId||null;       
            
            var sUserId=userDetails.USER_ID||null;
            var sUserRole=userDetails.USER_ROLE||null;

            var client = await dbClass.createConnectionFromEnv();
            var dbConn = new dbClass(client);
            let response = await lib_dms._DeleteSubFolder(sObjectId,sExternalId);                    
            req.reply(response);        
        } catch (error) {
            
            var sType=error.code?"Procedure":"Node Js";    
            var iErrorCode=error.code??500;
            let Result = {
                OUT_ERROR_CODE: iErrorCode,
                OUT_ERROR_MESSAGE:  error.message ? error.message : error
            }
            lib_common.postErrorLog(Result,null,sUserId,sUserRole,"Delete DMS Sub Folders",sType,dbConn,hdbext);
            console.error(error)     
            // return error.messsage            
            req.error({ code:iErrorCode, message:  error.message ? error.message : error });
        }
    })

    this.on('CreateRepository', async (req) => {
        
        try {
            var {externalId,description,userDetails}= req.data;
            var sUserId=userDetails.USER_ID||null;
            var sUserRole=userDetails.USER_ROLE||null;
            var client = await dbClass.createConnectionFromEnv();
            var dbConn = new dbClass(client);
            let response = await lib_dms._CreateRepositorie(externalId,description);
            req.reply(response);
       
        } catch (error) {
            
            var sType=error.code?"Procedure":"Node Js";    
            var iErrorCode=error.code??500;
            let Result = {
                OUT_ERROR_CODE: iErrorCode,
                OUT_ERROR_MESSAGE:  error.message ? error.message : error
            }
            lib_common.postErrorLog(Result,null,sUserId,sUserRole,"Create DMS Repository",sType,dbConn,hdbext);
            // console.error(error)     
            // return error.messsage            
            req.error({ code:iErrorCode, message:  error.message ? error.message : error });
        }
    })

    this.on('DeleteRepository', async (req) => {
        
        try {
            var {cmisRepositoryId,userDetails}= req.data;
            var sUserId=userDetails.USER_ID||null;
            var sUserRole=userDetails.USER_ROLE||null;
            var client = await dbClass.createConnectionFromEnv();
            var dbConn = new dbClass(client);
            let response = await lib_dms._DeleteRepositore(cmisRepositoryId);
            req.reply(response);
       
        } catch (error) {
            
            var sType=error.code?"Procedure":"Node Js";    
            var iErrorCode=error.code??500;
            let Result = {
                OUT_ERROR_CODE: iErrorCode,
                OUT_ERROR_MESSAGE:  error.message ? error.message : error
            }
            lib_common.postErrorLog(Result,null,sUserId,sUserRole,"Delete DMS Repository",sType,dbConn,hdbext);
            // console.error(error)     
            // return error.messsage            
            req.error({ code:iErrorCode, message:  error.message ? error.message : error });
        }
    })
    
this.on('RenameFolder', async (req) => {

try {
    var {renameFolderDetails,userDetails} = req.data;
    var sExternalId=renameFolderDetails.externalId||null;
    var sObjectId=renameFolderDetails.objectId||null;       
    var sNewFname=renameFolderDetails.newFname||null;       
    
    var sUserId=userDetails.USER_ID||null;    
    var sUserRole=userDetails.USER_ROLE||null;

    var client = await dbClass.createConnectionFromEnv();   
    var dbConn = new dbClass(client);
    let response = await lib_dms._RenameFolder(sObjectId,sExternalId,sNewFname);                    
    req.reply(response);        
} catch (error) {
    
    var sType=error.code?"Procedure":"Node Js";    
    var iErrorCode=error.code??500;
    let Result = {
        OUT_ERROR_CODE: iErrorCode,
        OUT_ERROR_MESSAGE:  error.message ? error.message : error
    }
    lib_common.postErrorLog(Result,null,sUserId,sUserRole,"Rename DMS Folders",sType,dbConn,hdbext);
    console.error(error)     
    // return error.messsage            
    req.error({ code:iErrorCode, message:  error.message ? error.message : error });
}
})

this.on('MoveObjectFTF', async (req) => {

try {
    var {objectId,externalId,srcFolderId,trgFolderId,userDetails} = req.data;        
    
    var sUserId=userDetails.USER_ID||null;          
    var sUserRole=userDetails.USER_ROLE||null;

    var client = await dbClass.createConnectionFromEnv();        
    var dbConn = new dbClass(client);
    let response = await lib_dms._MoveObjectFTF(objectId,externalId,trgFolderId,srcFolderId);                           
    req.reply(response);        
} catch (error) {
    
    var sType=error.code?"Procedure":"Node Js";    
    var iErrorCode=error.code??500;
    let Result = {
        OUT_ERROR_CODE: iErrorCode,
        OUT_ERROR_MESSAGE:  error.message ? error.message : error
    }
    lib_common.postErrorLog(Result,null,sUserId,sUserRole,"Rename DMS Folders",sType,dbConn,hdbext);
    console.error(error)     
    // return error.messsage            
    req.error({ code:iErrorCode, message:  error.message ? error.message : error });
}
})

this.on('DeleteFile', async (req) => {

try {
    var {deleteFileDetails,userDetails} = req.data;    
    
    var sExternalId=deleteFileDetails.externalId||null;
    var sObjectId=deleteFileDetails.objectId||null;  
    
    var sUserId=userDetails.USER_ID||null;          
    var sUserRole=userDetails.USER_ROLE||null;

    var client = await dbClass.createConnectionFromEnv();        
    var dbConn = new dbClass(client);
    let response = await lib_dms._DeleteFile(sObjectId,sExternalId);                                         
    req.reply(response);        
} catch (error) {    
    
    var sType=error.code?"Procedure":"Node Js";    
    var iErrorCode=error.code??500;
    let Result = {
        OUT_ERROR_CODE: iErrorCode,
        OUT_ERROR_MESSAGE:  error.message ? error.message : error
    }
    lib_common.postErrorLog(Result,null,sUserId,sUserRole,"Rename DMS Folders",sType,dbConn,hdbext);
    console.error(error)     
    // return error.messsage            
    req.error({ code:iErrorCode, message:  error.message ? error.message : error });
}
})
    
}
)