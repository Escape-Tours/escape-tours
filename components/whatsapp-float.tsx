"use client"

export default function WhatsAppFloat() {       
  const handleClick = () => {
    const message = encodeURIComponent("Hello, I'm interested in booking a tour with Escape Tours")
    window.open(`https://wa.me/255666281717?text=${message}`, "_blank")
  }

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 w-14 h-14 md:w-16 md:h-16 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
      aria-label="Contact us on WhatsApp"
    >
      <svg viewBox="0 0 32 32" fill="currentColor" className="w-8 h-8 md:w-10 md:h-10">
        <path d="M16.002 0C7.164 0 0 7.164 0 16c0 2.828.736 5.484 2.016 7.784L.696 30.472l6.912-1.812A15.923 15.923 0 0016.002 32C24.84 32 32 24.836 32 16S24.84 0 16.002 0zm0 29.336c-2.548 0-4.94-.708-6.976-1.936l-.5-.296-5.188 1.36 1.384-5.056-.324-.52A13.27 13.27 0 012.664 16c0-7.364 5.972-13.336 13.336-13.336S29.336 8.636 29.336 16 23.364 29.336 16.002 29.336z" />
        <path d="M23.504 19.14c-.408-.204-2.412-1.192-2.788-1.328-.376-.136-.648-.204-.92.204-.272.408-1.056 1.328-1.296 1.6-.24.272-.48.308-.888.104-.408-.204-1.724-.636-3.284-2.028-1.216-1.084-2.036-2.424-2.276-2.832-.24-.408-.024-.628.18-.832.184-.184.408-.48.612-.72.204-.24.272-.408.408-.68.136-.272.068-.512-.032-.72-.104-.204-.92-2.216-1.26-3.036-.332-.8-.668-.692-.92-.704-.236-.012-.508-.016-.78-.016s-.716.104-1.092.512c-.376.408-1.436 1.404-1.436 3.424s1.472 3.972 1.676 4.244c.204.272 2.884 4.404 6.988 6.176.976.424 1.74.676 2.336.864.98.312 1.872.268 2.576.164.788-.116 2.412-.988 2.752-1.94.34-.952.34-1.768.24-1.94-.104-.172-.376-.272-.784-.476z" />
      </svg>
    </button>
  )
}