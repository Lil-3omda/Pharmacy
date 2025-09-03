using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pharmacy.Application.Services
{
    public interface IBarcodeService
    {
        string GenerateBarcode();
        byte[] GenerateBarcodeImage(string barcodeText);
        string ReadBarcode(byte[] imageData);
    }

    public class BarcodeService : IBarcodeService
    {
        public string GenerateBarcode()
        {
            // Generate a unique barcode using timestamp and random number
            var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString();
            var random = new Random().Next(1000, 9999).ToString();
            return $"PH{timestamp}{random}";
        }

        public byte[] GenerateBarcodeImage(string barcodeText)
        {
            var writer = new BarcodeWriter
            {
                Format = BarcodeFormat.CODE_128,
                Options = new EncodingOptions
                {
                    Width = 300,
                    Height = 100,
                    Margin = 10
                }
            };

            using var bitmap = writer.Write(barcodeText);
            using var stream = new MemoryStream();
            bitmap.Save(stream, ImageFormat.PNG);
            return stream.ToArray();
        }

        public string ReadBarcode(byte[] imageData)
        {
            var reader = new BarcodeReader();
            using var stream = new MemoryStream(imageData);
            using var bitmap = new Bitmap(stream);

            var result = reader.Decode(bitmap);
            return result?.Text;
        }
    }
}
