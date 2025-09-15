
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace RestHotelAPI.Repository
{
    public class ImageService : IImageService
    {
        private readonly BlobServiceClient _blobServiceClient;
        private readonly string _defaultContainer;

        public ImageService(IConfiguration configuration)
        {
            var conn = configuration["AzureBlobSettings:ConnectionString"];
            _defaultContainer = configuration["AzureBlobSettings:ContainerName"];
            _blobServiceClient = new BlobServiceClient(conn);

        }

       

        public async Task<string> UploadImageAsync(IFormFile image)
            {
            var container = _blobServiceClient.GetBlobContainerClient(_defaultContainer);
            await container.CreateIfNotExistsAsync();

            await container.SetAccessPolicyAsync(PublicAccessType.Blob);

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
            var blob = container.GetBlobClient(fileName);


           
            var headers = new BlobHttpHeaders { ContentType = image.ContentType };

            using var stream = image.OpenReadStream();
            await blob.UploadAsync(stream, new BlobUploadOptions
            {
                HttpHeaders = headers
            });

            return blob.Uri.ToString();

               }

        public async Task<bool> DeleteImageAsync(string imageUrl)
        {
            if (string.IsNullOrWhiteSpace(imageUrl))
                return false;

            try
            {
                var uri = new Uri(imageUrl);
                var segments = uri.Segments; // ["/", "{container}/", "{blob...}"]
                if (segments.Length < 3)
                    return false;

                var containerName = segments[1].TrimEnd('/');
                var blobName = string.Concat(segments.Skip(2)); // يدعم مسارات طولية

                var container = _blobServiceClient.GetBlobContainerClient(containerName);
                var blob = container.GetBlobClient(blobName);

                var result = await blob.DeleteIfExistsAsync();
                return result.Value; // true إذا انحذفت
            }
            catch
            {
                return false;
            }
        }
    }
    
}
