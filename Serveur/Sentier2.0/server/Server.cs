using SuperData;
using System.Collections.Generic;

namespace Sentier2._0
{
    public class Server
    {
        private static CallDB DB = new CallDB();

        public void addData(DataStructure d)
        {
            DB.addData(d);
        }

        public void addData(string somtinwong)
        {
            addData(new DataStructure(somtinwong));
        }

        public List<DataStructure> getData()
        {
            return DB.Datass;
        }
    }
}
