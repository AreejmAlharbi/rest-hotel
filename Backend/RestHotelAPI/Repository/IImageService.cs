namespace RestHotelAPI.Repository
{
    public interface IImageService
    {
        Task<string> UploadImageAsync(IFormFile image);
        Task<bool> DeleteImageAsync(string imageUrl);

    }
}
