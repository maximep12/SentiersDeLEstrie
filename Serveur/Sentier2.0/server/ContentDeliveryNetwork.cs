using System.IO;
using System.Threading.Tasks;

namespace Sentier2._0
{
    public class ContentDeliveryNetwork
    {

        public async Task<MyFile> GetFile(string path)
        {
            var file = new MyFile();

            file.bytes = await System.IO.File.ReadAllBytesAsync(path); ;
            file.Name = Path.GetFileName(path);
            file.Ext = GetMimeTypes(Path.GetExtension(path));
            return file;
        }

        // Default Template for extensions.
        private static string GetMimeTypes(string ext)
        {
            switch (ext)
            {
                case ".txt": return "text/plain";
                case ".csv": return "text/csv";
                case ".pdf": return "application/pdf";
                case ".doc": return "application/vnd.ms-word";
                case ".xls": return "application/vnd.ms-excel";
                case ".ppt": return "application/vnd.ms-powerpoint";
                case ".docx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                case ".xlsx": return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                case ".pptx": return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
                case ".png": return "image/png";
                case ".jpg": return "image/jpeg";
                case ".jpeg": return "image/jpeg";
                case ".gif": return "image/gif";
                default: return "application/octet-stream";
            }
        }

    }

    public class MyFile
    {
        public string Name { get; set; }
        public string Path { get; set; }
        public string Ext { get; set; }
        public byte[] bytes { get; set; }
    }
}