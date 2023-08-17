// get libraries/modules
const cds = require('@sap/cds')
const dbClass = require("sap-hdbext-promisfied")
const hdbext = require("@sap/hdbext")
// const lib = require('./LIB/EMPLOYEE_LIB')

module.exports = cds.service.impl(function () {
  this.on('PostApprovalMatrix', async (req) => {
    try {
      // local variables
      var oReqData = req.data.input
      var aMatrixData = req.data.input.VALUE

      // get connection
      var client = await dbClass.createConnectionFromEnv()
      let dbConn = new dbClass(client)

      // load procedure
      const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'MATRIX_APPROVAL_USERS')
      console.log(oReqData)

      // excute procedure
      const result = await dbConn.callProcedurePromisified(loadProc,
      [oReqData.APP_TYPE, oReqData.ACTION, aMatrixData]);

      return "result"
      
    } catch (error) {
      console.error(error)
      return error
    }
  })

})