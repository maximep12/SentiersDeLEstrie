using System;

namespace Sentier2._0
{
    public class ConsoleUtility
    {
        public enum Status
        {
            Success,
            Failure,
            Error,
            Initialized // always initialize to Initialized.
        }

        public ConsoleUtility() { }
        public void logTime(string str)
        {
            Console.WriteLine(DateTime.Now.ToString("yyyy-MM-dd HH:mm") + ", " + str + " called.");
        }

        public void logStatus(string str)
        {
            Console.WriteLine(DateTime.Now.ToString("yyyy-MM-dd HH:mm") + ", " + str);
        }

        public string serverStatusString(Status st, string message = "")
        {
            string status = "[SERVER:] "; // Swtich case?
            switch (st)
            {
                case Status.Success:
                    status += "Success — ";
                    break;
                case Status.Failure:
                    status += "Failure — ";
                    break;
                case Status.Error:
                    status += "Error — ";
                    break;
                case Status.Initialized:
                    status += "Failure — Initialized function, but never went through...";
                    break;
                default:
                    status += "Say what now? — ConsoleUtility.serverStatusString() broke, received: case " + st;
                    break;
            }

            status += message;

            return status;
        }
    }
}
