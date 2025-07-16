using System.Threading.Tasks;

namespace evisa.Services
{
    public class PaymentService
    {
        // Burada gerçek ödeme API'sine HTTP POST isteği gönderebilirsin
        public async Task<bool> PayAsync(decimal amount, string cardNumber, string expiry, string cvc)
        {
            // Dummy: Her zaman başarılı döndürüyor
            await Task.Delay(500); // Simulate API call
            return !string.IsNullOrEmpty(cardNumber) && cardNumber.Length == 16;
        }
    }
}