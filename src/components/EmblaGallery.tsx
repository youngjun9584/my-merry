"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

interface EmblaGalleryProps {
  photos: string[];
  currentIndex: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export default function EmblaGallery({
  photos,
  currentIndex,
  onClose,
  onIndexChange,
}: EmblaGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    startIndex: currentIndex,
  });

  const [selectedIndex, setSelectedIndex] = useState(currentIndex);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [loadingProgress, setLoadingProgress] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const newIndex = emblaApi.selectedScrollSnap();
    setSelectedIndex(newIndex);
    onIndexChange(newIndex);
  }, [emblaApi, onIndexChange]);

  // 점진적 이미지 로딩
  const preloadImages = useCallback(async () => {
    const totalImages = photos.length;
    let loadedCount = 0;

    for (let i = 0; i < totalImages; i++) {
      // 현재 사진과 앞뒤 2장씩 우선 로딩
      const isNearCurrent = Math.abs(i - selectedIndex) <= 2;
      const isNearStart = i < 3;
      const isNearEnd = i >= totalImages - 3;

      if (isNearCurrent || isNearStart || isNearEnd) {
        // 우선순위 이미지는 즉시 로딩
        setLoadedImages((prev) => new Set([...prev, i]));
        loadedCount++;
        setLoadingProgress((loadedCount / totalImages) * 100);
      } else {
        // 나머지 이미지는 천천히 로딩 (500ms 간격)
        await new Promise((resolve) => setTimeout(resolve, 500));
        setLoadedImages((prev) => new Set([...prev, i]));
        loadedCount++;
        setLoadingProgress((loadedCount / totalImages) * 100);
      }
    }
  }, [photos.length, selectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  // 갤러리가 열릴 때 이미지 로딩 시작
  useEffect(() => {
    preloadImages();
  }, [preloadImages]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center overflow-hidden">
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-60 w-12 h-12 flex items-center justify-center text-2xl"
      >
        ×
      </button>

      {/* 사진 카운터 */}
      <div className="absolute top-4 left-4 text-white z-60 bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
        {selectedIndex + 1} / {photos.length}
      </div>

      {/* 이전 버튼 */}
      <button
        onClick={scrollPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-60 w-8 h-8 flex items-center justify-center text-2xl opacity-60 hover:opacity-100 transition-opacity"
      >
        ‹
      </button>

      {/* 다음 버튼 */}
      <button
        onClick={scrollNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-60 w-8 h-8 flex items-center justify-center text-2xl opacity-60 hover:opacity-100 transition-opacity"
      >
        ›
      </button>

      {/* Embla Carousel 컨테이너 */}
      <div className="embla w-full h-full" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="embla__slide flex-shrink-0 w-full h-full flex items-center justify-center p-4"
            >
              <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
                {loadedImages.has(index) ? (
                  <Image
                    src={photo}
                    alt={`Gallery ${index + 1}`}
                    fill
                    className="object-contain select-none"
                    quality={95}
                    sizes="100vw"
                    draggable={false}
                    unoptimized
                    priority={index === selectedIndex}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-lg">
                    <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
