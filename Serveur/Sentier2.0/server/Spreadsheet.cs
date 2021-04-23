using ExcelDataReader;
using System;
using System.Collections.Generic;
//using ExcelDataReader.DataSet;
using System.Data;
using System.IO;
using System.Linq;

namespace Sentier2._0
{
    public class Spreadsheet
    {
        public Spreadsheet()
        {
            path = Path.GetFullPath("./acutalData.xlsx");
        }

        public Spreadsheet(string fullPath)
        {
            path = fullPath;
        }

        private string path { get; set; }

        public Object createDataSet()
        {
            DataTable dataTable = GetExcelWorkSheet("Zones", true);
            var select = dataTable.Select();
            //Console.WriteLine(select.AsEnumerable());
            return select[0][0];
        }

        private IExcelDataReader GetExcelDataReader(bool isFirstRowAsColumnNames)
        {
            FileStream fileStream = File.Open(path, FileMode.Open, FileAccess.ReadWrite);

            IExcelDataReader dataReader;

            // https://stackoverflow.com/questions/50858209/system-notsupportedexception-no-data-is-available-for-encoding-1252
            // Ceci m'a sauvé. Ajout d'une ligne dans Startup.cs et de la dépendance NuGet à CodePagesEncodingProvider Class

            if (path.EndsWith(".xls"))
            {
                dataReader = ExcelReaderFactory.CreateBinaryReader(fileStream);
            }
            else if (path.EndsWith(".xlsx"))
            {
                dataReader = ExcelReaderFactory.CreateOpenXmlReader(fileStream);
            }
            else
            {
                //Throw exception for things you cannot correct
                throw new Exception("Le fichier n'est pas sous format .xls ni .xlsx");
            }

            return dataReader;

        }

        private DataSet GetExcelDataAsDataSet(bool isFirstRowAsColumnNames)
        {
            return GetExcelDataReader(isFirstRowAsColumnNames).AsDataSet();
        }

        private DataTable GetExcelWorkSheet(string workSheetName, bool isFirstRowAsColumnNames)
        {
            DataSet dataSet = GetExcelDataAsDataSet(isFirstRowAsColumnNames);
            DataTable workSheet = dataSet.Tables[workSheetName];

            if (workSheet == null)
            {
                throw new Exception(string.Format("The worksheet {0} does not exist, has an incorrect name, or does not have any data in the worksheet", workSheetName));
            }

            return workSheet;
        }

        public IEnumerable<DataRow> GetData(string workSheetName, bool isFirstRowAsColumnNames = true)
        {
            DataTable workSheet = GetExcelWorkSheet(workSheetName, isFirstRowAsColumnNames);

            IEnumerable<DataRow> rows = from DataRow row in workSheet.Rows
                                        select row;

            return rows;
        }

    }
}