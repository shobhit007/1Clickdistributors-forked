import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

const ManualSwiper = ({ place = "manufacturer" }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);
  const containerRef = useRef(null);

  const getImagesForUserPanel = async () => {
    try {
      let token = localStorage.getItem("authToken");
      let API_URL = `${process.env.NEXT_PUBLIC_BASEURL}/service/manufacturer/getLeadPanelImages`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ place }),
      });

      let data = await response.json();
      if (!data.success) {
        return toast.error(data.message || "Something went wrong");
      }
      return data.data || [];
    } catch (error) {
      console.log("error in getlead panel images", error.message);
    } finally {
    }
  };

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["lead_panel_pictures", place],
    queryFn: getImagesForUserPanel,
  });

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === data.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? data.length - 1 : prev - 1));
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
    setIsDragging(true);
    setDragPosition(0);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentPosition = e.touches[0].clientX;
    const diff = currentPosition - touchStart;
    setDragPosition(diff);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const minSwipeDistance = 50;
    if (Math.abs(dragPosition) > minSwipeDistance) {
      if (dragPosition > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
    setDragPosition(0);
  };

  const handleMouseDown = (e) => {
    setTouchStart(e.clientX);
    setIsDragging(true);
    setDragPosition(0);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentPosition = e.clientX;
    const diff = currentPosition - touchStart;
    setDragPosition(diff);
  };

  const handleMouseUp = () => {
    handleTouchEnd();
  };

  useEffect(() => {
    if (!data?.length) return;
    const timer = setInterval(() => {
      if (!isDragging) nextSlide();
    }, 10000);

    return () => clearInterval(timer);
  }, [isDragging, data]);

  if (isLoading) {
    return <img className="h-12 object-cover mt-5" src="/loader.gif" />;
  }

  if (!data?.length)
    return (
      <div>
        <button onClick={refetch}>Refetch</button>
      </div>
    );

  return (
    <div className="relative w-full h-full group">
      {/* Main Image Container */}
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden rounded-lg cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="absolute w-full h-full transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(calc(-${
              currentSlide * 100
            }% + ${dragPosition}px))`,
            transition: isDragging ? "none" : "transform 500ms ease-in-out",
          }}
        >
          {data?.map((item, index) => (
            <div
              key={index}
              className="absolute top-0 left-0 w-full h-full"
              style={{ left: `${index * 100}%` }}
            >
              <img
                src={item.url}
                alt={item.heading}
                className="object-cover w-full h-full"
              />
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                <h3 className="text-white text-xl font-semibold">
                  {item.heading}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center 
                 bg-black/30 hover:bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        ←
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center 
                 bg-black/30 hover:bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        →
      </button>

      {/* Slide Counter */}
      <div className="absolute bottom-2 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
        {currentSlide + 1} / {data.length}
      </div>
    </div>
  );
};

export default ManualSwiper;
