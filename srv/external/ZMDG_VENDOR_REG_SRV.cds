/* checksum : 98d04f2292ec08de3b78d15dfbc2a030 */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.supported.formats : 'atom json xlsx'
service ZMDG_VENDOR_REG_SRV {};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity ZMDG_VENDOR_REG_SRV.BankDetailsSet {
  @sap.unicode : 'false'
  @sap.label : 'Vendor'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Lifnr : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Bank ID'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key BankID : String(4) not null;
  @sap.unicode : 'false'
  @sap.label : 'Bank Country'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Banks : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'IBAN (International Bank Account Number)'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  IBAN : String(34) not null;
  @sap.unicode : 'false'
  @sap.label : 'Bank Key'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Bankl : String(15) not null;
  @sap.unicode : 'false'
  @sap.label : 'Bank Account'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Bankn : String(18) not null;
  @sap.unicode : 'false'
  @sap.label : 'Control key'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Bkont : String(4) not null;
  @sap.unicode : 'false'
  @sap.label : 'Collect.author.'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Xezer : String(1) not null;
  @sap.unicode : 'false'
  @sap.label : 'Reference'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Bkref : String(20) not null;
  @sap.unicode : 'false'
  @sap.label : 'Account holder'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Koinh : String(60) not null;
  @sap.unicode : 'false'
  @sap.label : 'Account Name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  EbppAccname : String(40) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity ZMDG_VENDOR_REG_SRV.CompanyDataSet {
  @sap.unicode : 'false'
  @sap.label : 'Vendornumber'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Lifnr : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Company Code'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Bukrs : String(4) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity ZMDG_VENDOR_REG_SRV.ContactPersonSet {
  @sap.unicode : 'false'
  @sap.label : 'Vendor Number'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Lifnr : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Partner ID'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key PartnerID : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Name1'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Name1 : String(35) not null;
  @sap.unicode : 'false'
  @sap.label : 'Designation'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Designation : String(35) not null;
  @sap.unicode : 'false'
  @sap.label : 'Name2'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Name2 : String(35) not null;
  @sap.unicode : 'false'
  @sap.label : 'Street'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Street : String(35) not null;
  @sap.unicode : 'false'
  @sap.label : 'House Number'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  HouseNum1 : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'City'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  City1 : String(35) not null;
  @sap.unicode : 'false'
  @sap.label : 'Country'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Country : String(4) not null;
  @sap.unicode : 'false'
  @sap.label : 'State(Region)'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  State : String(8) not null;
  @sap.unicode : 'false'
  @sap.label : 'PO Box'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  PoBox : String(8) not null;
  @sap.unicode : 'false'
  @sap.label : 'Postal Code'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  PostalCode : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Telephone Number'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  TelephoneNumber : String(30) not null;
  @sap.unicode : 'false'
  @sap.label : 'Mobile'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Mobile : String(30) not null;
  @sap.unicode : 'false'
  @sap.label : 'Email ID'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  EmailID : String(241) not null;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
entity ZMDG_VENDOR_REG_SRV.GeneralDataSet {
  @sap.unicode : 'false'
  @sap.label : 'Vendornumber'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Lifnr : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Check Flag for Double Invoices or Credit Memos'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  REPRF : String(1) not null;
  @sap.unicode : 'false'
  @sap.label : 'Terms of payment key'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  ZTERM : String(4) not null;
  @sap.unicode : 'false'
  @sap.label : 'Key for sorting'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  ZUAWA : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Reconciliation Account in General Ledger'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  AKONT : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Country'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Land1 : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Name1 : String(40) not null;
  @sap.unicode : 'false'
  @sap.label : 'Name 2'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Name2 : String(40) not null;
  @sap.unicode : 'false'
  @sap.label : 'City'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Ort01 : String(35) not null;
  @sap.unicode : 'false'
  @sap.label : 'District'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Ort02 : String(35) not null;
  @sap.unicode : 'false'
  @sap.label : 'PO Box'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Pfach : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Postal Code'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Pstlz : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Region'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Regio : String(3) not null;
  @sap.unicode : 'false'
  @sap.label : 'Search term'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Sortl : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Street'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Stras : String(60) not null;
  @sap.unicode : 'false'
  @sap.label : 'Street 2'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  STR_SUPPL1 : String(40) not null;
  @sap.unicode : 'false'
  @sap.label : 'Street 3'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  STR_SUPPL2 : String(40) not null;
  @sap.unicode : 'false'
  @sap.label : 'Street 4'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  STR_SUPPL3 : String(40) not null;
  @sap.unicode : 'false'
  @sap.label : 'Title'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Anred : String(15) not null;
  @sap.unicode : 'false'
  @sap.label : 'House Number'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  HouseNum : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Default Telephone'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Telephone1 : String(30) not null;
  @sap.unicode : 'false'
  @sap.label : 'Additional Telephone'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Telephone2 : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Default Mobile'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Mobile1 : String(30) not null;
  @sap.unicode : 'false'
  @sap.label : 'Additional Mobile'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Mobile2 : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Default Fax'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Fax1 : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Additional Fax'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Fax2 : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'Default Email'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Email1 : String(241) not null;
  @sap.unicode : 'false'
  @sap.label : 'Additional Email'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Email2 : String(500) not null;
  @sap.unicode : 'false'
  @sap.label : 'Central Posting Block'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Sperr : String(1) not null;
  @sap.unicode : 'false'
  @sap.label : 'Purchasing Block'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Sperm : String(1) not null;
  @sap.unicode : 'false'
  @sap.label : 'BusinessPartner'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Partner : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'ID Type'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Type : String(6) not null;
  @sap.unicode : 'false'
  @sap.label : 'ID number'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Idnumber : String(60) not null;
  @sap.unicode : 'false'
  @sap.label : 'Scenario'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Scenario : String(1) not null;
  @sap.unicode : 'false'
  @sap.label : 'BP Type'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  BP_Type : String(4) not null;
  @sap.unicode : 'false'
  @sap.label : 'VAT Registration'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  VAT_RegNo : String(60) not null;
  @sap.unicode : 'false'
  @sap.label : 'Change Request Number'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  ChangeRequest : String(12) not null;
  @cds.ambiguous : 'missing on condition?'
  ContactPersonSet : Association to many ZMDG_VENDOR_REG_SRV.ContactPersonSet on ContactPersonSet.Lifnr = Lifnr;
  @cds.ambiguous : 'missing on condition?'
  CompanyDataSet : Association to many ZMDG_VENDOR_REG_SRV.CompanyDataSet on CompanyDataSet.Lifnr = Lifnr;
  @cds.ambiguous : 'missing on condition?'
  BankDetailsSet : Association to many ZMDG_VENDOR_REG_SRV.BankDetailsSet on BankDetailsSet.Lifnr = Lifnr;
};

@cds.external : true
@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.content.version : '1'
entity ZMDG_VENDOR_REG_SRV.IdentificationSet {
  @sap.unicode : 'false'
  @sap.label : 'BusinessPartner'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key Partner : String(10) not null;
  @sap.unicode : 'false'
  @sap.label : 'ID Type'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Type : String(6) not null;
  @sap.unicode : 'false'
  @sap.label : 'ID number'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  Idnumber : String(60) not null;
};

