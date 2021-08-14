using LaylaERP.DAL;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace LaylaERP.BAL
{
    public class AccountingRepository
    {
        public static DataSet GetNatureofJournal()
        {
            DataSet DS = new DataSet();
            try
            {
                string strSQl = "Select ID,Nature from erp_NatureofJournal";
                DS = SQLHelper.ExecuteDataSet(strSQl);
            }
            catch (Exception ex)
            { throw ex; }
            return DS;
        }
    }
}