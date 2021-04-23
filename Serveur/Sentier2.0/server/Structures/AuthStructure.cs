namespace SuperAuthStructure
{
    public class AuthStructure
    {
        public AuthStructure() { }

        public string userID { get; set; }
        public string hash { get; set; }
        public string logID { get; set; }
        public string deviceID { get; set; }
        public string permitNumber { get; set; }
        public string loginType { get; set; }
    }
}
