namespace SuperData
{
    public class DataStructure
    {
        public DataStructure() { }

        public DataStructure(DataStructure d)
        {
            this.data = d.data;
        }

        public DataStructure(string sumtinwong)
        {
            this.data = sumtinwong;
        }

        public string data { get; set; }
        public string hashKey { get; set; }
        public string token { get; set; }
    }
}
