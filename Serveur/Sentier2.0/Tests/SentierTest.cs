using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Newtonsoft.Json;
using Sentier2._0.Controllers;
using Sentier2._0.Structures;
using SuperData;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace Tests
{
    [TestClass]
    public class SentierTest : SentierController
    {

        private string uid = "monUidDeTest";
        private string token = "";
        private string logidMember = "";
        private string logidDaily = "";
        private string user = "Lucien.Blais.Regout@USherbrooke.ca";
        private string password = "Lucien20210125";
        private SentierController controller = new SentierController();


        //private string uri = "https://192.168.0.101:45455/";
        private string uri = "http://localhost:60005/";

        [TestMethod]
        public void sendUID_Test()
        {
            Directory.SetCurrentDirectory(@"C:\Users\Lucien\Documents\Sentier\server\Sentier2.0\server");
            DataStructure value = new DataStructure();
            value.data = "code";// journalier
            logidDaily = controller.sendUID(value);

            value.data = "membership"; // membre
            logidMember = controller.sendUID(value);
            value.data = "?";// Valeur qui devrait briser la fonction

            Assert.IsTrue(!logidDaily.Contains("Failed"),"/sendUID failed to provide daily logid.");
            Assert.IsTrue(!logidMember.Contains("Failed"), "/sendUID failed to provide daily logid.");
            Assert.IsTrue(controller.sendUID(value).Contains("Failed"), "/sendUID failed to fail");
        }

        [TestMethod]
        public void downloadFileTest() {
            Directory.SetCurrentDirectory(@"C:\Users\Lucien\Documents\Sentier\server\Sentier2.0\server"); // set le directory
            var infos = controller.spreadsheetInfo();
            var it = infos.GetEnumerator();
            it.MoveNext();
            it.MoveNext();
            it.MoveNext();
            var f = controller.downloadFile().GetAwaiter().GetResult();
            var fichier = f as FileContentResult;
            Assert.IsTrue(it.Current.Contains(fichier.FileDownloadName), "Le fichier n'est pas le meme que celui affichier par le serveur.");
        }

        [TestMethod]
        public void uploadTrailTest() { 
            Directory.SetCurrentDirectory(@"C:\Users\Lucien\Documents\Sentier\server\Sentier2.0\server"); // set le directory
            SentiersStructure ss = new SentiersStructure();
            controller.uploadTrail(ss); // mettre des donnees vides pour le test
            ss.partners = new List<Partner>();
            Partner p = new Partner();

            // https://stackoverflow.com/questions/1344221/how-can-i-generate-random-alphanumeric-strings
            Random random = new Random();
            string RandomString(int length)
            {
                const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                return new string(Enumerable.Repeat(chars, length)
                  .Select(s => s[random.Next(s.Length)]).ToArray());
            }
            var tempValue = RandomString(10);
            p.name = tempValue;
            ss.partners.Add(p);

            controller.uploadTrail(ss);

            var valeurTestable = controller.getPartners().Value as List<Partner>;
            // ne peux pas faire valeurTestable[0].Equals(p) car en upload le server crer un nouvel objet et ils ont des id interne differents.
            Assert.IsTrue(valeurTestable[0].name.Equals(p.name), "La fonction getPartners ne contient pas les partenaires ajoutés.");
        }


    }
}
