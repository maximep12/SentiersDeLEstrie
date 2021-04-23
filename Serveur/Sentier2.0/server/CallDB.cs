using SuperData;
using System.Collections.Generic;

namespace Sentier2._0
{
    public class CallDB
    {
        public CallDB()
        {
            Datass = new List<DataStructure>() { };
            Datass.Add(new DataStructure("JE SUIS UN POGO"));
        }

        public List<DataStructure> Datass { get; set; }

        public void addData(DataStructure d)
        {
            this.Datass.Add(d);
        }

        public void addData(string somtinwong)
        {
            addData(new DataStructure(somtinwong));
        }
    }
}
