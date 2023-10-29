const cds = require('@sap/cds')
const dbClass = require("sap-hdbext-promisfied")
const hdbext = require("@sap/hdbext")

const lib_common = require('./LIB/iven_library')
const lib_email = require('./LIB/iven_library_email')
const lib_email_content = require('./LIB/iven_library_email_content')
const connect = require('passport/lib/framework/connect')
const lib_mdg = require('./LIB/iven_library_mdg')

module.exports = cds.service.impl(function () {

    this.on('PostRegFormData', async (req) => {
        try {
            var {
                action,
                stepNo,
                reqHeader,
                addressData,
                contactsData,
                bankData,
                financeData,
                ownersData,
                prodServData,
                capacityData,
                customerData,
                oemData,
                discFieldsData,
                discRelativesData,
                discQaCertiData,
                attachmentFieldsData,
                attachmentData,
                updatedFields,
                eventsData
            } = req.data;

            var sAction = action;
            var Result = null;

 //intialize connection to database
 var connection = await cds.connect.to('db');
 var client = await dbClass.createConnectionFromEnv();
 let dbConn = new dbClass(client);
            if (sAction === "DRAFT" || sAction === "CREATE" || sAction === "RESEND") { //-----------------------------------------------------------------------------
                // APP_NAME = "Supplier Registration Form";
                // execProcedure = conn.loadProcedure('VENDOR_PORTAL', 'VENDOR_PORTAL.Procedure::ONBOARDING_DRAFT');

                var iReqNo = reqHeader[0].REQUEST_NO;
                var iReqType = reqHeader[0].REQUEST_TYPE;
                var iStep = stepNo;

                // --Section 2--
                var aMainObj = reqHeader;
                if (aMainObj.length > 0) {
                    reqHeader[0].REQUEST_NO = 0;
                } else {
                    throw "Invalid Payload";
                }
                var sUserId = reqHeader[0].REGISTERED_ID;
                var sEntityCode = reqHeader[0].ENTITY_CODE;
                var sIsResend = reqHeader[0].REQUEST_RESENT;
                var iStatus = 4; // Draft - in progress

                // iREG_NO = iReqNo || null;
                // sUser_ID = aMainObj[0].REGISTERED_ID || null;

                var aAddressObj = await getidForArr(addressData, "SR_NO") || [];
                var aContactObj = await getidForArr(contactsData, "SR_NO") || [];

                // --Section 2--
                var aPaymentObj = await getidForArr(bankData, "SR_NO") || [];
                var aFinanceObj = await getidForArr(financeData, "SR_NO") || [];
                var aOwnerObj = await getidForArr(ownersData, "SR_NO") || [];

                // --Section 3--
                var aProdServPayloadObj = await getProdServiceData(prodServData, "SR_NO") || [];
                var aProductObj = aProdServPayloadObj.Products || [];
                var aServiceObj = aProdServPayloadObj.Service || [];
                var aProdServbj = [...aProductObj, ...aServiceObj];

                var aCapacityObj = await getidForArr(capacityData, "SR_NO") || [];
                var aCustomerObj = await getidForArr(customerData, "SR_NO") || [];
                var aOEMObj = await getidForArr(oemData, "SR_NO") || [];

                // --Section 4--
                var aDiscFieldsObj = discFieldsData || [];
                if (aDiscFieldsObj.length > 0) {
                    aDiscFieldsObj[0].REQUEST_NO = 0;
                }
                var aRelativeObj = await getidForArr(discRelativesData, "SR_NO") || [];
                var aQaCertiObj = await getidForArr(discQaCertiData, "SR_NO") || [];

                // --Section 5--
                var aAttachFieldsObj = attachmentFieldsData || [];
                if (aAttachFieldsObj.length > 0) {
                    aAttachFieldsObj[0].REQUEST_NO = 0;
                }
                var aAttachmentsObj = await getidForArr(attachmentData, "SR_NO") || [];

                var aUpdatedFieldsIDs = updatedFields;
                var aUpdatedFieldsObj = [];
                if (aUpdatedFieldsIDs.length > 0) {
                    aUpdatedFieldsObj = await lib_common.getUpdatedFieldsDataForEdit(iReqNo, aUpdatedFieldsIDs, connection) || [];
                }

                var aEventsObj = eventsData || [];

                // Result = execProcedure(iReqNo, iStep, sEntityCode, sUserId, sIsResend, iStatus,
                //     aMainObj, aAddressObj, aContactObj,
                //     aPaymentObj, aFinanceObj, aOwnerObj,
                //     aProdServbj, aCapacityObj, aCustomerObj, aOEMObj,
                //     aDiscFieldsObj, aRelativeObj, aQaCertiObj,
                //     aAttachFieldsObj, aAttachmentsObj);
                // iVen_Content.postErrorLog(conn, Result, iReqNo, aMainObj[0].REGISTERED_ID, APP_NAME, "PROCEDURE");

                // get connection
             

                const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'REGFORM_DRAFT_SUBMIT');
                sResponse = await dbConn.callProcedurePromisified(loadProc,
                    [iReqNo, iReqType, iStep, sEntityCode, sUserId, sIsResend, iStatus,
                        aMainObj, aAddressObj, aContactObj,
                        aPaymentObj, aFinanceObj, aOwnerObj,
                        aProdServbj, aCapacityObj, aCustomerObj, aOEMObj,
                        aDiscFieldsObj, aRelativeObj, aQaCertiObj,
                        aAttachFieldsObj, aAttachmentsObj,aUpdatedFieldsObj, aEventsObj
                    ]
                );

                Result = sResponse.outputScalar;
                //Create response message
                var Message =null;
                if(Result.OUT_SUCCESS !== null){
                if(sAction === "DRAFT")
                    Message = "Draft saved successfully";
                else if(sAction === "CREATE")
                    Message = "Registration Form Submitted for Request: "+ iReqNo +". Your form will be forwarded to Procurement Team for verification.";
                else if(sAction === "RESEND")
                    Message ="Form resent successfully";
                } 
                else{
                    Message = "Process Failed"
                }
                responseObj = {
                    "Draft_Success": Result.OUT_SUCCESS !== null ? 'X' : '',
                    "REQUEST_NO": Result.OUT_SUCCESS !== null ? iReqNo : 0,
                    // "Message": Result.OUT_SUCCESS !== null ? "Draft saved successfully" : "Draft saving failed!",
                    "Message":Message,
                    "ERROR_CODE": Result.OUT_ERROR_CODE,
                    "ERROR_DESC": Result.OUT_ERROR_MESSAGE
                };

                // iVen_Content.responseInfo(JSON.stringify(responseObj), "text/plain", 200);

            }
            else {
                throw { message: "The value for action is invalid" };
            }

            req.reply(responseObj);

        } catch (error) {
            Result = {
                OUT_ERROR_CODE: null,
                OUT_ERROR_MESSAGE: error.message ? error.message : error
            }
            lib_common.postErrorLog( Result, iReqNo, sUserID, "Vendor Registration Form", "Js",dbConn,hdbext);
            
            req.error({ code: "500", message: error.message ? error.message : error });
        }
    })

    this.on('CheckSecurityPin', async (req) => {
        var client = await dbClass.createConnectionFromEnv();
        let dbConn = new dbClass(client);
        try {
           
            var { vendorEmail } = req.data;
            //intialize connection to database
            // var connection = await cds.connect.to('db');
             // get connection
          


            if (vendorEmail !== "" && vendorEmail !== null && vendorEmail !== undefined) {
                let connection = await cds.connect.to('db');//form connection to database
               
                let sEmailCheck = await connection.run(SELECT
                    .from(`${connection.entities['VENDOR_PORTAL.REQUEST_INFO']}`)
                    .where({ REGISTERED_ID: vendorEmail }));
                if(sEmailCheck.length > 0)
                {
                    let sResult = await connection.run(SELECT
                        .from(`${connection.entities['VENDOR_PORTAL.REQUEST_SECURITY_CODE']}`)
                        .where({ REGISTERED_ID: vendorEmail }));
    
                    if (sResult.length > 0) {
                        sResult[0].CREATED_ON = new Date(sResult[0].CREATED_ON);
                        req.reply(sResult[0]);
                    }
                    else{
                        throw "Generate Security Pin against email id";
                    }
                }
                else{
                    throw "Please enter Registered Email Id";
                }
            } else throw "Vendor email id is missing for security pin check."

        } catch (error) {
            Result = {
                OUT_ERROR_CODE: null,
                OUT_ERROR_MESSAGE: error.message ? error.message : error
            }
            lib_common.postErrorLog( Result, 1, vendorEmail, "Vendor Registration Form, Check Security Pin", "Js",dbConn,hdbext);
            
            req.error({ code: "500", message: error.message ? error.message : error });
        }

    })

    this.on('GetSecurityPin', async (req) => {
        try {
            var { vendorName, vendorEmail, requesterId } = req.data;
            var isEmailNotificationEnabled = false;

            if (vendorName === null || vendorEmail === null) {
                throw "Invalid Payload";
            }

            var sSupplierName = vendorName.toUpperCase().trim() || "";
            var sSupplierEmail = vendorEmail.toLowerCase().trim() || "";
            var sBuyerEmail = requesterId || "";

            var sSecurityPin = await getRandomNumber();

            var client = await dbClass.createConnectionFromEnv();
            let dbConn = new dbClass(client);

            //intialize connection to database
            let connection = await cds.connect.to('db');

            //Check if email notification is enabled
            isEmailNotificationEnabled = await lib_common.isiVenSettingEnabled(connection, "VM_EMAIL_NOTIFICATION");

            // load procedure
            // execProcedure = conn.loadProcedure('VENDOR_PORTAL', 'VENDOR_PORTAL.Procedure::REQUEST_SECURITY_CODE');
            // Result = execProcedure(sSupplierEmail, sSecurityPin);
            const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'REGFORM_SECURITY_PIN')
            sResponse = await dbConn.callProcedurePromisified(loadProc, [sSupplierEmail, sSecurityPin]);


            if (sResponse.outputScalar.OUT_SUCCESS !== null) {

                var oPinEmailData = {
                    "SupplierName": sSupplierName,
                    "SupplierId": sSupplierEmail,
                    "sSecurityPin": sSecurityPin,
                    "sBuyerId": sBuyerEmail
                };

                if (isEmailNotificationEnabled) {
                    var oEmaiContent = await lib_email_content.getEmailContent(connection, null, "SEC_PIN", oPinEmailData, null);
                    await lib_email.sendEmail(connection, oEmaiContent.emailBody, oEmaiContent.subject, [sSupplierEmail], [sBuyerEmail], null);
                }

                req.reply({ "SUCCESS": 'Yes' });

            }

        } catch (error) {
            req.error({ code: "500", message: error.message ? error.message : error });
        }


    })

    this.on('GetDraftData', async (req) => {
        try {
            //local Variables
            var { requestNo, entityCode, creationType } = req.data;
            var oCcodeRType = null,
                Result2 = {},
                Result = {},
                sUserID = null,
                sTypeDesc = null;

            //intialize connection to database
            let connection = await cds.connect.to('db');

            // try {
            if (entityCode === undefined || entityCode === null || entityCode === "" || creationType === undefined || creationType === null || creationType === "") {

                oCcodeRType = await getCcodeRType(connection, requestNo, "REQUEST_INFO");

                entityCode = oCcodeRType.EntityCode;
                // requestType = oCcodeRType.RequestType;
                creationType = oCcodeRType.CreationType;
                sTypeDesc = oCcodeRType.RequestTypeDesc;
            }

            if (entityCode === null || entityCode === "" || entityCode === undefined) {
                throw "Entity Code missing";
            }
            else if(creationType === null || creationType === "" || creationType === undefined){
                throw "Creation Type Missing"
            }
            else {

                var aDraftData = await getDraftData(connection, requestNo);
                if (aDraftData.MAIN.length > 0) {
                    sUserID = aDraftData.MAIN[0].REGISTERED_ID || null;
                }
                var aVisibleFieldsData = await getVisibleFieldsData(connection, entityCode, creationType);
                var aMandatoryFieldsData = await getMandatoryFieldsData(connection, entityCode, creationType);
                var aUpdatedFieldsData = await getUpdatedFieldsData(connection, requestNo);
                var aSettings = await getObjectFromRows(await getiVenSettings(connection));

                // Total Count of Mandatory Fields For Progress Bar
                var obj1 = aMandatoryFieldsData[0] || {};
                var totalCount = 0;
                var key;
                if (Object.keys(obj1).length) {
                    for (key in obj1) {
                        if (obj1[key] === "X") {
                            totalCount = totalCount + 1;
                        }
                    }
                }

                var responseObj = {
                    "DRAFT": (aDraftData.MAIN.length || aDraftData.ADDRESS.length) > 0 ? aDraftData : [], // changes to save country from registration form 10/04/2023
                    // "DRAFT": aDraftData.MAIN.length > 0 ? aDraftData : [],
                    "VISIBLE": aVisibleFieldsData.length > 0 ? aVisibleFieldsData : [],
                    "MANDATORY": aMandatoryFieldsData.length > 0 ? aMandatoryFieldsData : [],
                    "UPDATED": aUpdatedFieldsData.length > 0 ? aUpdatedFieldsData : [],
                    "OPENTEXT": await getOpenTextCredentials(connection),
                    "CLIENT_INFO": await getClientDetails(connection),
                    "TOTALCOUNT": totalCount,
                    "SETTINGS": aSettings
                };
                // iVen_Content.responseInfo(JSON.stringify(responseObj), "text/plain", 200);
                return responseObj;
            }

            // } catch (e) {
            //     Result2 = {
            // 			OUT_SUCCESS: e.message || ""
            // 		};

            // 		Result = {
            // 			OUT_ERROR_CODE: null,
            // 			OUT_ERROR_MESSAGE: e.message || ""
            // 		}

            // 		iVen_Content.postErrorLog(connection, Result, requestNo, sUserID, "Supplier Request Creation", "XSJS");
            // 		iVen_Content.responseInfo(JSON.stringify(Result2), "application/json", 400);
            // 	connection.rollback();
            // } 



        } catch (error) {
            req.error({ code: "500", message: error.message ? error.message : error });
        }
    })
    //Registration Approval Process
    this.on('RegFormDataApproval', async (req) => {
        try {


            var { action, inputData,addressData,contactsData,bankData, eventsData } = req.data;
            var isEmailNotificationEnabled = false;
            // get connection
            var client = await dbClass.createConnectionFromEnv();
            let dbConn = new dbClass(client);
            // execProcedure = conn.loadProcedure('VENDOR_PORTAL', 'VENDOR_PORTAL.Procedure::ONBOARDING_REJECT');

            //intialize connection to database
            let connection = await cds.connect.to('db');

            //Check if email notification is enabled
            isEmailNotificationEnabled = await lib_email.isiVenSettingEnabled(connection, "VM_EMAIL_NOTIFICATION");

            var iReqNo = inputData[0].REQUEST_NO || null;
            var sEntityCode = inputData[0].ENTITY_CODE || null;
            var iRequestType = inputData[0].REQUEST_TYPE || null;
            var sSupplierEmail = inputData[0].REGISTERED_ID || null;
            var sUserId = eventsData[0].USER_ID || null;
            var iLevel = inputData[0].APPROVER_LEVEL || null;
            var sBuyerEmail = inputData[0].REQUESTER_ID || null;
            var sIvenNo = inputData[0].IVEN_VENDOR_CODE || null;
            var sSupplerName = inputData[0].VENDOR_NAME1 || null;
            var sChangeRequestNo = null;
            var iVenVendorCode = inputData[0].IVEN_VENDOR_CODE;
            var sCompareValue = "A";

            if (action === "REJECT" || action === "SENDBACK") { //-----------------------------------------------------------------------------
                // APP_NAME = "Supplier Registration Approval";


                //     iREG_NO = iReqNo || null;
                //     sUser_ID = sUserId || null;
                //     var sComment = inputData[0].COMMENT;

                // Result = execProcedure(iReqNo, sEntityCode, iRequestType, sSupplierEmail, sUserId, iLevel, aEventObj);
                var lowerCaseAction = action.toLowerCase();
                const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'REGFORM_REJECT_SENDBACK');
                Result = await dbConn.callProcedurePromisified(loadProc,
                    [lowerCaseAction, iReqNo, sEntityCode, iRequestType, sSupplierEmail, sUserId, iLevel, eventsData]);
                responseObj = {
                    // "Message": Result.outputScalar.OUT_SUCCESS !== null ? Result.outputScalar.OUT_SUCCESS : "Rejection failed!"
                    "Message": Result.outputScalar.OUT_SUCCESS !== null ? Result.outputScalar.OUT_SUCCESS : lowerCaseAction + " failed!"

                };

                if (Result.outputScalar.OUT_SUCCESS !== null) {

                    var oEmailData = {
                        "ReqNo": iReqNo,
                        "SupplierName": sSupplerName,
                        "Approver_Email": sUserId,
                        "Approver_Level": iLevel,
                        "To_Email": Result.OUT_EMAIL_TO,
                        "ReqType": iRequestType,
                        "Reason": eventsData[0].COMMENT
                    };

                    if (isEmailNotificationEnabled) {
                        // var oEmaiContent = EMAIL_LIBRARY.getEmailData(action, "REGISTER", oEmailData, null);
                        // EMAIL_LIBRARY._sendEmailV2(oEmaiContent.emailBody, oEmaiContent.subject, [sSupplierEmail], null);
                        oEmaiContent = await lib_email_content.getEmailContent(connection, action, "REGISTER", oEmailData, null)
                        await lib_email.sendEmail(connection, oEmaiContent.emailBody, oEmaiContent.subject, [sSupplierEmail], null, null)


                        // var oEmaiContent2 = EMAIL_LIBRARY.getEmailData(action, "BUYER_NOTIFICATION", oEmailData, null);
                        // EMAIL_LIBRARY._sendEmailV2(oEmaiContent2.emailBody, oEmaiContent2.subject, [sBuyerEmail], null);
                        oEmaiContent = await lib_email_content.getEmailContent(connection, action, "BUYER_NOTIFICATION", oEmailData, null)
                        await lib_email.sendEmail(connection, oEmaiContent.emailBody, oEmaiContent.subject, [sBuyerEmail], null, null)

                    }

                    statusCode = 200;
                } else {
                    // iVen_Content.postErrorLog(conn, Result, iReqNo, sUserId, APP_NAME, "PROCEDURE");
                    statusCode = parseInt(Result.outputScalar.OUT_ERROR_CODE);
                    responseObj.ERROR_CODE = parseInt(Result.outputScalar.OUT_ERROR_CODE);
                    responseObj.ERROR_DESC = Result.outputScalar.OUT_ERROR_MESSAGE;
                    throw responseObj;
                }

                req.reply(responseObj);
                // iVen_Content.responseInfo(JSON.stringify(responseObj), "text/plain", statusCode);

            }
            else if (action === "APPROVE") { //-----------------------------------------------------------------------------
                var sSapVendorCode = null;
                // ------------- MDG Posting Start------------------
                var iMaxLevelCount = await getMaxApproverCount(connection, sEntityCode);

                var iVenVendorCode = null;
                var oMDGResponse = null;
                var iMDGStatus = null;
                var oMDGPayload = null;
                var bMDGComparison = null;
                var bAttachmentComparison = null;
                var oActiveData = null;
                var CurrAttachment = null;
                var bNoChange = false;
                var oDataStatus = null;
                var ODataResponse = null;
                var sCompareValue = null;

                if (iLevel === iMaxLevelCount) {
                    oMDGPayload =await lib_mdg.getMDGPayload(inputData,addressData,contactsData,bankData, connection);
                    iVenVendorCode = inputData[0].IVEN_VENDOR_CODE;
                    sSapVendorCode = parseInt(oMDGPayload.Lifnr, 10) || "";

                    //------------------------START: Direct MDG Call for testing-------------------------
                     var MDGResult = lib_mdg.PostToMDG(oMDGPayload);
                     console.log(MDGResult);
                    // iMDGStatus = MDGResult.iStatusCode;
                    // oMDGResponse = MDGResult.oResponse;
                    // sChangeRequestNo = MDGResult.oResponse.length === 12 ? MDGResult.oResponse : null;
                    // sCompareValue = "M";

                }

                // ------------- MDG Posting End------------------

                // if (iLevel < iMaxLevelCount || sChangeRequestNo !== null) {
                if (iLevel <= iMaxLevelCount) {
                    // 			if (iLevel <= iMaxLevelCount && bNoChange === false && oDataStatus !== 400 && iMDGStatus !== 500) {

                    // eventsData = getEventObjRegApproval(eventsData, iLevel, iMaxLevelCount, sChangeRequestNo);

                    // Result = execProcedure(iReqNo, sEntityCode, iRequestType,
                    //     sSupplierEmail, sBuyerEmail, sUserId, iLevel, aEventObj, sChangeRequestNo, iVenVendorCode, sSapVendorCode, sSupplerName,
                    //     sCompareValue);
                    const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'REGFORM_APPROVAL')

                    Result = await dbConn.callProcedurePromisified(loadProc,
                        [iReqNo, sEntityCode, iRequestType,
                            sSupplierEmail, sBuyerEmail, sUserId, iLevel, eventsData, sChangeRequestNo, iVenVendorCode, sSapVendorCode, sSupplerName,
                            sCompareValue]);
                    var responseObj = {
                        "Message": Result.outputScalar.OUT_SUCCESS !== null ? Result.outputScalar.OUT_SUCCESS : "Approval failed!",
                        // "MDG_status": iMDGStatus,
                        // "MDG_Payload": oMDGPayload,
                        // "ODataResponse": ODataResponse,
                        // "bMDGComparison": bMDGComparison,
                        // "bAttachmentComparison": bAttachmentComparison,
                        // "CurrAttachment": CurrAttachment,
                        "sChangeRequestNo": sChangeRequestNo

                    };

                    if (Result.outputScalar.OUT_SUCCESS !== null) {

                        var oEmailData = {
                            "ReqNo": iReqNo,
                            "ReqType": iRequestType,
                            "SupplierName": sSupplerName,
                            "SupplerEmail": sSupplierEmail,
                            "Approver_Email": sUserId,
                            "Approver_Level": iLevel,
                            "Next_Approver": Result.outputScalar.OUT_EMAIL_TO, // Proc Manager
                            "Buyer": sBuyerEmail
                        };

                        action = Result.outputScalar.OUT_MAX_LEVEL === iLevel ? "FINAL_APPROVAL" : "APPROVE";

                        if (action === "APPROVE") {
                            // pending for approval - notification to Proc Manager
                            if (isEmailNotificationEnabled) {
                                // var oEmaiContent = EMAIL_LIBRARY.getEmailData(action, "REGISTER", oEmailData, null);
                                // EMAIL_LIBRARY._sendEmailV2(oEmaiContent.emailBody, oEmaiContent.subject, [oEmailData.Next_Approver], null);
                                oEmaiContent = await lib_email_content.getEmailContent(connection, action, "REGISTER", oEmailData, null)
                                await lib_email.sendEmail(connection, oEmaiContent.emailBody, oEmaiContent.subject, [oEmailData.Next_Approver], null, null)

                                // Approval done - notification to Buyer
                                // var oEmaiContent2 = EMAIL_LIBRARY.getEmailData(action, "BUYER_NOTIFICATION", oEmailData, null);
                                // EMAIL_LIBRARY._sendEmailV2(oEmaiContent2.emailBody, oEmaiContent2.subject, [oEmailData.Buyer], null);
                                oEmaiContent = await lib_email_content.getEmailContent(connection, action, "BUYER_NOTIFICATION", oEmailData, null)
                                await lib_email.sendEmail(connection, oEmaiContent.emailBody, oEmaiContent.subject, [oEmailData.Buyer], null, null)

                            }

                        } else if (action === "FINAL_APPROVAL") {

                            // Approval done - notification to Buyer & Proc Manager
                            if (isEmailNotificationEnabled) {
                                // var oEmaiContent2 = EMAIL_LIBRARY.getEmailData(action, "BUYER_NOTIFICATION", oEmailData, null);
                                // EMAIL_LIBRARY._sendEmailV2(oEmaiContent2.emailBody, oEmaiContent2.subject, [oEmailData.Buyer, oEmailData.Approver_Email], null);
                                oEmaiContent = await lib_email_content.getEmailContent(connection, action, "BUYER_NOTIFICATION", oEmailData, null)
                                await lib_email.sendEmail(connection, oEmaiContent.emailBody, oEmaiContent.subject, [oEmailData.Buyer, oEmailData.Approver_Email], null, null)

                            }
                        }

                        statusCode = 200;
                    } else {
                        // iVen_Content.postErrorLog(conn, Result, iReqNo, sUserId, APP_NAME, "PROCEDURE");
                        statusCode = parseInt(Result.outputScalar.OUT_ERROR_CODE);
                        responseObj.ERROR_CODE = parseInt(Result.outputScalar.OUT_ERROR_CODE);
                        responseObj.ERROR_DESC = Result.outputScalar.OUT_ERROR_MESSAGE;
                        throw JSON.stringify(responseObj);
                    }

                    // iVen_Content.responseInfo(JSON.stringify(responseObj), "text/plain", statusCode);
                    return responseObj;
                } else {
                    return "Max level reached";
                    //     responseObj = {
                    //         "Message": "MDG posting failed!",
                    //         "MDG_status": iMDGStatus,
                    //         "MDG_Payload": oMDGPayload,
                    //         "SAP_Code": sSapVendorCode,
                    //         "MDG_Response": oMDGResponse

                    //     }
                    //     Result = {
                    //         "OUT_ERROR_CODE": iMDGStatus,
                    //         "OUT_ERROR_MESSAGE": JSON.stringify(oMDGResponse)
                    //     }
                    //     iVen_Content.postErrorLog(conn, Result, iReqNo, sUserId, "Supplier Registration Approval", "API");

                    //     if (bNoChange === true) {
                    //         responseObj.Message = "No Change Found in Data for Approval!"
                    //     } else if (oDataStatus && oDataStatus === 400) {
                    //         responseObj.Message = ODataResponse.oResponse;
                    //     } else if (iMDGStatus && iMDGStatus === 500) {
                    //         responseObj.Message = JSON.stringify(oMDGResponse);
                    //     }

                    //     iVen_Content.responseInfo(JSON.stringify(responseObj), "text/plain", 400);
                    //     if (iRequestType !== 5) {
                    //         // 	MDG_LIBRARY.rollbackSAPVendorCodeInSeq(conn);
                    //     }
                }

            }
            else if (action === "DUPLICATECHECK") {
                var sTradeLicense = (inputData[0].TRADE_LIC_NO === null || inputData[0].TRADE_LIC_NO === "") ? "" : inputData[0].TRADE_LIC_NO.toUpperCase();
                var sVatNumber = (inputData[0].VAT_REG_NUMBER === null || inputData[0].VAT_REG_NUMBER === "") ? "" : inputData[0].VAT_REG_NUMBER.toUpperCase();
                var sSupplierName = (inputData[0].VENDOR_NAME1 === null || inputData[0].VENDOR_NAME1 === "") ? "" : inputData[0].VENDOR_NAME1.toUpperCase();
                var sRequestNo = (inputData[0].REQUEST_NO === null || inputData[0].REQUEST_NO === "" || inputData[0].REQUEST_NO === undefined) ? "" : parseInt(
                    inputData[0].REQUEST_NO, 10);
                var responseObj = {
                    "TRADE_LIC_NO": await duplicateCheck(connection, "TRADE_LIC_NO", sTradeLicense, sRequestNo),
                    "VAT_REG_NUMBER": await duplicateCheck(connection, "VAT_REG_NUMBER", sVatNumber, sRequestNo),
                    "VENDOR_NAME1": await duplicateCheck(connection, "VENDOR_NAME1", sSupplierName, sRequestNo)
                };
                req.reply(responseObj);
                // iVen_Content.responseInfo(JSON.stringify(responseObj), "text/plain", 200);
            }

        } catch (error) {
            req.error({ code: "500", message: error.message ? error.message : error });
        }
    })
    this.on('MessengerService', async (req) => {
        try {
            var { action, messengerData, inputData, eventsData } = req.data;
            var isEmailNotificationEnabled = false;
            // get connection
            var client = await dbClass.createConnectionFromEnv();
            let dbConn = new dbClass(client);
            // execProcedure = conn.loadProcedure('VENDOR_PORTAL', 'VENDOR_PORTAL.Procedure::ONBOARDING_REJECT');

            //intialize connection to database
            let connection = await cds.connect.to('db');

            //Check if email notification is enabled
            isEmailNotificationEnabled = await lib_email.isiVenSettingEnabled(connection, "VM_EMAIL_NOTIFICATION");

            var iReqNo = inputData[0].REQUEST_NO || null;
            var sEntityCode = inputData[0].ENTITY_CODE || null;
            var sSupplierEmail = inputData[0].REGISTERED_ID || null;
            var sBuyerEmail = inputData[0].REQUESTER_ID || null;
            var sSupplerName = inputData[0].VENDOR_NAME1 || null;
            var sLoginId = messengerData.loginId;
            var sMailTo = messengerData.mailTo;

            // var sAction = inputData[0].ACTION;
            var aEventObj = await getEventObj(eventsData, action);
            // var sComment = "";
            // execProcedure = conn.loadProcedure('VENDOR_PORTAL', 'VENDOR_PORTAL.Procedure::COMMUNICATION_TOOL');
            // Result = execProcedure(iRegNo, sSupplerEmail, sMailTo, sAction, aEventObj);
            const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'MESSENGER_SERVICE')
            Result = await dbConn.callProcedurePromisified(loadProc,
                [iReqNo, sSupplierEmail, sMailTo, action, aEventObj]);


            if (Result.outputScalar.OUT_SUCCESS === null)
                throw "Messenger failed to send message!";

            var responseObj = {
                "Message": Result.outputScalar.OUT_SUCCESS
            };

            if (Result.outputScalar.OUT_SUCCESS !== null) {

                var oEmailData = {
                    "ReqNo": iReqNo,
                    "SupplierName": sSupplerName,
                    "From_Email": sLoginId,
                    "To_Email": Result.outputScalar.OUT_EMAIL_TO,
                    "sMessage": aEventObj[0].COMMENT
                };

                var sPmId = "";
                if (action === "VENDOR") {
                    sPmId = await lib_common.getApproverForEntity(connection, sEntityCode, 'PM', 'MATRIX_REGISTRATION_APPR') || "";
                    if (sPmId !== "") sPmId = sPmId[0].USER_ID;
                }

                if (isEmailNotificationEnabled) {
                    // var oEmaiContent = EMAIL_LIBRARY.getEmailData(sAction, "COMMUNCATION", oEmailData, null);
                    // EMAIL_LIBRARY._sendEmailV2(oEmaiContent.emailBody, oEmaiContent.subject, [oEmailData.To_Email], [sPmId]);
                    oEmaiContent = await lib_email_content.getEmailContent(connection, action, "COMMUNCATION", oEmailData, null)
                    await lib_email.sendEmail(connection, oEmaiContent.emailBody, oEmaiContent.subject, [oEmailData.To_Email], [sPmId], null)
                }

                statusCode = 200;
            } else {
                statusCode = 400;
            }
            // responseInfo(JSON.stringify(responseObj), "text/plain", statusCode);
            req.reply(responseObj);
        } catch (error) {
            req.error({ code: "500", message: error.message ? error.message : error });
        }
    })

    this.on('EditRegFormData', async (req) => {
        try {
            var { action, stepNo, reqHeader, addressData, contactsData, updatedFields, editLog } = req.data;
            var isEmailNotificationEnabled = false;
            // get connection
            var client = await dbClass.createConnectionFromEnv();
            let dbConn = new dbClass(client);
            // execProcedure = conn.loadProcedure('VENDOR_PORTAL', 'VENDOR_PORTAL.Procedure::ONBOARDING_REJECT');

            //intialize connection to database
            let connection = await cds.connect.to('db');
            //  queryResult = await connection.run(SELECT `COUNT(*)`
            //  .from`${connection.entities['VENDOR_PORTAL.REQUEST_INFO_TEMP']}`
            //  .where`REQUEST_NO = ${reqHeader[0].REQUEST_NO}`);

            //Check if email notification is enabled
            // isEmailNotificationEnabled = await lib_email.isiVenSettingEnabled(connection, "VM_EMAIL_NOTIFICATION");

            var iReqNo = reqHeader[0].REQUEST_NO || null;
            var sUserId = reqHeader[0].REGISTERED_ID || null;
            var sEntityCode = reqHeader[0].ENTITY_CODE || null;
            var sIsResend = reqHeader[0].REQUEST_RESENT || null;
            var iStatus = reqHeader[0].STATUS || null;
            var aAddressObj = await getidForArr(addressData, "SR_NO") || [];
            var aContactObj = await getidForArr(contactsData, "SR_NO") || [];

            // --Section 2--
            // var aPaymentObj = getidForArr(oPayload.VALUE.PAYMENT, "SR_NO") || [];
            // var aFinanceObj = getidForArr(oPayload.VALUE.FINANCE, "SR_NO") || [];
            // var aOwnerObj = getidForArr(oPayload.VALUE.OWNERS, "SR_NO") || [];
            // --Section 3--
            // var aProdServPayloadObj = getProdServData(oPayload.VALUE.PRODSERV, "SR_NO") || [];
            // var aProductObj = aProdServPayloadObj.Products || [];
            // var aServiceObj = aProdServPayloadObj.Service || [];
            // var aProdServbj = [...aProductObj, ...aServiceObj];

            // var aCapacityObj = getidForArr(oPayload.VALUE.CAPACITY, "SR_NO") || [];
            // var aCustomerObj = getidForArr(oPayload.VALUE.CUSTOMER, "SR_NO") || [];
            // var aOEMObj = getidForArr(oPayload.VALUE.OEM, "SR_NO") || [];

            // --Section 4--
            // var aDiscFieldsObj = oPayload.VALUE.DISC_FIELDS || [];
            // if (aDiscFieldsObj.length > 0) {
            //     aDiscFieldsObj[0].OBR_NO = 0;
            // }
            // var aRelativeObj = getidForArr(oPayload.VALUE.DISC_RELATIVES, "SR_NO") || [];
            // var aQaCertiObj = getidForArr(oPayload.VALUE.DISC_QA_CERTI, "SR_NO") || [];

            // --Section 5--
            // var aAttachFieldsObj = oPayload.VALUE.ATTACH_FIELDS || [];
            // if (aAttachFieldsObj.length > 0) {
            //     aAttachFieldsObj[0].OBR_NO = 0;
            // }
            // var aAttachmentsObj = getidForArr(oPayload.VALUE.ATTACHMENTS, "SR_NO") || [];

            var aUpdatedFieldsIDs = updatedFields;
            var aUpdatedFieldsObj = [];
            if (aUpdatedFieldsIDs.length > 0) {
                aUpdatedFieldsObj = await lib_common.getUpdatedFieldsDataForEdit(iReqNo, aUpdatedFieldsIDs, connection) || [];
            }

            var aLogsTable = await getLogsCount(connection, editLog);
            // Result = execProcedure(iReqNo, iStep, sEntityCode, sUserId, sIsResend, iStatus,
            //     aMainObj, aAddressObj, aContactObj,
            //     aPaymentObj, aFinanceObj, aOwnerObj,
            //     aProdServbj, aCapacityObj, aCustomerObj, aOEMObj,
            //     aDiscFieldsObj, aRelativeObj, aQaCertiObj,
            //     aAttachFieldsObj, aAttachmentsObj,
            //     aUpdatedFieldsObj,aLogsTable);
            if (action === 'APPROVE') {
                const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'REGFORM_EDIT_APPROVER')
                Result = await dbConn.callProcedurePromisified(loadProc,
                    [iReqNo,stepNo, sUserId, reqHeader, aAddressObj, aContactObj, [], [], [], [],
                        [], [], [], [], [], [], [], [], [], aUpdatedFieldsObj, aLogsTable]);

                if (Result.outputScalar.OUT_SUCCESS === null) {

                    let sErrorMsg = JSON.stringify({
                        "Edit_Success": '',
                        "REQUEST_NO": 0,
                        "Message": "Edit saving failed!"

                    })
                    throw sErrorMsg;
                }
                responseObj = {
                    "Edit_Success": 'X',
                    "REQUEST_NO": Result.outputScalar.OUT_SUCCESS,
                    "Message": "Edit saved successfully"
                };

                // responseInfo(JSON.stringify(responseObj), "text/plain", 200);
                req.reply(responseObj);
            }
        } catch (error) {
            req.error({ code: "500", message: error.message ? error.message : error });
        }
    })

    this.on('ManageCMS', async (req) => {
        try {
            var { action,attachmentId, inputData } = req.data;
            var aCMSData = inputData || [];
            var Result, responseObj;

            // get connection
            if (aCMSData.length > 0) {
                var client = await dbClass.createConnectionFromEnv();
                let dbConn = new dbClass(client);

                const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'CMS_OPERATIONS');
                Result = await dbConn.callProcedurePromisified(loadProc,[action,attachmentId.REQUEST_NO,attachmentId.SR_NO,attachmentId.DOC_ID, aCMSData]);

                if (Result.outputScalar.OUT_SUCCESS !== null) {
                    responseObj = {
                        "Message": Result.outputScalar.OUT_SUCCESS,
                        "DocID": Result.outputScalar.OUT_DOC_ID
                    };

                    req.reply(JSON.stringify(responseObj));
                }
                else {
                    responseObj = {
                        "Message": "CMS operation for " + action + " failed!",
                        "DocId": Result.outputScalar.OUT_DOC_ID,
                        "ERROR_CODE": parseInt(Result.outputScalar.OUT_ERROR_CODE),
                        "ERROR_DESC": Result.outputScalar.OUT_ERROR_MESSAGE
                    };
                    throw JSON.stringify(responseObj);
                }
            }
            else throw "Input data missing for action."
        } catch (error) {
            req.error({ code: "500", message: error.message ? error.message : error });
        }
    })

    this.on('EditSupplierProfile', async (req) => {
        try {
            var x = await lib_common.getCSRFTokenS4(req,res);
            console.log(x);
        } catch (error) {
            // lib_common.catchToken(error.reason.response.headers["x-csrf-token"]);
            req.error({ code: "500", message: error.message ? error.message : error });
        }
    })

    //test s4 hana service
    this.on('testOdata', async (req) => {
        try {
            var {payload} = req.data;
            var x = await lib_common.getCSRFTokenS4(payload);
            console.log(x);
            return x.toString();
        } catch (error) {
            // lib_common.catchToken(error.reason.response.headers["x-csrf-token"]);
            req.error({ code: "500", message: error.message ? error.message : error });
        }
    })



    async function getLogsCount(conn, oPayloadValue) {
        try {
            var iCount = 0;
            //    var sQuery =
            // 	'SELECT MAX("EVENT_NO") AS COUNT FROM "VENDOR_PORTAL"."VENDOR_PORTAL.Table::SUPPLIER_PROFILE_LOG" WHERE SAP_VENDOR_CODE = ?';
            // var aResult = conn.executeQuery(sQuery, oPayloadValue[0].SAP_VENDOR_CODE);
            let aResult = await conn.run(
                SELECT` MAX(EVENT_NO) AS COUNT`
                    .from`${conn.entities['VENDOR_PORTAL.SUPPLIER_PROFILE_LOG']}`
                    .where`SAP_VENDOR_CODE =${oPayloadValue[0].SAP_VENDOR_CODE}`
            );
            if (aResult.length > 0) {
                iCount = aResult[0].COUNT + 1;
            } else {
                iCount = iCount + 1;
            }
            for (var i = 0; i < oPayloadValue.length; i++) {
                var no = iCount + i;
                oPayloadValue[i].EVENT_NO = no;
            }

            return oPayloadValue;
        }
        catch (error) {
            throw error;
        }
    }
    // async function getUpdatedFieldsDataForEdit(iReqNo, aUpdatedFieldsIDs, connection) {
    //     try {

    //         var aUpdatedIdData = [];

    //         var aColumnsTemplate = await lib_common.getTemplateColumns(connection);

    //         if (aUpdatedFieldsIDs.length > 0) {

    //             if (aColumnsTemplate.length > 0) {
    //                 if (aColumnsTemplate.length !== 0) {
    //                     var aColumnsTemplateObj = JSON.parse(JSON.stringify(aColumnsTemplate[0]));
    //                     var aTemplateKeys = Object.keys(aColumnsTemplate[0]);

    //                     for (var i = 0; i < aTemplateKeys.length; i++) {
    //                         if (aTemplateKeys[i] === "CCODE" || aTemplateKeys[i] === "TYPE") {
    //                             delete aColumnsTemplateObj[aTemplateKeys[i]];
    //                         } else if (aUpdatedFieldsIDs.includes(aTemplateKeys[i])) {
    //                             aColumnsTemplateObj[aTemplateKeys[i].toString()] = 'X';
    //                         } else {
    //                             aColumnsTemplateObj[aTemplateKeys[i].toString()] = null;
    //                         }
    //                     }

    //                     aColumnsTemplateObj.REQ_NO = iReqNo;
    //                     aUpdatedIdData.push(aColumnsTemplateObj);
    //                 } else {
    //                     throw "TEMPLATE Data missing Mandatory Fields Table";
    //                 }
    //             }
    //         }

    //         return aUpdatedIdData;
    //     }
    //     catch (error) {
    //         throw error;
    //     }
    // }

    async function getidForArr(array, propertyName) {
        if (array.length > 0) {
            if (propertyName !== "" && propertyName !== null && propertyName !== undefined) {
                for (var i = 0; i < array.length; i++) {
                    array[i].REQUEST_NO = 0;
                    array[i][propertyName] = i + 1;
                }
            } else {
                throw "Property Name missing for id's"
            }
        }

        return array;
    }
    async function getEventObj(oPayloadValue, action) {

        var iEventCode = null,
            sRemark = null;

        switch (action) {
            case "VENDOR":
                iEventCode = 10;
                sRemark = "Vendor sent email to Buyer";
                break;
            case "BUYER":
                iEventCode = 11;
                sRemark = "Buyer sent email to Vendor";
                break;
            case "APPROVER":
                iEventCode = 13;
                sRemark = "Approver sent email to Vendor";
                break;
        }

        var eventArr = [];

        if (oPayloadValue.length === 1) {
            eventArr = [{
                "REQUEST_NO": 0,
                "EVENT_NO": 0,
                "EVENT_CODE": iEventCode,
                "USER_ID": oPayloadValue[0].USER_ID,
                "USER_NAME": oPayloadValue[0].USER_NAME,
                "REMARK": sRemark,
                "COMMENT": oPayloadValue[0].COMMENT,
                "CREATED_ON": oPayloadValue[0].CREATED_ON,
                "EVENT_TYPE": oPayloadValue[0].EVENT_TYPE
            }];

        } else {
            throw "Incorrect Data format for posting";
        }

        return eventArr;
    }
    async function duplicateCheck(connection, sColumnName, sColumnValue, iObrNo) {
        try {
            var aResult = null;
            // aDataObjects = [];
            var whereObj = {};
            // var whereString ;
            // if (sColumnName === 'TRADE_LIC_NO') {
            //     whereObj['TRADE_LIC_NO'] = sColumnValue
            //     // whereString = `TRADE_LIC_NO = ${sColumnValue}`;
            // }
            // else if (sColumnName === 'VAT_REG_NUMBER') {
            //     whereObj['VAT_REG_NUMBER'] = sColumnValue
            // }
            // else if (sColumnName === 'VENDOR_NAME1') {
            //     whereObj['VENDOR_NAME1'] = sColumnValue
            // }
            whereObj[sColumnName] = sColumnValue;
            if (iObrNo !== "" && sColumnValue !== "") {
                whereObj['REQUEST_NO'] = {'!=':iObrNo}
                aResult = await connection.run(SELECT
                    .from`${connection.entities['VENDOR_PORTAL.REQUEST_INFO']}`
                    .where(whereObj)
                    // .where`TRADE_LIC_NO=${sColumnValue} AND REQUEST_NO=${iObrNo}`
                );
            }
            else {
                aResult = await connection.run(SELECT
                    .from`${connection.entities['VENDOR_PORTAL.REQUEST_INFO']}`
                    .where(whereObj)
                    // .where`${sColumnName} = ${sColumnValue}`
                );
            }
            // var sQuery =
            // 	'SELECT * FROM \"VENDOR_PORTAL\".\"VENDOR_PORTAL.Table::ONBOARDING_FORM\" WHERE ' + sColumnName + ' = ? ';

            // if (iObrNo !== "" && sColumnValue !== "") {
            // 	sQuery +=
            // 		'AND OBR_NO != ?';
            // 	aResult = conn.executeQuery(sQuery, sColumnValue, iObrNo);
            // }

            // if (aResult != null) {
            // 	aDataObjects = Object.keys(aResult).map(function(key) {
            // 		return aResult[key];
            // 	});
            // }
            // return aDataObjects;
            return aResult
        }
        catch (error) { throw error; }
    }

    async function getMaxApproverCount(connection, iEntityCode) {
        try {
            var iCount = 0;

            // var sQuery =
            // 	'SELECT MAX("APPROVER_LEVEL") AS COUNT FROM "VENDOR_PORTAL"."VENDOR_PORTAL.Table::ONBOARDING_MATRIX" WHERE ENTITY_CODE = ?';
            // var aResult = conn.executeQuery(sQuery, iEntityCode);
            let aResult = await connection.run(
                SELECT`MAX(APPROVER_LEVEL) AS COUNT`
                    .from`${connection.entities['VENDOR_PORTAL.MATRIX_REGISTRATION_APPR']}`
                    .where({ ENTITY_CODE: iEntityCode }));

            if (aResult.length > 0) {
                iCount = aResult[0].COUNT;
            }
            return iCount;
        } catch (error) { throw error; }
    }
    function getEventObjRegApproval(eventsData, iLevel, iMaxLevelCount, sChangeRequestNo) {

        var sCrNo = '';
        if (iLevel === iMaxLevelCount && (eventsData[0].COMMENT !== null || eventsData[0].COMMENT !== "") && (sChangeRequestNo !== null ||
            sChangeRequestNo !== "")) {
            // sCrNo = 'CR: ' + sChangeRequestNo + ' Created - ';
            sCrNo = 'CR: ' + parseInt(sChangeRequestNo, 10) + ' Created - ';
        }
        if (eventsData[0] !== null)
            eventsData[0].COMMENT = sCrNo + eventsData[0].COMMENT || ""
        else
            throw "Incorrect Data format for posting";

        return eventsData[0];
    }
    async function getidForArr(array, propertyName) {
        if (array.length > 0) {
            if (propertyName !== "" && propertyName !== null && propertyName !== undefined) {
                for (var i = 0; i < array.length; i++) {
                    array[i].REQUEST_NO = 0;
                    array[i][propertyName] = i + 1;
                }
            } else {
                throw "Property Name missing for id's"
            }
        }

        return array;
    }

    async function getProdServiceData(arrayPrdSrv, propertyName) {
        var aProductsArr = [];
        var aServiceArr = [];

        if (arrayPrdSrv.length > 0) {
            var dataObj = null;
            var iProdCount = 0;
            var iServCount = 0;

            for (var i = 0; i < arrayPrdSrv.length; i++) {
                arrayPrdSrv[i].REQUEST_NO = 0;
                if (arrayPrdSrv[i].TYPE === "PROD") {
                    arrayPrdSrv[i][propertyName] = ++iProdCount;
                    aProductsArr.push(JSON.parse(JSON.stringify(arrayPrdSrv[i])));
                } else if (arrayPrdSrv[i].TYPE === "SERV") {
                    arrayPrdSrv[i][propertyName] = ++iServCount;
                    aServiceArr.push(JSON.parse(JSON.stringify(arrayPrdSrv[i])));
                }
            }
        }

        var oDataObjects = {
            "Products": aProductsArr,
            "Service": aServiceArr
        };

        return oDataObjects;
    }

    async function getCcodeRType(connection, requestNo, sTable) {
        try {
            var oDataObjects = null, aEntityResult = null;
            let aResult = await connection.run(
                SELECT
                    .from`${connection.entities['VENDOR_PORTAL.' + sTable]}`
                    .where({ REQUEST_NO: requestNo })
            );
            // var sQuery =
            // 'SELECT * FROM "VENDOR_PORTAL"."VENDOR_PORTAL.Table::' + sTable + '" WHERE REG_NO = ?';
            // var aResult = conn.executeQuery(sQuery, requestNo);
            if (aResult.length > 0) {
                aEntityResult = await connection.run(
                    SELECT`BUTXT`
                        .from`${connection.entities['VENDOR_PORTAL.MASTER_ENTITY_CODE']}`
                        .where({ BUKRS: aResult[0].ENTITY_CODE })
                );
                if (aEntityResult.length > 0) {
                    oDataObjects = {
                        "EntityCode": aResult[0].ENTITY_CODE,
                        // "RequestType": aResult[0].REQUEST_TYPE,
                        "CreationType":aResult[0].CREATION_TYPE,
                        "RequestTypeDesc": aEntityResult[0].BUTXT
                    };
                }
            }
            // if (aResult.length > 0) {
            //     oDataObjects = {
            //         "EntityCode": aResult[0].ENTITY_CODE,
            //         "RequestType": aResult[0].REQUEST_TYPE,
            //         "RequestTypeDesc": aEntityResult[0].BUTXT
            //     };
            // }

            return oDataObjects;
        }
        catch (error) { throw error; }
    }

    async function getDraftData(connection, requestNo) {
        try {
            var oProdServObj = await getProdServData(connection, requestNo, "REGFORM_PRODUCT_SERVICE");
            var oOEMObj = await getOEMExclAndNonExclData(connection, requestNo, "REGFORM_OEM");
            var aMainData = await checkOtFolderIds(connection, await getTableData(connection, requestNo, "REQUEST_INFO")) || [];

            var oDraftObj = {
                "MAIN": aMainData || [],
                "ADDRESS": await getAddressWithDesc(connection, await getTableData(connection, requestNo, "REGFORM_ADDRESS") || []),
                "CONTACTS": await getContactsWithDesc(connection, await getTableData(connection, requestNo, "REGFORM_CONTACTS") || []),
                "PAYMENT": await getPaymentsWithDesc(connection, await getTableData(connection, requestNo, "REGFORM_BANKS") || []),

                "FINANCE": await getTableData(connection, requestNo, "REGFORM_FINANCIAL") || [],
                "OWNERS": await getTableData(connection, requestNo, "REGFORM_OWNERS") || [],

                "PRODUCTS": oProdServObj.Products || [],
                "SERVICES": oProdServObj.Service || [],
                "CAPACITY": await getTableData(connection, requestNo, "REGFORM_CAPACITY") || [],
                "CUSTOMER": await getTableData(connection, requestNo, "REGFORM_CUSTOMERS") || [],
                "OEM_EX": oOEMObj.OEM_EX || [],
                "OEM_NE": oOEMObj.OEM_NE || [],

                "DISC_FIELDS": await getTableData(connection, requestNo, "REGFORM_DISCLOSURE_FIELDS") || [],
                "DISC_RELATIVES": await getTableData(connection, requestNo, "REGFORM_DISCLOSURE_RELATIVES") || [],
                "DISC_QA_CERTI": await getTableData(connection, requestNo, "REGFORM_DISCLOSURE_QACERT") || [],

                "ATTACH_FIELDS": await getTableData(connection, requestNo, "REGFORM_ATTACH_FIELDS") || [],
                "ATTACHMENTS": await getAttachmentsData(connection, requestNo, "REGFORM_ATTACHMENTS", "ONB") || [],
                "EVENTS": await getEventsData(connection, requestNo, "REQUEST_EVENTS_LOG", "MSG") || []
            };

            return oDraftObj;
        }
        catch (error) { throw error; }
    }

    async function getProdServData(connection, requestNo, sTable) {
        try {
            var aProductsArr = [];
            var aServiceArr = [];

            let aResult = await connection.run(
                SELECT
                    .from`${connection.entities['VENDOR_PORTAL.' + sTable]}`
                    .where({ REQUEST_NO: requestNo }));
            // var sQuery =
            //     'SELECT * FROM "VENDOR_PORTAL"."VENDOR_PORTAL.Table::' + sTable + '" WHERE REQUEST_NO = ?';
            // var aResult = conn.executeQuery(sQuery, requestNo);
            if (aResult.length > 0) {
                Object.keys(aResult).map(function (key) {
                    if (aResult[key].TYPE === "PROD") {
                        aProductsArr.push(aResult[key]);
                    } else if (aResult[key].TYPE === "SERV") {
                        aServiceArr.push(aResult[key]);
                    }
                });
            }

            var oDataObjects = {
                "Products": aProductsArr,
                "Service": aServiceArr
            };

            return oDataObjects;
        }
        catch (error) { throw error; }
    }

    async function getOEMExclAndNonExclData(connection, requestNo, sTable) {
        try {
            var aExclusiveArr = [];
            var aNonExclusiveArr = [];
            let aResult = await connection.run(
                SELECT
                    .from`${connection.entities['VENDOR_PORTAL.' + sTable]}`
                    .where({ REQUEST_NO: requestNo }));
            // var sQuery =
            // 	'SELECT * FROM "VENDOR_PORTAL"."VENDOR_PORTAL.Table::' + sTable + '" WHERE REQUEST_NO = ?';
            // var aResult = conn.executeQuery(sQuery, requestNo);

            if (aResult.length > 0) {
                Object.keys(aResult).map(function (key) {

                    if (aResult[key].OEM_TYPE === "OEM_EX") {
                        aExclusiveArr.push(aResult[key]);
                    } else if (aResult[key].OEM_TYPE === "OEM_NE") {
                        aNonExclusiveArr.push(aResult[key]);
                    }
                });
            }

            var oDataObjects = {
                "OEM_EX": aExclusiveArr,
                "OEM_NE": aNonExclusiveArr
            };


            return oDataObjects;
        }
        catch (error) { throw error; }
    }

    async function getTableData(connection, requestNo, sTable) {
        try {
            let aResult = await connection.run(
                SELECT
                    .from`${connection.entities['VENDOR_PORTAL.' + sTable]}`
                    .where({ REQUEST_NO: requestNo })
                    // .orderBy`TABLE_DESCRIPTION`
            );
            // var sQuery = 'SELECT * FROM "VENDOR_PORTAL"."VENDOR_PORTAL.Table::' + sTable + '" WHERE REQUEST_NO = ?';
            // var aResult = conn.executeQuery(sQuery, requestNo);

            // var aDataObjects = Object.keys(aResult).map(function(key) { 
            // 	return aResult[key];
            // });

            return aResult;
        }
        catch (error) { throw error; }
    }

    async function getOtFolderIdData(connection, sTable, sIvenVendorCode) {
        try {
            let aResult = await connection.run(
                SELECT
                    .from`${connection.entities['VENDOR_PORTAL.' + sTable]}`
                    .where({ IVEN_VENDOR_CODE: sIvenVendorCode }));
            // var sQuery = 'SELECT * FROM "VENDOR_PORTAL"."VENDOR_PORTAL.Table::REGFORM_FOLDER_IDS"';
            // sQuery += ' WHERE IVEN_VENDOR_CODE = ?';
            // var aResult = conn.executeQuery(sQuery, sIvenVendorCode);

            // var aDataObjects = Object.keys(aResult).map(function(key) { 
            // 	return aResult[key];
            // });

            return aResult;
        }
        catch (error) { throw error; }
    }

    async function checkOtFolderIds(connection, aMainData) {
        try {
            var aFolderIdData = null;
            var aMainDataLocal = [];
            if (aMainData.length === 1 && (aMainData[0].OT_PARENT_ID === null || aMainData[0].OT_FOLDER1_ID === null || aMainData[0].OT_FOLDER2_ID === null)) {
                aFolderIdData = await getOtFolderIdData(connection, "REGFORM_FOLDER_IDS", aMainData[0].IVEN_VENDOR_CODE);

                if (aFolderIdData.length > 0) {
                    aMainDataLocal = JSON.parse(JSON.stringify(aMainData));

                    aMainDataLocal[0].OT_PARENT_ID = aFolderIdData[0].OT_PARENT_ID;
                    aMainDataLocal  [0].OT_FOLDER1_ID = aFolderIdData[0].OT_FOLDER1_ID;
                    aMainDataLocal[0].OT_FOLDER2_ID = aFolderIdData[0].OT_FOLDER2_ID;

                    aMainData = aMainDataLocal;
                }
            }
            return aMainData;
        }
        catch (error) { throw error; }
    }

    async function getAddressWithDesc(connection, addressArr) {
        try {
            var addressWithDesc = [];
            if (addressArr.length > 0) {
                var dataObj = {};
                // addressWithDesc = Object.keys(addressArr).map(function(key) {
                //     dataObj = JSON.parse(JSON.stringify(addressArr[key]));

                // 	if (dataObj.COUNTRY !== "" || dataObj.COUNTRY !== null) {
                // 		dataObj.COUNTRY_DESC = getCountryDesc(connection, dataObj.COUNTRY) || "";
                // 	}
                // 	if (dataObj.STATE !== "" || dataObj.STATE !== null) {
                // 		dataObj.REGION_DESC = getRegionDesc(conn, dataObj.COUNTRY, dataObj.STATE) || "";
                // 	}

                // 	return dataObj;
                // });
                for (var i = 0; i < addressArr.length; i++) {
                    dataObj = JSON.parse(JSON.stringify(addressArr[i]));
                    if (dataObj.COUNTRY !== "" || dataObj.COUNTRY !== null) {
                        dataObj.COUNTRY_DESC = await getCountryDesc(connection, dataObj.COUNTRY) || "";
                    }
                    if (dataObj.STATE !== "" || dataObj.STATE !== null) {
                        dataObj.REGION_DESC = await getRegionDesc(connection, dataObj.COUNTRY, dataObj.STATE) || "";
                    }
                    addressWithDesc.push(dataObj);
                }
            }

            return addressWithDesc;
        }
        catch (error) { throw error; }
    }

    async function getCountryDesc(connection, countryCode) {
        try {
            var sDesc = "";
            let aResult = await connection.run(
                SELECT`LANDX`
                    .from`${connection.entities['VENDOR_PORTAL.MASTER_COUNTRY']}`
                    .where({ LAND1: countryCode }));

            // var sQuery =
            //     'SELECT "LANDX" AS DESC FROM "VENDOR_PORTAL"."VENDOR_PORTAL.Table::MASTER_COUNTRY" WHERE LAND1 = ?';
            // var aResult = conn.executeQuery(sQuery, countryCode);

            if (aResult.length > 0) {
                sDesc = aResult[0].LANDX;
            }
            return sDesc;
        }
        catch (error) { throw error; }
    }

    async function getRegionDesc(connection, countryCode, regionCode) {
        try {
            var sDesc = "";
            let aResult = await connection.run(
                SELECT`BEZEI`
                    .from`${connection.entities['VENDOR_PORTAL.MASTER_REGION']}`
                    .where({ LAND1: countryCode, BLAND: regionCode }));

            //     var sQuery =
            //     'SELECT "BEZEI" AS DESC FROM "VENDOR_PORTAL"."VENDOR_PORTAL.Table::MASTER_REGION" WHERE LAND1 = ? AND BLAND = ?';
            // var aResult = conn.executeQuery(sQuery, countryCode, regionCode);

            if (aResult.length > 0) {
                sDesc = aResult[0].BEZEI;
            }
            return sDesc;
        }
        catch (error) { throw error; }
    }

    async function getContactsWithDesc(connection, contactsArr) {
        try {
            var addressWithDesc = [];
            if (contactsArr.length > 0) {
                var dataObj = {};
                for (var i = 0; i < contactsArr.length; i++) {
                    dataObj = JSON.parse(JSON.stringify(contactsArr[i]));
                    if (dataObj.NATIONALITY !== "" || dataObj.NATIONALITY !== null) {
                        dataObj.COUNTRY_DESC = await getCountryDesc(connection, dataObj.NATIONALITY) || "";
                    }
                    if (dataObj.STATE !== "" || dataObj.STATE !== null) {
                        dataObj.REGION_DESC = await getRegionDesc(connection, dataObj.NATIONALITY, dataObj.STATE) || "";
                    }
                    addressWithDesc.push(dataObj);
                }
                // addressWithDesc = Object.keys(contactsArr).map(function(key) {
                //     dataObj = JSON.parse(JSON.stringify(contactsArr[key]));

                // 	if (dataObj.NATIONALITY !== "" || dataObj.NATIONALITY !== null) {
                // 		dataObj.COUNTRY_DESC = getCountryDesc(conn, dataObj.NATIONALITY) || "";
                // 	}
                // 	if (dataObj.STATE !== "" || dataObj.STATE !== null) {
                // 		dataObj.REGION_DESC = getRegionDesc(conn, dataObj.NATIONALITY, dataObj.STATE) || "";
                // 	}

                // 	return dataObj;
                // });
            }

            return addressWithDesc;
        }
        catch (error) { throw error; }
    }

    async function getPaymentsWithDesc(connection, paymentArr) {
        try {
            var paymentWithDesc = [];
            if (paymentArr.length > 0) {
                var dataObj = {};
                // paymentWithDesc = Object.keys(paymentArr).map(function(key) {
                //     dataObj = JSON.parse(JSON.stringify(paymentArr[key]));

                // 	if (dataObj.BANK_COUNTRY !== "" || dataObj.BANK_COUNTRY !== null) {
                // 		dataObj.COUNTRY_DESC = getCountryDesc(conn, dataObj.BANK_COUNTRY) || "";
                // 	}

                // 	return dataObj;
                // });
                for (var i = 0; i < paymentArr.length; i++) {
                    dataObj = JSON.parse(JSON.stringify(paymentArr[i]));

                    if (dataObj.BANK_COUNTRY !== "" || dataObj.BANK_COUNTRY !== null) {
                        dataObj.COUNTRY_DESC = await getCountryDesc(connection, dataObj.BANK_COUNTRY) || "";
                    }
                    paymentWithDesc.push(dataObj);
                }
            }

            return paymentWithDesc;
        }
        catch (error) { throw error; }
    }

    async function getAttachmentsData(connection, requestNo, sTable, sAttachType) {
        try {
            let aResult = await connection.run(
                SELECT`REQUEST_NO,SR_NO,ATTACH_CODE,ATTACH_GROUP,ATTACH_DESC,ATTACH_VALUE,EXPIRY_DATE,FILE_NAME,FILE_TYPE,FILE_MIMETYPE,OT_DOC_ID`
                    .from`${connection.entities['VENDOR_PORTAL.' + sTable]}`
                    .where({ REQUEST_NO: requestNo, FILE_TYPE: sAttachType }));
            // var sQuery =
            // 	'SELECT "REQUEST_NO","SR_NO","ATTACH_CODE","ATTACH_GROUP","ATTACH_DESC","ATTACH_VALUE","EXPIRY_DATE","FILE_NAME","FILE_TYPE","FILE_MIMETYPE"';
            // sQuery += 'FROM "VENDOR_PORTAL"."VENDOR_PORTAL.Table::' + sTable + '" WHERE REQUEST_NO = ? AND  FILE_TYPE = ?';

            // var aResult = conn.executeQuery(sQuery, requestNo, sAttachType);

            // var aDataObjects = Object.keys(aResult).map(function(key) {
            // 	return aResult[key];
            // });

            return aResult;
        }
        catch (error) { throw error; }
    }

    async function getEventsData(connection, requestNo, sTable, sMsgType) {
        try {
            let aResult = await connection.run(
                SELECT
                    .from`${connection.entities['VENDOR_PORTAL.' + sTable]}`
                    .where({ REQUEST_NO: requestNo, EVENT_TYPE: sMsgType }));
            // var sQuery =
            // 	'SELECT * FROM "VENDOR_PORTAL"."VENDOR_PORTAL.Table::' + sTable + '" WHERE REG_NO = ? AND  EVENT_TYPE != ?';
            // var aResult = conn.executeQuery(sQuery, requestNo, sMsgType);

            // var aDataObjects = Object.keys(aResult).map(function(key) {
            // 	return aResult[key];
            // });
            return aResult;
        }
        catch (error) { throw error; }
    }

    async function getVisibleFieldsData(connection, entityCode, creationType) {
        try {
            let aResult = await connection.run(
                SELECT
                    .from`${connection.entities['VENDOR_PORTAL.MASTER_REGFORM_FIELDS_VISIBLE']}`
                    .where({ CCODE: entityCode, TYPE: creationType }));
            // var sQuery =
            // 	'SELECT * FROM "VENDOR_PORTAL"."VENDOR_PORTAL.Table::ENTITY_FIELDS_VISIBLE" WHERE "CCODE" = ? AND "TYPE" = ?';
            // var aResult = conn.executeQuery(sQuery, iEntityCode, iType);

            return aResult;
        }
        catch (error) { throw error; }
    }

    async function getMandatoryFieldsData(connection, entityCode, creationType) {
        try {
            let aResult = await connection.run(
                SELECT
                    .from`${connection.entities['VENDOR_PORTAL.MASTER_REGFORM_FIELDS_MANDATORY']}`
                    .where({ CCODE: entityCode, TYPE: creationType }));
            // var sQuery =
            // 	'SELECT * FROM "VENDOR_PORTAL"."VENDOR_PORTAL.Table::ENTITY_FIELDS_MANDATORY" WHERE CCODE = ? AND TYPE = ?';
            // var aResult = conn.executeQuery(sQuery, iEntityCode, iType);

            return aResult;
        }
        catch (error) { throw error; }
    }

    async function getUpdatedFieldsData(connection, requestNo) {
        try {
            let aResult = await connection.run(
                SELECT
                    .from`${connection.entities['VENDOR_PORTAL.MASTER_REGFORM_FIELDS_UPDATED']}`
                    .where({ REQ_NO: requestNo }));
            // var sQuery =
            // 	'SELECT * FROM "VENDOR_PORTAL"."VENDOR_PORTAL.Table::ENTITY_FIELDS_UPDATED" WHERE REQ_NO = ?';
            // var aResult = conn.executeQuery(sQuery, iRegNo);

            // var aDataObjects = Object.keys(aResult).map(function(key) {
            // 	return aResult[key];
            // });

            // return aDataObjects;
            return aResult;
        }
        catch (error) { throw error; }
    }

    async function getiVenSettings(connection) {
        try {
            let aResult = await connection.run(
                SELECT`CODE,SETTING`
                    .from`${connection.entities['VENDOR_PORTAL.MASTER_IVEN_SETTINGS']}`
                    .where({ TYPE: 'REGFORM' }));
            // var sQuery =
            // 	'SELECT "CODE", "SETTING" FROM "VENDOR_PORTAL"."VENDOR_PORTAL.Table::MASTER_IVEN_SETTINGS" ';
            // sQuery += 'WHERE "TYPE" = ?';
            // var aResult = conn.executeQuery(sQuery, "REGFORM"); 

            // var aDataObjects = Object.keys(aResult).map(function(key) {
            // 	return aResult[key];
            // });
            return aResult;
        }
        catch (error) { throw error; }
    }

    async function getObjectFromRows(aDataObjects) {
        try {
            var oReturnObj = {},
                datalength = aDataObjects.length;

            if (datalength > 0) {
                for (var i = 0; i < datalength; i++) {
                    oReturnObj[aDataObjects[i].CODE.toString()] = aDataObjects[i].SETTING;
                }
            }
            return oReturnObj;
        }
        catch (error) { throw error; }
    }

    async function getOpenTextCredentials(connection) {
        try {
            var aDataObj = "";
            let aResult = await connection.run(
                SELECT`USERNAME,PASSWORD,ADD_INFO1`
                    .from`${connection.entities['VENDOR_PORTAL.MASTER_CREDENTIAL']}`
                    .where({ TYPE: 'OPENTEXT', SR_NO: 1 }));
            // var sQuery =
            // 	'SELECT "USERNAME","PASSWORD","ADD_INFO1" FROM "VENDOR_PORTAL"."VENDOR_PORTAL.Table::MASTER_CREDENTIAL" WHERE TYPE = ? AND SR_NO = ?';
            // var aResult = conn.executeQuery(sQuery, "OPENTEXT", 1);

            if (aResult.length > 0) {
                aDataObj = aResult[0];
            }

            return aDataObj;
        }
        catch (error) { throw error; }
    }

    async function getClientDetails(connection) {
        try {
            var aDataObj = "";

            let aResult = await connection.run(
                SELECT`CLIENT_FULL_NAME,CLIENT_SHORT_NAME,CLIENT_COUNTRY`
                    .from`${connection.entities['VENDOR_PORTAL.MASTER_EMAIL_CONTACT_ID']}`
                    .where({ SR_NO: 1 }));
            // var sQuery =
            // 	'SELECT "CLIENT_FULL_NAME", "CLIENT_SHORT_NAME", "CLIENT_COUNTRY" FROM "VENDOR_PORTAL"."VENDOR_PORTAL.Table::MASTER_EMAIL_CONTACT_ID" WHERE SR_NO = ?';
            // var aResult = conn.executeQuery(sQuery, 1);

            if (aResult.length > 0) {
                aDataObj = aResult[0];
            }

            return aDataObj;
        }
        catch (error) { throw error; }
    }

    async function getRandomNumber() {
        var randomNo = JSON.stringify(Math.floor(100000 + Math.random() * 900000));

        return randomNo;
    }



})