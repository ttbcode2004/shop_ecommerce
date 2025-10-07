import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { slides } from "../../../config";

export default function ShoppingHero() {
  const [current, setCurrent] = useState(0);
  const startX = useRef(null);
  const isDragging = useRef(false);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (startX.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX.current - endX;
    if (diff > 50) nextSlide(); // swipe left
    if (diff < -50) prevSlide(); // swipe right
    startX.current = null;
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX;
  };

  const handleMouseUp = (e) => {
    if (!isDragging.current) return;
    const endX = e.clientX;
    const diff = startX.current - endX;
    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();
    isDragging.current = false;
    startX.current = null;
  };

  return (
    <div
      className="w-full mt-18 0 z-10"
    >
      <div className="w-full ">
        <div
          className="relative w-full h-[300px] sm:h-[400px] md:h-[560px] overflow-hidden group shadow-lg hover:cursor-pointer"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full h-full transition-opacity ease-in-out duration-700 
                ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
            >
              <img
                src={slide.image}
                alt={slide.slogan}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70 flex flex-col items-center justify-center space-y-4 px-4 sm:px-10">
                <h1 className="text-white text-xl sm:text-3xl md:text-4xl font-bold drop-shadow-lg text-center select-none pointer-events-none">
                  {slide.slogan}
                </h1>
                <p className="text-white/90 sm:w-full w-60 text-sm sm:text-lg md:text-xl max-w-2xl text-center drop-shadow-md select-none pointer-events-none">
                  {slide.description}
                </p>
                <button
                  className="bg-white text-black font-semibold px-6 py-2 rounded-full shadow-md hover:bg-gray-400 transition "
                  onClick={() => {
                    const el = document.getElementById(slide.id);
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth" });
                    } 
                  }}
                >
                  Xem ngay
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-3 -translate-y-1/2 hover:text-white text-gray-400 p-2 rounded-full transition z-20"
          >
            <ChevronLeft size={40} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-3 -translate-y-1/2 hover:text-white text-gray-400 p-2 rounded-full transition z-20"
          >
            <ChevronRight size={40} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-2.5 h-2.5 rounded-full transition ${
                  current === index
                    ? "bg-white"
                    : "bg-white/50 hover:bg-white/80"
                }`}
              ></button>
            ))}
          </div>
      
        </div>
      </div>
    </div>
  );
}
