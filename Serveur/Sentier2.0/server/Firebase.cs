using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;
using System.Collections.Generic;
namespace Sentier2._0
{
    public sealed class FB
    {
        private static FB instance = null;

        public enum userType
        {
            user = 1,
            admin = 2,
            test = 3
        }

        private GoogleCredential Credential { get; set; }
        private FirebaseApp fbInstance { get; set; }
        private FirebaseAuth fbAuth { get; set; }


        private FB()
        {
            try
            {
                fbInstance = FirebaseApp.Create(new AppOptions()
                {
                    Credential = GoogleCredential.FromFile("adminKey.json")
                });

                fbAuth = FirebaseAuth.GetAuth(fbInstance);

            }
            catch
            {

            }
        }

        public static FB getFirebaseInstance()
        {
            if (instance == null)
            {
                instance = new FB();
            }
            return instance;
        }

        public string CreateCustomToken(string uid, userType uType)
        {
            var additionalClaims = new Dictionary<string, object> {
                {"userType", uType},
            };
            return fbAuth.CreateCustomTokenAsync(uid, additionalClaims).GetAwaiter().GetResult();
        }

    }
}
