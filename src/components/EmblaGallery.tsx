"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState, useRef } from "react";

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
  });

  const [selectedIndex, setSelectedIndex] = useState(currentIndex);
  const [loadedImages] = useState<Set<number>>(
    new Set(Array.from({ length: photos.length }, (_, i) => i))
  ); // 모든 이미지 로드된 것으로 간주 (프리로드 컴포넌트가 처리)

  const isFirstRenderRef = useRef(true);
  const prevCurrentIndexRef = useRef(currentIndex);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // 닫기 핸들러 최적화
  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    },
    [onClose]
  );

  // 이전/다음 버튼 핸들러 최적화
  const handlePrev = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      scrollPrev();
    },
    [scrollPrev]
  );

  const handleNext = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      scrollNext();
    },
    [scrollNext]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const newIndex = emblaApi.selectedScrollSnap();
    setSelectedIndex(newIndex);
    onIndexChange(newIndex);
  }, [emblaApi, onIndexChange]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // emblaApi가 준비되고 처음 렌더링될 때 currentIndex로 이동
  useEffect(() => {
    if (!emblaApi) return;

    if (isFirstRenderRef.current) {
      console.log(`📸 Embla 초기화 - 사진 ${currentIndex + 1}번으로 즉시 이동`);
      // 즉시 이동 (애니메이션 없이)
      emblaApi.scrollTo(currentIndex, true);
      setSelectedIndex(currentIndex);
      isFirstRenderRef.current = false;
      prevCurrentIndexRef.current = currentIndex;
    }
  }, [emblaApi, currentIndex]);

  // currentIndex prop이 변경될 때마다 스크롤
  useEffect(() => {
    if (!emblaApi || isFirstRenderRef.current) return;

    if (prevCurrentIndexRef.current !== currentIndex) {
      console.log(
        `📸 currentIndex 변경 감지: ${prevCurrentIndexRef.current + 1} → ${
          currentIndex + 1
        }`
      );
      emblaApi.scrollTo(currentIndex, false);
      setSelectedIndex(currentIndex);
      prevCurrentIndexRef.current = currentIndex;
    }
  }, [emblaApi, currentIndex]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-[9999] flex items-center justify-center overflow-hidden">
      {/* 닫기 버튼 */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-[10000] w-12 h-12 flex items-center justify-center text-3xl bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-opacity cursor-pointer"
        style={{ pointerEvents: "auto" }}
        type="button"
        aria-label="갤러리 닫기"
      >
        ×
      </button>

      {/* 사진 카운터 */}
      <div className="absolute top-4 left-4 text-white z-[10000] bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm pointer-events-none">
        {selectedIndex + 1} / {photos.length}
      </div>

      {/* 이전 버튼 */}
      <button
        onClick={handlePrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-[10000] w-12 h-12 flex items-center justify-center text-3xl opacity-60 hover:opacity-100 transition-opacity bg-black bg-opacity-30 rounded-full cursor-pointer"
        style={{ pointerEvents: "auto" }}
        type="button"
        aria-label="이전 사진"
      >
        ‹
      </button>

      {/* 다음 버튼 */}
      <button
        onClick={handleNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-[10000] w-12 h-12 flex items-center justify-center text-3xl opacity-60 hover:opacity-100 transition-opacity bg-black bg-opacity-30 rounded-full cursor-pointer"
        style={{ pointerEvents: "auto" }}
        type="button"
        aria-label="다음 사진"
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
