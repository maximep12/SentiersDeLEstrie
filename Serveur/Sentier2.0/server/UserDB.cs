using System.Net.Http;
using System.Text;

namespace Sentier2._0
{
    public class userDB
    {
        private static readonly HttpClient client = new HttpClient();

        // get APPID, constante: https://www.lessentiersdelestrie.qc.ca/users/universglid.php?APPID=20210203

        // Obtient un clef SHA1
        public string getNewLogId()
        {
            string uri = "https://www.lessentiersdelestrie.qc.ca/users/universglid.php?APPID=20210203";
            var response = client.GetStringAsync(uri).Result;
            return response;
        }

        public string getNewLogIdJournalier()
        {
            string uri = "https://www.lessentiersdelestrie.qc.ca/users/universglid.php?APPID=20210218"; // DIFFERENT DE L'AUTRE
            var response = client.GetStringAsync(uri).Result;
            return response;
        }

        public string validateUserCredsHash(string hLogid, string hUserID, string hUserPassword)
        {
            string uri = "https://www.lessentiersdelestrie.qc.ca/users/universval.php?" +
                "&PASSWORD=" + hUserPassword +
                "&USERNAME=" + hUserID +
                "&LOGID=" + hLogid;
            return client.GetStringAsync(uri).Result;

        }

        public string validateAdminUser(string LOGID) {
            string uri = "https://www.lessentiersdelestrie.qc.ca/users/universval.php?LOGID="+LOGID;
            return client.GetStringAsync(uri).Result;
        }

        public string validateUserCredsHashJournalier(string logid, string hash, string numeroPermis)
        {
            string uri = "https://www.lessentiersdelestrie.qc.ca/users/universval.php?" +
                "&PASSWORD=" + hash +
                "&NOPERMIS=" + numeroPermis +
                "&LOGID=" + logid;
            return client.GetStringAsync(uri).Result;
        }

        // utiliser pour tester.
        public string validateUserCreds(string logid, string userID, string userPassword)
        {

            string pass = gimmeHash(userID + gimmeHash(userPassword) + logid);

            string uri = "https://www.lessentiersdelestrie.qc.ca/users/universval.php?" +
                "&PASSWORD=" + pass +
                "&USERNAME=" + userID +
                "&LOGID=" + logid;

            //SLAP MES VALEURS DANS PHP ICI
            //var data = new StringContent(Encoding.UTF8, "text/plain");

            //byte[] byteArray = Encoding.UTF8.GetBytes(php);

            // Construire la request
            //string response = client.PostAsync(uri, data).Result.Content.ReadAsStringAsync().Result;
            return client.GetStringAsync(uri).Result;

        }

        static string gimmeHash(string str)
        {
            var sha1 = new System.Security.Cryptography.SHA1Managed();
            var plaintextBytes = Encoding.UTF8.GetBytes(str);
            var hashBytes = sha1.ComputeHash(plaintextBytes);

            var sb = new StringBuilder();
            foreach (var hashByte in hashBytes)
            {
                sb.AppendFormat("{0:x2}", hashByte);
            }

            return sb.ToString();
        }
    }
}
