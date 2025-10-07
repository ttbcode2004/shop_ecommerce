import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react";

import men from "../../../assets/men.jpg"
import men2 from "../../../assets/men2.jpg"
import women from "../../../assets/women.jpg"
import women2 from "../../../assets/women2.jpg"
import kid from "../../../assets/kid.jpg"
import store1 from "../../../assets/store1.avif"
import store2 from "../../../assets/store2.avif"
import store3 from "../../../assets/store3.avif"
import store4 from "../../../assets/store4.avif"
import store5 from "../../../assets/store5.avif"
import Title from "../../ui/Title"

const faceIcon = [men, women, men2, women2, kid]
const stores = [store1, store2, store3, store4, store5]

export default function ShoppingReview() {
  const [current, setCurrent] = useState(0)
  const startX = useRef(null)
  const isDragging = useRef(false)

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? stores.length - 1 : prev - 1))
  }

  const nextSlide = () => {
    setCurrent((prev) => (prev === stores.length - 1 ? 0 : prev + 1))
  }

  // Swipe Mobile
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (startX.current === null) return
    const endX = e.changedTouches[0].clientX
    const diff = startX.current - endX
    if (diff > 50) nextSlide()
    if (diff < -50) prevSlide()
    startX.current = null
  }

  // Drag Desktop
    const handleMouseDown = (e) => {
        isDragging.current = true
        startX.current = e.clientX
    }

    const handleMouseMove = (e) => {
        if (!isDragging.current) return
        const diff = startX.current - e.clientX
        if (diff > 50) {
            nextSlide()
            isDragging.current = false
        }
        if (diff < -50) {
            prevSlide()
            isDragging.current = false
        }
    }

    const handleMouseUp = () => {
        isDragging.current = false
        startX.current = null
    }


  return (
    <div className="w-full md:px-10 lg:px-12 px-6 mt-12">
      <Title>ĐÁNH GIÁ</Title>

      {/* Avatar overlap */}
      <div className="flex items-center mt-6">
        {faceIcon.map((icon, i) => (
          <img
            key={i}
            src={icon}
            alt={`face-${i}`}
            className="w-12 h-12 rounded-full border-2 border-gray-300 object-cover hover:scale-110 transition -ml-3 first:ml-0"
          />
        ))}
        <span className="ml-2 text-gray-800 font-semibold">+999</span>
      </div>

      {/* Nội dung review */}
      <div className="max-w-3xl mx-auto text-center mt-8">
        <p className="text-lg italic text-gray-600">
          “Mua hàng ở đây rất hài lòng! Chất lượng sản phẩm tốt, giao hàng nhanh và
          dịch vụ chăm sóc khách hàng tuyệt vời.”
        </p>
        <p className="mt-2 font-semibold text-gray-800">— Người dùng hài lòng</p>
      </div>

      {/* Store Slider */}
      <div
        className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden group shadow-lg hover:cursor-pointer rounded-sm"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}  // phòng trường hợp kéo ra ngoài
      >
        {stores.map((store, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out 
              ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          >
            <img
              src={store}
              alt={`store-${index}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Nút điều hướng */}
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

        {/* Dot indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {stores.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition ${
                current === index
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/80"
              }`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  )
}
