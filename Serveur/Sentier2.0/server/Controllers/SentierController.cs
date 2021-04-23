using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Session;
using Sentier2._0.Structures;
using SuperAuthStructure;
using SuperData;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;
using System.Threading.Tasks;


namespace Sentier2._0.Controllers
{
    [EnableCors("AllowOrigin")]
    [ApiController]
    public class SentierController : ControllerBase
    {
        private static Server Ser = new Server();
        private static ContentDeliveryNetwork CDN = new ContentDeliveryNetwork();
        private FB fb = FB.getFirebaseInstance(); // return singleton
        private static userDB udb = new userDB();
        private static ConsoleUtility cu = new ConsoleUtility();
        StackTrace stackTrace = new StackTrace();
        private static bool security = true;

        public SentierController() { }

        [HttpGet]
        [Route("interfaceAdmin")]
        public Object interfaceAdmin([FromQuery] string LOGID)
        {
            cu.logTime("/interfaceAdmin");
            string status = cu.serverStatusString(ConsoleUtility.Status.Initialized);

            var temp = udb.validateAdminUser(LOGID);
            cu.logStatus(temp);
            if (temp == "2") {
                HttpContext.Session.SetString("weGood?", "yes"); //devrait etre unique a chaque session
                return new RedirectResult("index.html");
            }
            else
                return StatusCode(401); // sucks to suck
        }

        [HttpPost]
        [Route("sendUID")]
        public string sendUID([FromBody] DataStructure d)
        {
            cu.logTime("/sendUID");
            string status = cu.serverStatusString(ConsoleUtility.Status.Initialized);
            string response = status;
            DataStructure D = new DataStructure();
            if (d.data == "code") // journalier
            {
                response = udb.getNewLogIdJournalier();
            }
            else if (d.data == "membership") // membre
            {
                response = udb.getNewLogId();
            }
            else
            {
                response = "Failed to get the type of loggin";
            }
            cu.serverStatusString(ConsoleUtility.Status.Success, "logID sent with success.");
            return response;
        }

        [HttpGet]
        [Route("spreadsheetInfo")]
        public IEnumerable<string> spreadsheetInfo()
        {
            cu.logTime("/spreadsheetInfo");
            return Directory.EnumerateFiles(Path.GetFullPath("./Spreadsheets/"), "*.*");
        }

        [HttpPost]
        [Route("updateAppContent")] // ne me souviens plus lequel est utilise
        [Route("uploadTrails")]
        public string uploadTrail([FromBody] SentiersStructure ss)
        {
            cu.logTime("/uploadTrails");
            string result = cu.serverStatusString(ConsoleUtility.Status.Initialized);

            try
            {
                IFormatter formatter = new BinaryFormatter();

                // Permet de mieux gerer les threads qui accessent le fichier
                using (Stream stream = System.IO.File.Open(Path.GetFullPath("./sentierStructure.json"), FileMode.Open, FileAccess.Write))
                {
                    formatter.Serialize(stream, ss);
                }
                result = cu.serverStatusString(ConsoleUtility.Status.Success, "Data transfer completed and persisted.");
            }
            catch (Exception e)
            {
                result = cu.serverStatusString(ConsoleUtility.Status.Failure, "Some error : " + e.Message);
            }

            return result;
        }

        [HttpGet]
        [Route("getAllZonesSummary")]
        public Object getAllZonesSummary()
        {
            cu.logTime("/getAllZonesSummary");
            string status = cu.serverStatusString(ConsoleUtility.Status.Initialized);
            List<Object> zones = new List<Object>();

            try
            {
                IFormatter formatter = new BinaryFormatter();
                SentiersStructure sentier;
                using (Stream stream = System.IO.File.Open(Path.GetFullPath("./sentierStructure.json"), FileMode.Open, FileAccess.Read))
                {
                    sentier = (SentiersStructure)formatter.Deserialize(stream);
                }

                foreach (Zone z in sentier.zones)
                {
                    zones.Add(new { name = z._id, mapCount = z.maps.Count });
                }
                if (zones.Count == 0)
                {
                    return cu.serverStatusString(ConsoleUtility.Status.Failure, "No trails were found. Upload some first using  POST /uploadTrails and a json body.");
                }
            }
            catch (Exception e)
            {
                return cu.serverStatusString(ConsoleUtility.Status.Error, " Something went wrong. Error stack : " + e.Message);
            }
            return zones;
        }

        [HttpGet]
        [Route("getSpecificZone")]
        public Object getSpecificZone(string IDZONE = null)
        {
            // initialisation
            cu.logTime("/getSpecificZone");
            string status = cu.serverStatusString(ConsoleUtility.Status.Initialized);
            Object requestedZone = null;

            if (IDZONE == null)
            {
                status = cu.serverStatusString(ConsoleUtility.Status.Failure, "IDZONE was not provided and is require for this query. Try adding ?IDZONE=<value> to the uri.");
                requestedZone = status;
                return requestedZone;
            }

            IFormatter formatter = new BinaryFormatter();
            SentiersStructure sentier;
            using (Stream stream = System.IO.File.Open(Path.GetFullPath("./sentierStructure.json"), FileMode.Open, FileAccess.Read))
            {
                sentier = (SentiersStructure)formatter.Deserialize(stream);
            }

            // permet le deplacement sur la liste de zone
            var it = sentier.zones.GetEnumerator();
            while (it.MoveNext())
            {

                // ToLower() les deux pour eviter de manquer le resultat sans le vouloir...
                // .Contains() car le nom peut être plus long que le _id. exemple: _id == "Brompt" et name == "Brompton"
                if (IDZONE.ToLower().Equals(it.Current._id.ToLower()))
                {
                    requestedZone = it.Current;
                    status = cu.serverStatusString(ConsoleUtility.Status.Success, "Zone was successfully found.");
                    break;
                }
            }
            // Si la valeur courante est pas la derniere et qu'il n'y a pas de prochaine valeur (donc fini la liste)
            if (sentier.zones.Last() != it.Current && !it.MoveNext())
            {
                status = cu.serverStatusString(ConsoleUtility.Status.Failure, String.Format("Could not find the zone with IDZONE: '{0}'", IDZONE));
                requestedZone = status;
            }
            return requestedZone;
        }

        [HttpGet]
        [Route("getStatus")]
        public string getStatus()
        {
            cu.logTime("/getStatus");
            // Le Timezone du serveur est quelque chose comme UTC -8. À quebec, c'est UTC -5

            // trouver le fichier
            var files = new DirectoryInfo(Path.GetFullPath("./Spreadsheets/")).GetFiles().OrderByDescending(x => x.LastWriteTime).Skip(0);
            
            // Sa date de modification forcée en UTC
            DateTime utcDate = System.IO.File.GetLastWriteTime(files.First().FullName).ToUniversalTime();
            
            // Creer le timezone pour quebec
            var timezoneQuebec = TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time");
            
            // Convertir la date avec le timezone créé
            var timeQuebec = TimeZoneInfo.ConvertTimeFromUtc(utcDate, timezoneQuebec);
            return timeQuebec.ToString(@"yyyy-MM-dd HH:mm");
        }

        [HttpGet]
        [Route("getPartners")]
        public ObjectResult getPartners() 
        {
            cu.logTime("/getPartners");
            string status = cu.serverStatusString(ConsoleUtility.Status.Initialized);
            
            // Chaque fois que je vais chercher un fichier, le placer dans un using stream pour eviter d'avoir des problemes d'acces au meme fichier en meme temps.
            IFormatter formatter = new BinaryFormatter();
            SentiersStructure sentier;
            using (Stream stream = System.IO.File.Open(Path.GetFullPath("./sentierStructure.json"), FileMode.Open, FileAccess.Read))
            {
                sentier = (SentiersStructure)formatter.Deserialize(stream);
            }

            if (sentier.partners is null)
                return StatusCode(204, sentier.partners);
            else
                return StatusCode(200, sentier.partners);
        }

        [HttpPost]
        [Route("authUser")]
        public ObjectResult authUser([FromBody] AuthStructure AS)
        {
            cu.logTime("/authUser");
            string result = null;
            //HttpResponse response = new HttpResponse();
            if (AS.loginType == "code")
            {
                result = udb.validateUserCredsHashJournalier(AS.logID, AS.hash, AS.permitNumber);
            }
            else if (AS.loginType == "membership")
            {
                result = udb.validateUserCredsHash(AS.logID, AS.userID, AS.hash);
                // 1 == connue et valide, 2 == comme 1 mais admin en plus // 0 == bonne syntaxe mais id + pw ne marchent pas
            }
            string token = null; // ajouter la cause d'erreur
            string state = cu.serverStatusString(ConsoleUtility.Status.Initialized);
                HttpRequestMessage rm = new HttpRequestMessage();
            cu.logStatus(result);
            if (result != "0") //  && result != "DEBUG"
            {
                if (result == "1")
                {
                    token = fb.CreateCustomToken(AS.deviceID, FB.userType.user); // 1st param should be [FromHeader] string uidClaim
                }
                else if (result == "2")
                {
                    if (AS.deviceID !=  "admin") // si le deviceID==admin, ca veut dire que c'est un admin sur Desktop
                        token = fb.CreateCustomToken(AS.deviceID, FB.userType.admin);
                }
                state = cu.serverStatusString(ConsoleUtility.Status.Success, "Authentification succeded.");
                Console.WriteLine(state);
                if (AS.deviceID == "admin") {
                    token = "Glorious authentication!";
                }
                
                // La classe StatusCode permet de definir un StatusCode ainsi que d'y passer un objet facilement dans le body. 
                return StatusCode(200, new { value = token });
            }
            else
            {
                state = cu.serverStatusString(ConsoleUtility.Status.Failure, "Unknown password/identifier pair.");
                Console.WriteLine(state);
                return StatusCode(401, new { value = state });
            }
        }


        [HttpGet] // 0 == most recent, 1 == 2nd to last, 2 == oldest file. -1 == template
        [Route("downloadFile")]
        public async Task<IActionResult> downloadFile(int VERSION = 0)
        {
            cu.logTime("/downloadFile");
            string status = cu.serverStatusString(ConsoleUtility.Status.Initialized);
            if (VERSION > 2)
                VERSION = 2;
            else if (VERSION < 0)
                VERSION = -1;

            string templatePath = Path.GetFullPath("./template.xlsx"); //changer pour le nom du 
            string newPath = Path.GetFullPath("./Spreadsheets/");

            MyFile file = new MyFile();

            try
            {
                if (VERSION >= 0)
                {
                    List<string> fileNames = new List<string>();
                    if (new DirectoryInfo(newPath).GetFiles().Count() == 0)
                        throw new Exception("Empty directory, serving Excel template.");
                    foreach (var fi in new DirectoryInfo(newPath.ToString()).GetFiles().OrderByDescending(x => x.LastWriteTime).Skip(0))
                        fileNames.Add(fi.FullName);

                    file = await CDN.GetFile(fileNames[VERSION]);
                }
            }
            catch (Exception e)
            {
                status = cu.serverStatusString(ConsoleUtility.Status.Failure, e.Message);
                file = await CDN.GetFile(templatePath);
            }

            // Si ca échoue ou que c'est vide, retourner le template.xlsx
            if (VERSION < 0)
            {
                file = await CDN.GetFile(templatePath);
            }
            return File(file.bytes, file.Ext, file.Name);
        }

        [HttpPost]
        [HttpOptions]
        [Route("uploadFile")]
        public async Task<string> /*IActionResult*/ UploadFiles([FromForm(Name = "spreadsheet")] IFormFile file)
        {
            // Initialisation
            cu.logTime("/uploadFile");
            string status = cu.serverStatusString(ConsoleUtility.Status.Initialized); // 


            // Path des ressources
            string newPath = Path.GetFullPath("./Spreadsheets/");

            // Calcul du nom sérialisé
            string inputName = file.FileName;
            string ext = inputName.Substring(inputName.LastIndexOf('.'), inputName.Length - inputName.LastIndexOf('.')); // recuperation de l'extension
            string date = DateTime.Now.ToString(@"yyyy-MM-dd") + ext;


            /* 
             * IMPORTANT
             * Vu que le nom du fichier est modifié à la date courrante, il peut y avoir un maximum d'une version par jour.
             * Il y aura 3 versions en mémoire en tout temps. 
             * Cela implique que si l'utilisateur fait plusieur remise en 1 journée, il en gardera que la plus récente.
             * Il supprimera toujours la plus ancienne version lorsque pour une journée donnée aucune remise n'a été fait.
             */

            // Récupération du fichier et copie. Si plus de 3 version, supprimer la plus vieille version.
            try
            {
                string filePath = Path.Combine(newPath, /*file.FileName*/date); // donnee un nom ici
                using (Stream fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                    status = cu.serverStatusString(ConsoleUtility.Status.Success, "File upload completed.");
                    foreach (var fi in new DirectoryInfo(newPath.ToString()).GetFiles().OrderByDescending(x => x.LastWriteTime).Skip(3))
                        fi.Delete();
                }
            }
            catch (IOException IOex)
            {
                status = cu.serverStatusString(ConsoleUtility.Status.Failure, "Upload failed: " + IOex.Message);
            }
            catch (System.NullReferenceException NRex) // Erreur non reconnue en mode DEBUG sur Visual Studio car il arrete le processus avant que ca ne se rende.
            {
                status = cu.serverStatusString(ConsoleUtility.Status.Error, "\nProbablement que la clef n'est pas bonne. Je l'ai nommée 'spreadsheet'. Essaies avec ca! Sinon;\n\n\u2022 Faut que ca soit dans le body.\n\u2022 Le type de content 'multipart/form-data'.\n\u2022 Le body soit en 'form-data' aussi.\n\n Error stack: " + NRex.Message);
            }
            catch (Exception ex)
            {
                status = cu.serverStatusString(ConsoleUtility.Status.Failure, "Upload failed: " + ex.Message);
            }
            return status;
        }
    }
}
