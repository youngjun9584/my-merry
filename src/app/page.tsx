"use client";

// 네이버지도 API 타입 선언
/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    naver: {
      maps: {
        LatLng: new (lat: number, lng: number) => any;
        Map: new (mapDiv: string | HTMLElement, mapOptions?: any) => any;
        Marker: new (markerOptions: any) => any;
        InfoWindow: new (infoWindowOptions: any) => any;
        Size: new (width: number, height: number) => any;
        Point: new (x: number, y: number) => any;
        Event: {
          addListener: (
            target: any,
            type: string,
            listener: () => void
          ) => void;
        };
        MapTypeControlStyle: any;
        Position: any;
        ZoomControlStyle: any;
      };
    };
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

import {
  Heart,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  Phone,
  Menu,
  Copy,
  Check,
  MessageCircle,
} from "lucide-react";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Script from "next/script";
import Image from "next/image";
import GuestbookModal from "@/components/GuestbookModal";

interface GuestbookEntry {
  idx: number;
  name: string;
  content: string;
}

interface GalleryPhoto {
  id: number;
  src: string;
  caption: string;
  likes: number;
  isLiked: boolean;
}

// Intersection Observer 훅
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
        ...options,
      }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [options]);

  return [ref, isIntersecting] as const;
};

export default function WeddingInvitation() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 방명록 페이지네이션 관련 state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  // 각 섹션의 Intersection Observer
  const [calendarRef, calendarVisible] = useIntersectionObserver();
  const [coupleInfoRef, coupleInfoVisible] = useIntersectionObserver();
  const [accountRef, accountVisible] = useIntersectionObserver();
  const [weddingImageRef, weddingImageVisible] = useIntersectionObserver();
  const [locationRef, locationVisible] = useIntersectionObserver();
  const [guestbookRef, guestbookVisible] = useIntersectionObserver();
  const [footerRef, footerVisible] = useIntersectionObserver();

  // 드롭다운 상태 관리
  const [groomDropdownOpen, setGroomDropdownOpen] = useState(false);
  const [brideDropdownOpen, setBrideDropdownOpen] = useState(false);

  // 실제 파일명 매핑 (데이터베이스 img_id와 매치) - 상수이므로 변경되지 않음
  const PHOTO_FILE_NAMES = useMemo(
    () => [
      "IMG_4919",
      "IMG_4981",
      "IMG_5097",
      "IMG_5127",
      "IMG_5282",
      "IMG_5355",
      "IMG_5573",
      "IMG_5667",
      "IMG_5853",
      "IMG_6080",
      "IMG_6104",
      "IMG_6145",
      "IMG_6303",
      "IMG_6391",
      "IMG_6473",
      "IMG_6484",
      "IMG_6766",
      "IMG_6800",
      "IMG_6910",
      "IMG_7025",
    ],
    []
  );

  // 갤러리 관련 state
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // 지도 관련 state
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // 주소 복사 관련 state
  const [isCopied, setIsCopied] = useState(false);

  // 스크롤 이동 함수
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 80; // 네비게이션 바 높이
      const targetPosition = element.offsetTop - navHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
    // 모바일 메뉴 닫기
    setIsMobileMenuOpen(false);
  };
  const [photos, setPhotos] = useState<GalleryPhoto[]>([
    {
      id: 1,
      src: "https://edi-img.s3.ap-northeast-2.amazonaws.com/uploads/merry/IMG_4919.JPG",
      caption: "우리의 소중한 순간 💕",
      likes: 24,
      isLiked: false,
    },
    {
      id: 2,
      src: "https://edi-img.s3.ap-northeast-2.amazonaws.com/uploads/merry/IMG_4981.JPG",
      caption: "함께한 달콤한 시간 📸",
      likes: 31,
      isLiked: true,
    },
    {
      id: 3,
      src: "https://edi-img.s3.ap-northeast-2.amazonaws.com/uploads/merry/IMG_5097.JPG",
      caption: "행복한 우리 🌸",
      likes: 18,
      isLiked: false,
    },
    {
      id: 4,
      src: "https://edi-img.s3.ap-northeast-2.amazonaws.com/uploads/merry/IMG_5127.JPG",
      caption: "사랑스러운 날들 💍",
      likes: 42,
      isLiked: true,
    },
    {
      id: 5,
      src: "https://edi-img.s3.ap-northeast-2.amazonaws.com/uploads/merry/IMG_5282.JPG",
      caption: "특별한 추억 👰",
      likes: 38,
      isLiked: false,
    },
    {
      id: 6,
      src: "https://edi-img.s3.ap-northeast-2.amazonaws.com/uploads/merry/IMG_5355.JPG",
      caption: "영원히 기억할 순간 ✨",
      likes: 27,
      isLiked: false,
    },
    {
      id: 7,
      src: "https://edi-img.s3.ap-northeast-2.amazonaws.com/uploads/merry/IMG_5573.JPG",
      caption: "둘만의 시간 🥰",
      likes: 35,
      isLiked: true,
    },
    {
      id: 8,
      src: "https://edi-img.s3.ap-northeast-2.amazonaws.com/uploads/merry/IMG_5667.JPG",
      caption: "함께 걸어온 길 🚶‍♀️🚶‍♂️",
      likes: 22,
      isLiked: false,
    },
    {
      id: 9,
      src: "https://edi-img.s3.ap-northeast-2.amazonaws.com/uploads/merry/IMG_5853.JPG",
      caption: "웃음 가득한 하루 😊",
      likes: 29,
      isLiked: false,
    },
    {
      id: 10,
      src: "https://edi-img.s3.ap-northeast-2.amazonaws.com/uploads/merry/IMG_6080.JPG",
      caption: "행복한 미래를 향해 🌅",
      likes: 33,
      isLiked: true,
    },
    {
      id: 11,
      src: "https://edi-img.s3.ap-northeast-2.amazonaws.com/uploads/merry/IMG_6104.JPG",
      caption: "서로를 바라보는 눈빛 👀",
      likes: 19,
      isLiked: false,
    },
    {
      id: 12,
      src: "https://edi-img.s3.ap-northeast-2.amazonaws.com/uploads/merry/IMG_6145.JPG",
      caption: "달콤한 순간들 🍯",
      likes: 45,
      isLiked: true,
    },
    {
      id: 13,
      src: "https://edi-img.s3.ap-northeast-2.amazonaws.com/uploads/merry/IMG_6303.JPG",
      caption: "함께하는 모든 시간 ⏰",
      likes: 26,
      isLiked: false,
    },
    {
      id: 14,
      src: "https://edi-img.s3.ap-northeast-2.amazonaws.com/uploads/merry/IMG_6391.JPG",
      caption: "사랑이 가득한 하루 💖",
      likes: 37,
      isLiked: true,
    },
    {
      id: 15,
      src: "https://edi-img.s3.ap-northeast-2.amazonaws.com/uploads/merry/IMG_6473.JPG",
      caption: "두근거리는 마음 💓",
      likes: 41,
      isLiked: false,
    },
    {
      id: 16,
      src: "https://edi-img.s3.ap-northeast-2.amazonaws.com/uploads/merry/IMG_6484.JPG",
      caption: "영원한 약속 💒",
      likes: 52,
      isLiked: true,
    },
    {
      id: 17,
      src: "https://edi-img.s3.ap-northeast-2.amazonaws.com/uploads/merry/IMG_6766.JPG",
      caption: "소중한 추억 만들기 📝",
      likes: 28,
      isLiked: false,
    },
    {
      id: 18,
      src: "https://edi-img.s3.ap-northeast-2.amazonaws.com/uploads/merry/IMG_6800.JPG",
      caption: "함께라서 행복해 🤗",
      likes: 34,
      isLiked: true,
    },
    {
      id: 19,
      src: "https://edi-img.s3.ap-northeast-2.amazonaws.com/uploads/merry/IMG_6910.JPG",
      caption: "새로운 시작 🌱",
      likes: 39,
      isLiked: false,
    },
    {
      id: 20,
      src: "https://edi-img.s3.ap-northeast-2.amazonaws.com/uploads/merry/IMG_7025.JPG",
      caption: "평생 함께할 우리 💑",
      likes: 48,
      isLiked: true,
    },
  ]);

  const weddingDate = useMemo(() => new Date("2025-12-20T15:20:00"), []);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // 실시간 카운트다운 계산
  useEffect(() => {
    const calculateTimeLeft = () => {
      const currentDate = new Date();
      const difference = weddingDate.getTime() - currentDate.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // 즉시 실행
    calculateTimeLeft();

    // 1초마다 업데이트
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [weddingDate]);

  const daysUntil = timeLeft.days;

  // 방명록 데이터 로드
  const fetchGuestbook = useCallback(async () => {
    console.log("방명록 데이터 로드 요청");
    setIsLoading(true);

    try {
      const response = await fetch("/api/guestbook");
      if (response.ok) {
        const data = await response.json();
        setGuestbookEntries(data);
        // 새 데이터 로드 시 첫 페이지로 이동
        setCurrentPage(0);
      } else {
        console.error("방명록 로드 실패");
        setGuestbookEntries([]);
      }
    } catch (error) {
      console.error("방명록 로드 중 오류:", error);
      setGuestbookEntries([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 새 방명록 추가
  const handleSubmitGuestbook = async (formData: {
    name: string;
    content: string;
  }) => {
    console.log("방명록 작성 요청:", formData);

    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("방명록 작성 완료");
        // 방명록 목록 새로고침
        await fetchGuestbook();
      } else {
        const error = await response.json();
        throw new Error(error.error || "방명록 작성에 실패했습니다.");
      }
    } catch (error) {
      console.error("방명록 작성 중 오류:", error);
      throw error;
    }
  };

  // 갤러리 사진 데이터와 좋아요 수 로드
  const fetchPhotosWithLikes = useCallback(async () => {
    try {
      const response = await fetch("/api/photos");
      if (response.ok) {
        const photosData = await response.json();

        // 기존 photos 배열과 API 데이터 병합
        setPhotos((prevPhotos) =>
          prevPhotos.map((photo, index) => {
            const fileName = PHOTO_FILE_NAMES[index];
            const photoData = photosData.find(
              (p: { img_id: string; like_count: number }) =>
                p.img_id === fileName
            );
            return {
              ...photo,
              likes: photoData?.like_count || photo.likes,
            };
          })
        );
      }
    } catch (error) {
      console.error("갤러리 데이터 로드 중 오류:", error);
    }
  }, [PHOTO_FILE_NAMES]);

  const addLike = useCallback(
    async (photoId: number) => {
      const photoIndex = photos.findIndex((p) => p.id === photoId);

      const imgId = PHOTO_FILE_NAMES[photoIndex];

      // 즉시 UI 업데이트 (Optimistic Update)
      setPhotos((prevPhotos) =>
        prevPhotos.map((photo) =>
          photo.id === photoId
            ? {
                ...photo,
                likes: photo.likes + 1,
                isLiked: true, // 하트 표시
              }
            : photo
        )
      );

      try {
        const response = await fetch(`/api/photos/${imgId}`, {
          method: "PUT",
        });

        if (response.ok) {
          const updatedPhoto = await response.json();

          // 서버 응답으로 정확한 좋아요 수 업데이트
          setPhotos((prevPhotos) =>
            prevPhotos.map((photo) =>
              photo.id === photoId
                ? {
                    ...photo,
                    likes: updatedPhoto.like_count,
                    isLiked: true,
                  }
                : photo
            )
          );
        } else {
          // 실패 시 이전 상태로 되돌리기
          setPhotos((prevPhotos) =>
            prevPhotos.map((photo) =>
              photo.id === photoId
                ? {
                    ...photo,
                    likes: photo.likes - 1,
                    isLiked: false,
                  }
                : photo
            )
          );
        }
      } catch (error) {
        console.error("좋아요 업데이트 중 오류:", error);
        // 에러 발생 시 이전 상태로 되돌리기
        setPhotos((prevPhotos) =>
          prevPhotos.map((photo) =>
            photo.id === photoId
              ? {
                  ...photo,
                  likes: photo.likes - 1,
                  isLiked: false,
                }
              : photo
          )
        );
      }
    },
    [photos, PHOTO_FILE_NAMES]
  );

  const openGalleryModal = useCallback((index: number) => {
    setCurrentPhotoIndex(index);
    setIsGalleryModalOpen(true);
  }, []);

  const closeGalleryModal = useCallback(() => {
    setIsGalleryModalOpen(false);
  }, []);

  const nextPhoto = useCallback(() => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const prevPhoto = useCallback(() => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // 키보드 이벤트 처리 (갤러리 모달)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isGalleryModalOpen) return;

      if (e.key === "ArrowLeft") {
        prevPhoto();
      } else if (e.key === "ArrowRight") {
        nextPhoto();
      } else if (e.key === "Escape") {
        closeGalleryModal();
      }
    };

    if (isGalleryModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isGalleryModalOpen, prevPhoto, nextPhoto, closeGalleryModal]);

  // 모바일 메뉴 외부 클릭 처리
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isMobileMenuOpen) return;

      const target = event.target as HTMLElement;
      const mobileNav = document.querySelector("[data-mobile-nav]");
      const menuButton = document.querySelector("[data-menu-button]");

      // 메뉴 네비게이션 영역이나 메뉴 버튼을 클릭한 경우가 아니면 닫기
      if (
        mobileNav &&
        !mobileNav.contains(target) &&
        menuButton &&
        !menuButton.contains(target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isMobileMenuOpen]);

  // 네이버 클라우드 플랫폼 Maps API 초기화
  const initNaverMap = useCallback(() => {
    console.log("🗺️ NCP Maps API 초기화 시작...");

    // 기존 API 사용 (새로운 API로 전환 예정)
    console.log("✅ 네이버지도 API 사용 가능");

    if (!window.naver || !window.naver.maps) {
      console.error("❌ NCP Maps API가 로드되지 않았습니다.");
      return;
    }

    // 웨딩홀 위치 (샹제리제센터 A동 - 테헤란로 406) - 네이버지도 정확한 좌표
    const weddingLocation = new window.naver.maps.LatLng(
      37.5043884,
      127.0499893
    );

    const mapOptions = {
      center: weddingLocation,
      zoom: 16,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: window.naver.maps.MapTypeControlStyle.BUTTON,
        position: window.naver.maps.Position.TOP_RIGHT,
      },
      zoomControl: true,
      zoomControlOptions: {
        style: window.naver.maps.ZoomControlStyle.SMALL,
        position: window.naver.maps.Position.TOP_LEFT,
      },
      logoControl: false,
      mapDataControl: false,
      scaleControl: false,
    };

    try {
      const map = new window.naver.maps.Map("naverMap", mapOptions);
      console.log("✅ NCP 지도 생성 완료");

      // 지도 로드 완료 이벤트
      window.naver.maps.Event.addListener(map, "init", () => {
        console.log("🎉 NCP 지도 초기화 완료!");
        setIsMapLoaded(true);
      });

      // 마커 생성
      const marker = new window.naver.maps.Marker({
        position: weddingLocation,
        map: map,
        title: "샹제리제센터 A동 1층, 2층",
        icon: {
          content: `
            <div style="background: #e91e63; color: white; padding: 8px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-align: center; box-shadow: 0 2px 8px rgba(233,30,99,0.3); white-space: nowrap;">
              💒 샹제리제센터
            </div>
          `,
          size: new window.naver.maps.Size(100, 40),
          anchor: new window.naver.maps.Point(50, 40),
        },
      });

      // 정보창 생성
      const infoWindow = new window.naver.maps.InfoWindow({
        content: `
          <div style="padding: 12px; font-family: 'Malgun Gothic', sans-serif; min-width: 200px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h3 style="margin: 0 0 8px 0; color: #333; font-size: 14px; font-weight: bold;">💒 샹제리제센터 A동 1층, 2층</h3>
            <p style="margin: 0 0 4px 0; color: #666; font-size: 12px;">📍 서울 강남구 테헤란로 406</p>
            <p style="margin: 0 0 4px 0; color: #666; font-size: 12px;">👰🤵 용준 & 이슬의 결혼식</p>
            <p style="margin: 0 0 4px 0; color: #e91e63; font-size: 12px; font-weight: bold;">🗓️ 2025.12.20 (토) 오후 3:20</p>
            <p style="margin: 0; color: #666; font-size: 11px;">📞 02-1588-0100 | 🚇 선릉역 1번출구</p>
          </div>
        `,
        borderWidth: 0,
        disableAnchor: true,
      });

      // 마커 클릭 시 정보창 표시
      window.naver.maps.Event.addListener(marker, "click", () => {
        if (infoWindow.getMap()) {
          infoWindow.close();
        } else {
          infoWindow.open(map, marker);
        }
      });

      // 1초 후에 정보창 자동으로 열기
      setTimeout(() => {
        infoWindow.open(map, marker);
        console.log("✅ 정보창 열기 완료");
      }, 1000);

      console.log("🎉 모든 NCP 지도 설정 완료!");
    } catch (error) {
      console.error("❌ NCP 지도 초기화 오류:", error);
    }
  }, []);

  // 네이버지도 스크립트 로드 완료 시 실행
  const handleMapScriptLoad = useCallback(() => {
    setIsMapLoaded(true);
    initNaverMap();
  }, [initNaverMap]);

  // 주소 복사 함수
  const copyAddress = async () => {
    const address = "서울 강남구 테헤란로 406";
    try {
      await navigator.clipboard.writeText(address);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // 2초 후 복사 상태 초기화
    } catch (error) {
      console.error("주소 복사 실패:", error);
      // 브라우저가 clipboard API를 지원하지 않는 경우 대체 방법
      const textArea = document.createElement("textarea");
      textArea.value = address;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (fallbackError) {
        console.error("대체 복사 방법도 실패:", fallbackError);
      }
      document.body.removeChild(textArea);
    }
  };

  // 컴포넌트 마운트 시 방명록과 갤러리 데이터 로드
  useEffect(() => {
    fetchGuestbook();
    fetchPhotosWithLikes();
  }, [fetchGuestbook, fetchPhotosWithLikes]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - 메인 이미지 */}
      <div className="relative h-screen w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/img/IMG_4981.JPG"
          alt="용준 & 이슬"
          className="w-full h-full object-cover"
        />
      </div>

      {/* PC & Mobile Navigation */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur-md shadow-sm z-50 border-b border-gray-200">
        {/* PC Navigation - 큰 화면에서만 표시 */}
        <div className="hidden md:block">
          <div className="max-w-4xl mx-auto px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="text-gray-900 font-medium text-lg">
                용준 & 이슬
              </div>
              <div className="flex space-x-8">
                {[
                  { id: "info", label: "예식 안내" },
                  { id: "gallery", label: "갤러리" },
                  { id: "rsvp", label: "참석 정보" },
                  { id: "account", label: "마음 전하실 곳" },
                  { id: "location", label: "오시는 길" },
                  { id: "guestbook", label: "축하 메세지" },
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="text-gray-800 hover:text-gray-900 transition-colors text-sm font-medium"
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation - 작은 화면에서만 표시 */}
        <div className="md:hidden relative" data-mobile-nav>
          <div className="max-w-md mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <div className="text-gray-900 font-medium text-lg">
                용준 & 이슬
              </div>
              <button
                data-menu-button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          <div
            className={`absolute top-full left-0 right-0 bg-white shadow-2xl z-50 border-b border-gray-100 transition-all duration-300 ease-out ${
              isMobileMenuOpen
                ? "opacity-100 translate-y-0 visible"
                : "opacity-0 -translate-y-4 invisible"
            }`}
          >
            <div className="max-w-md mx-auto">
              <div className="grid grid-cols-2 gap-1 p-4">
                {[
                  { id: "gallery", label: "갤러리", icon: "🖼️" },
                  { id: "info", label: "예식 안내", icon: "💒" },
                  { id: "rsvp", label: "참석 정보", icon: "✅" },
                  { id: "account", label: "마음 전하실 곳", icon: "💝" },
                  { id: "location", label: "오시는 길", icon: "🗺️" },
                  { id: "guestbook", label: "축하 메세지", icon: "💌" },
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="flex items-center space-x-3 p-4 rounded-xl hover:bg-stone-50 transition-all duration-200 text-left border border-transparent hover:border-stone-200 hover:shadow-sm"
                  >
                    <span className="text-xl">{section.icon}</span>
                    <span className="text-gray-800 font-medium text-sm">
                      {section.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="px-4 pb-4">
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-3"></div>
                <div className="text-center text-xs text-gray-500">
                  메뉴를 선택해주세요
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - 메인 이미지 */}
      <div className="relative h-[300px] w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/img/time.PNG"
          alt="용준 & 이슬"
          className="w-full h-full object-cover"
        />

        {/* Hero 내용 오버레이 */}
        <div className="absolute inset-0 bg-black/30 flex  justify-center">
          <div className="text-center text-white px-6 pt-10">
            <div className="text-xs text-white/90 mb-2 tracking-wider">
              2025. 12. 20.
            </div>
            <div className="text-3xl md:text-4xl font-light text-white mb-4 tracking-wide">
              <span className="font-semibold">용준</span>
              <span className="text-white/80 mx-3">&</span>
              <span className="font-semibold">이슬</span>
            </div>

            {/* D-Day Counter */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 mx-auto max-w-xs shadow-lg border border-gray-200">
              <div className="text-gray-800 text-sm mb-1 font-medium">
                결혼식까지
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {daysUntil > 0 ? `D-${daysUntil}` : "D-DAY"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PC & Mobile Container */}
      <div className="max-w-md md:max-w-4xl mx-auto pb-8">
        {/* Info Section - 예식 안내 */}
        <section id="info" className="px-0 md:px-8 mb-20 md:mb-32">
          <div className="space-y-8 md:space-y-12">
            {/* Invitation Message */}
            <div className="bg-white rounded-none md:rounded-2xl p-6 md:p-12 text-center max-w-3xl mx-auto shadow-sm border border-gray-100">
              <div className="text-2xl md:text-3xl font-light text-gray-800 mb-6">
                INVITATION
              </div>
              <h2 className="text-2xl md:text-4xl font-medium text-gray-800 mb-8">
                소중한 분들을 초대합니다
              </h2>
              <div className="space-y-6 text-gray-600 text-sm md:text-base leading-relaxed">
                <p>두 사람이 하나가 될 새 인생을 시작합니다.</p>
                <p>
                  사랑으로 가득 채워
                  <br />
                  즐거움은 나누고 어려움은 이겨내는
                  <br />
                  함께 나아가는 삶을 꾸리겠습니다.
                </p>
                <p>
                  언제나 저희 곁에 있어주신 소중한 분들과
                  <br />
                  함께 첫 시작을 내딛고 싶습니다.
                  <br />
                  특별하고 의미있는 하루에 함께하시어
                </p>
                <p className="text-gray-800 font-medium">
                  저희의 시작을 축복해주세요.
                </p>
              </div>
            </div>

            {/* 웨딩 이미지 섹션 */}
            <div
              ref={weddingImageRef}
              className={`transition-all duration-1000 ${
                weddingImageVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="max-w-2xl mx-auto">
                <div className="relative overflow-hidden">
                  <Image
                    src="/img/gray_front.PNG"
                    alt="Wedding Moment"
                    width={800}
                    height={450}
                    className="w-full h-auto object-cover"
                    style={{ aspectRatio: "16/9" }}
                    priority
                  />
                </div>
              </div>
            </div>

            {/* 달력 & 카운트다운 섹션 */}
            <div
              ref={calendarRef}
              className={`bg-white rounded-none md:rounded-2xl p-6 md:p-10 max-w-md mx-auto shadow-sm border border-gray-100 transition-all duration-1000 ${
                calendarVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="text-center space-y-6">
                {/* 날짜 표시 */}
                <div className="space-y-2">
                  <div className="text-2xl font-light text-gray-800 tracking-wider">
                    2025.12.20
                  </div>
                  <div className="text-sm text-gray-500">
                    토요일 오후 3시 20분
                  </div>
                </div>

                {/* 달력 */}
                <div className="py-6">
                  {/* 요일 헤더 */}
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {["일", "월", "화", "수", "목", "금", "토"].map(
                      (day, index) => (
                        <div
                          key={day}
                          className={`w-8 h-8 flex items-center justify-center text-xs font-medium ${
                            index === 0
                              ? "text-red-400"
                              : index === 6
                              ? "text-blue-400"
                              : "text-gray-600"
                          }`}
                        >
                          {day}
                        </div>
                      )
                    )}
                  </div>

                  {/* 달력 그리드 */}
                  <div className="grid grid-cols-7 gap-1">
                    {/* 2025년 12월 달력 생성 */}
                    {(() => {
                      const year = 2025;
                      const month = 11; // 12월 (0부터 시작)
                      const firstDay = new Date(year, month, 1).getDay(); // 12월 1일 요일 (일요일=0)
                      const daysInMonth = new Date(
                        year,
                        month + 1,
                        0
                      ).getDate(); // 12월의 총 일수
                      const calendarDays = [];

                      // 이전 달의 빈 칸들 추가
                      for (let i = 0; i < firstDay; i++) {
                        calendarDays.push(
                          <div key={`empty-${i}`} className="w-8 h-8"></div>
                        );
                      }

                      // 12월 날짜들 추가
                      for (let date = 1; date <= daysInMonth; date++) {
                        const currentDate = new Date(year, month, date);
                        const dayOfWeek = currentDate.getDay();
                        const isWeddingDay = date === 20;
                        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // 일요일(0) 또는 토요일(6)
                        const isSunday = dayOfWeek === 0;

                        calendarDays.push(
                          <div
                            key={date}
                            className={`
                              relative w-8 h-8 flex items-center justify-center text-sm font-medium
                              ${
                                isWeddingDay
                                  ? "bg-red-400 text-white rounded-full shadow-lg"
                                  : isSunday
                                  ? "text-red-400"
                                  : isWeekend
                                  ? "text-blue-400"
                                  : "text-gray-700"
                              }
                              ${isWeddingDay ? "animate-pulse z-10" : ""}
                              transition-all duration-200
                            `}
                          >
                            {date}
                            {isWeddingDay && (
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                            )}
                          </div>
                        );
                      }

                      return calendarDays;
                    })()}
                  </div>
                </div>

                {/* 실시간 카운트다운 */}
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-3 text-center">
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:bg-gray-100 transition-colors">
                      <div className="text-xl font-bold text-gray-800">
                        {timeLeft.days}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        DAY
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:bg-gray-100 transition-colors">
                      <div className="text-xl font-bold text-gray-800">
                        {timeLeft.hours.toString().padStart(2, "0")}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        HOUR
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:bg-gray-100 transition-colors">
                      <div className="text-xl font-bold text-gray-800">
                        {timeLeft.minutes.toString().padStart(2, "0")}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        MIN
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:bg-gray-100 transition-colors">
                      <div className="text-xl font-bold text-red-400">
                        {timeLeft.seconds.toString().padStart(2, "0")}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        SEC
                      </div>
                    </div>
                  </div>

                  {/* D-Day 메시지 */}
                  <div className="text-center">
                    <div className="text-sm text-gray-600 leading-relaxed">
                      용준, 이슬의 결혼식이
                      <br />
                      <span className="text-red-400 font-medium text-base">
                        {timeLeft.days}일
                      </span>{" "}
                      남았습니다. 💕
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 신랑신부 정보 */}
            <div
              ref={coupleInfoRef}
              className={`bg-white rounded-none md:rounded-2xl p-6 md:p-10 max-w-5xl mx-auto shadow-sm border border-gray-100 transition-all duration-1000 ${
                coupleInfoVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="grid grid-cols-2 gap-8 md:gap-16">
                {/* 신랑측 */}
                <div className="text-center space-y-6">
                  <div className="text-lg font-medium text-gray-800 mb-6">
                    신랑
                  </div>

                  {/* 신랑 정보 */}
                  <div className="space-y-3">
                    <div className="text-2xl md:text-3xl font-light text-gray-800">
                      용준
                    </div>
                    <div className="text-lg text-gray-600">박용준</div>
                    <div className="flex justify-center space-x-4 mt-3">
                      <button
                        onClick={() => window.open("tel:010-1234-5678")}
                        className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                        title="전화걸기"
                      >
                        <Phone className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => window.open("sms:010-1234-5678")}
                        className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                        title="문자보내기"
                      >
                        <MessageCircle className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* 삼각형 구분선 */}
                  <div className="flex justify-center">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-300"></div>
                  </div>

                  {/* 신랑 측 혼주 */}
                  <div className="space-y-4">
                    <div className="text-sm text-gray-500">신랑 측 혼주</div>

                    {/* 아버지 */}
                    <div className="space-y-2">
                      <div className="text-base text-gray-700">
                        아버지 박문식
                      </div>
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => window.open("tel:010-9876-5432")}
                          className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
                          title="전화걸기"
                        >
                          <Phone className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => window.open("sms:010-9876-5432")}
                          className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
                          title="문자보내기"
                        >
                          <MessageCircle className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* 어머니 */}
                    <div className="space-y-2">
                      <div className="text-base text-gray-700">
                        어머니 노영임
                      </div>
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => window.open("tel:010-8765-4321")}
                          className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
                          title="전화걸기"
                        >
                          <Phone className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => window.open("sms:010-8765-4321")}
                          className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
                          title="문자보내기"
                        >
                          <MessageCircle className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 신부측 */}
                <div className="text-center space-y-6">
                  <div className="text-lg font-medium text-gray-800 mb-6">
                    신부
                  </div>

                  {/* 신부 정보 */}
                  <div className="space-y-3">
                    <div className="text-2xl md:text-3xl font-light text-gray-800">
                      이슬
                    </div>
                    <div className="text-lg text-gray-600">김이슬</div>
                    <div className="flex justify-center space-x-4 mt-3">
                      <button
                        onClick={() => window.open("tel:010-2468-1357")}
                        className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                        title="전화걸기"
                      >
                        <Phone className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => window.open("sms:010-2468-1357")}
                        className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                        title="문자보내기"
                      >
                        <MessageCircle className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* 삼각형 구분선 */}
                  <div className="flex justify-center">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-300"></div>
                  </div>

                  {/* 신부 측 혼주 */}
                  <div className="space-y-4">
                    <div className="text-sm text-gray-500">신부 측 혼주</div>

                    {/* 아버지 */}
                    <div className="space-y-2">
                      <div className="text-base text-gray-700">
                        아버지 김도수
                      </div>
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => window.open("tel:010-1357-2468")}
                          className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
                          title="전화걸기"
                        >
                          <Phone className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => window.open("sms:010-1357-2468")}
                          className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
                          title="문자보내기"
                        >
                          <MessageCircle className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* 어머니 */}
                    <div className="space-y-2">
                      <div className="text-base text-gray-700">
                        어머니 박언자
                      </div>
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => window.open("tel:010-3691-2580")}
                          className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
                          title="전화걸기"
                        >
                          <Phone className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => window.open("sms:010-3691-2580")}
                          className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
                          title="문자보내기"
                        >
                          <MessageCircle className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="px-0 md:px-8 mb-20 md:mb-32">
          <div className="bg-white rounded-none md:rounded-2xl p-6 md:p-8 text-center max-w-4xl mx-auto shadow-sm border border-gray-100">
            <div className="text-xl md:text-2xl font-light text-gray-800 mb-4">
              GALLERY
            </div>
            <h2 className="text-2xl md:text-3xl font-medium text-gray-800 mb-6 md:mb-8">
              우리의 소중한 순간
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
              {photos.slice(0, 8).map((photo, index) => (
                <div
                  key={photo.id}
                  className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    className="w-full h-full object-cover"
                    onClick={() => openGalleryModal(index)}
                  />

                  {/* 좋아요 오버레이 */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                    <div className="absolute bottom-2 right-2 flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addLike(photo.id);
                        }}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors pointer-events-auto"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            photo.isLiked
                              ? "text-red-500 fill-current"
                              : "text-gray-600"
                          }`}
                        />
                      </button>
                      <div className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs text-gray-800 font-medium">
                        {photo.likes}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="px-6 py-3 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors border border-gray-300"
              onClick={() => openGalleryModal(0)}
            >
              사진 더보기
            </button>
          </div>
        </section>
        {/* Account Section */}
        <section id="account" className="py-16 px-4">
          <div
            ref={accountRef}
            className={`max-w-md mx-auto text-center transition-all duration-1000 ${
              accountVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* 구분선 */}
            <div className="w-16 h-0.5 bg-black mx-auto mb-8"></div>

            <h2 className="text-lg font-medium text-gray-800 mb-4">
              마음 전하실 곳
            </h2>
            <div className="text-gray-600 text-sm leading-relaxed mb-12 space-y-1">
              <p>참석이 어려우신 분들을 위해 기재했습니다</p>
              <p>너그러운 마음으로 양해 부탁드립니다</p>
            </div>

            <div className="space-y-4">
              {/* 신랑측에게 드롭다운 */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setGroomDropdownOpen(!groomDropdownOpen)}
                  className="w-full p-4 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-700 font-medium">신랑측에게</span>
                  <ChevronRight
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      groomDropdownOpen ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {groomDropdownOpen && (
                  <div className="p-4 space-y-3 bg-gray-50">
                    {/* 신랑 */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div className="text-sm text-gray-600">신랑</div>
                        <div className="text-sm font-medium text-gray-800">
                          박용준
                        </div>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-xs text-gray-500">토스뱅크</div>
                        <div className="flex items-center gap-2">
                          <Copy className="w-4 h-4 text-gray-400" />
                          <div className="w-8 h-6 bg-yellow-400 rounded text-black text-xs flex items-center justify-center font-bold">
                            Pay
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700">
                        123-456-789012
                      </div>
                    </div>

                    {/* 신랑 아버지 */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div className="text-sm text-gray-600">신랑 아버지</div>
                        <div className="text-sm font-medium text-gray-800">
                          박문식
                        </div>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-xs text-gray-500">토스뱅크</div>
                        <div className="flex items-center gap-2">
                          <Copy className="w-4 h-4 text-gray-400" />
                          <div className="w-8 h-6 bg-yellow-400 rounded text-black text-xs flex items-center justify-center font-bold">
                            Pay
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700">
                        123-456-789012
                      </div>
                    </div>

                    {/* 신랑 어머니 */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div className="text-sm text-gray-600">신랑 어머니</div>
                        <div className="text-sm font-medium text-gray-800">
                          김영숙
                        </div>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-xs text-gray-500">토스뱅크</div>
                        <div className="flex items-center gap-2">
                          <Copy className="w-4 h-4 text-gray-400" />
                          <div className="w-8 h-6 bg-yellow-400 rounded text-black text-xs flex items-center justify-center font-bold">
                            Pay
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700">
                        123-456-789012
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 신부측에게 드롭다운 */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setBrideDropdownOpen(!brideDropdownOpen)}
                  className="w-full p-4 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-700 font-medium">신부측에게</span>
                  <ChevronRight
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      brideDropdownOpen ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {brideDropdownOpen && (
                  <div className="p-4 space-y-3 bg-gray-50">
                    {/* 신부 */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div className="text-sm text-gray-600">신부</div>
                        <div className="text-sm font-medium text-gray-800">
                          김이슬
                        </div>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-xs text-gray-500">토스뱅크</div>
                        <div className="flex items-center gap-2">
                          <Copy className="w-4 h-4 text-gray-400" />
                          <div className="w-8 h-6 bg-yellow-400 rounded text-black text-xs flex items-center justify-center font-bold">
                            Pay
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700">
                        123-456-789012
                      </div>
                    </div>

                    {/* 신부 아버지 */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div className="text-sm text-gray-600">신부 아버지</div>
                        <div className="text-sm font-medium text-gray-800">
                          김도수
                        </div>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-xs text-gray-500">토스뱅크</div>
                        <div className="flex items-center gap-2">
                          <Copy className="w-4 h-4 text-gray-400" />
                          <div className="w-8 h-6 bg-yellow-400 rounded text-black text-xs flex items-center justify-center font-bold">
                            Pay
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700">
                        123-456-789012
                      </div>
                    </div>

                    {/* 신부 어머니 */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div className="text-sm text-gray-600">신부 어머니</div>
                        <div className="text-sm font-medium text-gray-800">
                          이영희
                        </div>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-xs text-gray-500">토스뱅크</div>
                        <div className="flex items-center gap-2">
                          <Copy className="w-4 h-4 text-gray-400" />
                          <div className="w-8 h-6 bg-yellow-400 rounded text-black text-xs flex items-center justify-center font-bold">
                            Pay
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700">
                        123-456-789012
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section id="location" className="px-0 md:px-8 mb-20 md:mb-32">
          <div
            ref={locationRef}
            className={`bg-white rounded-none md:rounded-2xl p-6 md:p-8 text-center max-w-3xl mx-auto shadow-sm border border-gray-100 transition-all duration-1000 ${
              locationVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="text-xl md:text-2xl font-light text-gray-800 mb-4">
              LOCATION
            </div>
            <h2 className="text-2xl md:text-3xl font-medium text-gray-800 mb-6">
              오시는 길
            </h2>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="text-gray-800 font-medium text-lg md:text-xl mb-2">
                이미지?
              </div>
              <div className="flex items-center justify-center mb-2">
                <div
                  className="text-gray-600 text-sm md:text-base cursor-pointer hover:text-gray-800 transition-colors"
                  onClick={copyAddress}
                >
                  서울 강남구 테헤란로 406
                  <br />
                  <span className="text-xs text-gray-500">
                    (역삼동, 샹제리제센터)
                  </span>
                </div>
                <button
                  onClick={copyAddress}
                  className={`ml-3 p-2 rounded-lg transition-all duration-200 ${
                    isCopied
                      ? "bg-green-100 text-green-600"
                      : "bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                  title="주소 복사"
                >
                  {isCopied ? (
                    <div className="flex items-center space-x-1">
                      <Check className="w-4 h-4" />
                      <span className="text-xs">복사됨!</span>
                    </div>
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="text-gray-500 text-xs md:text-sm">
                📞 02-1588-0100 | 🅿️ 주차 가능 | 🚇 선릉역 1번출구
              </div>
            </div>

            <div className="relative h-48 md:h-64 bg-gray-100 rounded-xl overflow-hidden mb-6">
              <div id="naverMap" className="w-full h-full" />
              {!isMapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="text-center p-4">
                    {/* 정적 지도 이미지 (대체 방안) */}
                    <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
                      <MapPin className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                      <div
                        className="text-xs text-gray-600 mb-2 cursor-pointer hover:text-gray-800 transition-colors flex items-center justify-center gap-1"
                        onClick={copyAddress}
                        title="주소 복사"
                      >
                        서울 강남구 테헤란로 406
                        <Copy className="w-3 h-3" />
                      </div>
                    </div>

                    <div className="text-gray-600 text-xs mb-3">
                      지도를 불러오는 중입니다...
                    </div>

                    {/* 외부 지도 링크 */}
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() =>
                          window.open(
                            "https://map.naver.com/p/search/샹제리제센터 테헤란로 406",
                            "_blank"
                          )
                        }
                        className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                      >
                        네이버지도
                      </button>
                      <button
                        onClick={() =>
                          window.open(
                            "https://tmap.life/route/search?name=샹제리제센터&addr=서울 강남구 테헤란로 406",
                            "_blank"
                          )
                        }
                        className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                      >
                        T맵
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() =>
                  window.open(
                    "https://map.naver.com/p/search/샹제리제센터 테헤란로 406",
                    "_blank"
                  )
                }
                className="py-3 md:py-4 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors text-sm md:text-base border border-gray-300"
              >
                <MapPin className="w-4 h-4 md:w-5 md:h-5 inline mr-1 md:mr-2" />
                네이버 길찾기
              </button>
              <button
                onClick={() =>
                  window.open(
                    "https://tmap.life/route/search?name=샹제리제센터&addr=서울 강남구 테헤란로 406",
                    "_blank"
                  )
                }
                className="py-3 md:py-4 bg-gray-500 text-white rounded-xl font-medium hover:bg-gray-600 transition-colors text-sm md:text-base border border-gray-300"
              >
                <MapPin className="w-4 h-4 md:w-5 md:h-5 inline mr-1 md:mr-2" />
                T맵 길찾기
              </button>
            </div>
          </div>
        </section>

        {/* Guestbook Section */}
        <section id="guestbook" className="px-0 md:px-8 mb-20 md:mb-32">
          <div
            ref={guestbookRef}
            className={`bg-gray-50 rounded-none md:rounded-2xl p-6 md:p-8 text-center max-w-2xl mx-auto transition-all duration-1000 ${
              guestbookVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="text-4xl font-light text-gray-800 mb-6 tracking-wider">
              MESSAGE
            </div>
            <p className="text-gray-600 text-base mb-8 leading-relaxed">
              저희 둘에게 따뜻한 방명록을 남겨주세요
            </p>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-4 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-all duration-300 mb-8"
            >
              메시지 남기기
            </button>

            {/* 메시지 목록 */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="text-gray-600">방명록을 불러오는 중...</div>
                </div>
              ) : guestbookEntries.length > 0 ? (
                <div className="space-y-6">
                  {/* 현재 페이지의 메시지들 */}
                  <div className="space-y-4">
                    {guestbookEntries
                      .slice(
                        currentPage * itemsPerPage,
                        (currentPage + 1) * itemsPerPage
                      )
                      .map((entry, index) => (
                        <div
                          key={entry.idx}
                          className={`bg-white rounded-lg p-6 shadow-sm border border-gray-100 text-left transition-all ${
                            guestbookVisible
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-10"
                          }`}
                          style={{
                            transitionDelay: guestbookVisible
                              ? `${(index + 2) * 100}ms`
                              : "0ms",
                            transitionDuration: "600ms",
                          }}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start space-x-3">
                              <div className="text-xl">😊</div>
                              <div className="flex-1">
                                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                  {entry.content}
                                </p>
                              </div>
                            </div>
                            <div className="text-xs text-gray-400 whitespace-nowrap ml-4">
                              2025.04.24 18:52
                            </div>
                          </div>
                          <div className="flex justify-start">
                            <span className="text-xs text-gray-500">
                              From {entry.name}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* 페이지네이션 */}
                  {Math.ceil(guestbookEntries.length / itemsPerPage) > 1 && (
                    <div className="flex justify-center items-center space-x-4 pt-6">
                      <button
                        onClick={() =>
                          setCurrentPage(Math.max(0, currentPage - 1))
                        }
                        disabled={currentPage === 0}
                        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <div className="flex space-x-2 items-center">
                        {Array.from({
                          length: Math.ceil(
                            guestbookEntries.length / itemsPerPage
                          ),
                        }).map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentPage(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                              currentPage === index
                                ? "bg-gray-500 scale-125"
                                : "bg-gray-300 hover:bg-gray-400"
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={() =>
                          setCurrentPage(
                            Math.min(
                              Math.ceil(
                                guestbookEntries.length / itemsPerPage
                              ) - 1,
                              currentPage + 1
                            )
                          )
                        }
                        disabled={
                          currentPage ===
                          Math.ceil(guestbookEntries.length / itemsPerPage) - 1
                        }
                        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">💌</div>
                  <div className="text-gray-600 text-lg font-medium mb-2">
                    첫 번째 축하 메시지를 기다리고 있어요
                  </div>
                  <div className="text-gray-500 text-sm">
                    소중한 마음을 전해주세요
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <footer
          ref={footerRef}
          className={`text-center mt-12 px-0 md:px-4 py-8 bg-white rounded-none md:rounded-2xl shadow-sm border border-gray-100 transition-all duration-1000 ${
            footerVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-gray-800 text-lg font-medium mb-2">
            언제나 곁을 따뜻하게 지켜주신 모든 분들께 감사드립니다.
          </div>
          <div className="text-gray-700 text-base mb-4 font-medium">
            박용준 & 김이슬
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors border border-gray-300">
              카카오톡 공유하기
            </button>
            <button className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors border border-gray-300">
              링크 복사하기
            </button>
          </div>

          <div className="text-xs text-gray-600">
            Copyright 2022-2025.퍼스트레터.All rights reserved.
          </div>
        </footer>
      </div>

      {/* Guestbook Modal */}
      <GuestbookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitGuestbook}
      />

      {/* Gallery Modal */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="relative w-full h-full max-w-2xl mx-auto flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeGalleryModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Previous Button */}
            <button
              onClick={prevPhoto}
              className="absolute left-4 z-10 w-12 h-12 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={nextPhoto}
              className="absolute right-4 z-10 w-12 h-12 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Photo Container */}
            <div className="flex items-center justify-center w-full h-full p-4">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photos[currentPhotoIndex].src}
                  alt={photos[currentPhotoIndex].caption}
                  className="max-w-full max-h-full object-contain"
                />

                {/* Photo Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="text-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => addLike(photos[currentPhotoIndex].id)}
                          className="transition-transform hover:scale-110"
                        >
                          <Heart
                            className={`w-6 h-6 ${
                              photos[currentPhotoIndex].isLiked
                                ? "text-red-500 fill-current"
                                : "text-white"
                            }`}
                          />
                        </button>
                        <span className="text-sm">
                          좋아요 {photos[currentPhotoIndex].likes}개
                        </span>
                      </div>
                      <span className="text-sm opacity-70">
                        {currentPhotoIndex + 1} / {photos.length}
                      </span>
                    </div>
                    <p className="text-sm">
                      <span className="font-medium">용준 & 이슬</span>{" "}
                      {photos[currentPhotoIndex].caption}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 네이버 클라우드 플랫폼 Maps API 스크립트 */}
      <Script
        src="https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=d5ancr9p5b"
        strategy="lazyOnload"
        onLoad={handleMapScriptLoad}
        onError={(error) => {
          console.error("❌ Maps API 스크립트 로드 실패:", error);
        }}
      />
    </div>
  );
}
