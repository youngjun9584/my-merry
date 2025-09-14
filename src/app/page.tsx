"use client";

// 네이버지도 API 타입 선언
declare global {
  interface Window {
    naver: {
      maps: {
        LatLng: new (lat: number, lng: number) => any;
        Map: new (mapDiv: string | HTMLElement, mapOptions?: any) => any;
        Marker: new (markerOptions: any) => any;
        InfoWindow: new (infoWindowOptions: any) => any;
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

import {
  Heart,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  Phone,
  UserCheck,
  Flower,
  Menu,
  Copy,
  Check,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import Script from "next/script";
import GuestbookModal from "@/components/GuestbookModal";

interface GuestbookEntry {
  id: number;
  name: string;
  relationship?: string;
  message: string;
  to: string;
  createdAt: string;
}

interface GalleryPhoto {
  id: number;
  src: string;
  caption: string;
  likes: number;
  isLiked: boolean;
}

export default function WeddingInvitation() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      src: "/img/IMG_5355.jpg",
      caption: "우리의 소중한 순간 💕",
      likes: 24,
      isLiked: false,
    },
    {
      id: 2,
      src: "/img/IMG_6303.jpg",
      caption: "함께한 달콤한 시간 📸",
      likes: 31,
      isLiked: true,
    },
    {
      id: 3,
      src: "/img/IMG_6145.jpg",
      caption: "행복한 우리 🌸",
      likes: 18,
      isLiked: false,
    },
    {
      id: 4,
      src: "/img/IMG_6104.jpg",
      caption: "사랑스러운 날들 💍",
      likes: 42,
      isLiked: true,
    },
    {
      id: 5,
      src: "/img/IMG_5853.jpg",
      caption: "특별한 추억 👰",
      likes: 38,
      isLiked: false,
    },
    {
      id: 6,
      src: "/img/IMG_5573.jpg",
      caption: "영원히 기억할 순간 ✨",
      likes: 27,
      isLiked: false,
    },
    {
      id: 7,
      src: "/img/IMG_5282.jpg",
      caption: "둘만의 시간 🥰",
      likes: 35,
      isLiked: true,
    },
    {
      id: 8,
      src: "/img/IMG_4981.jpg",
      caption: "함께 걸어온 길 🚶‍♀️🚶‍♂️",
      likes: 22,
      isLiked: false,
    },
    {
      id: 9,
      src: "/img/IMG_5097.jpg",
      caption: "웃음 가득한 하루 😊",
      likes: 29,
      isLiked: false,
    },
    {
      id: 10,
      src: "/img/IMG_5127.jpg",
      caption: "행복한 미래를 향해 🌅",
      likes: 33,
      isLiked: true,
    },
  ]);

  const weddingDate = new Date("2025-12-20T15:20:00");
  const currentDate = new Date();
  const daysUntil = Math.ceil(
    (weddingDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
  );

  // 방명록 데이터 로드
  const fetchGuestbook = useCallback(async () => {
    console.log("방명록 데이터 로드 요청");
    setIsLoading(true);

    // 임시 데이터로 테스트
    setTimeout(() => {
      console.log("방명록 데이터 로드 완료");
      setGuestbookEntries([]);
      setIsLoading(false);
    }, 500);
  }, []);

  // 새 방명록 추가
  const handleSubmitGuestbook = async (formData: {
    name: string;
    relationship: string;
    message: string;
    to: string;
    password: string;
  }) => {
    console.log("방명록 작성 요청:", formData);

    // 임시로 성공했다고 가정
    console.log("방명록 작성 완료");

    // 방명록 목록 새로고침
    await fetchGuestbook();
  };

  // 갤러리 관련 함수들
  const toggleLike = useCallback((photoId: number) => {
    setPhotos((prevPhotos) =>
      prevPhotos.map((photo) =>
        photo.id === photoId
          ? {
              ...photo,
              isLiked: !photo.isLiked,
              likes: photo.isLiked ? photo.likes - 1 : photo.likes + 1,
            }
          : photo
      )
    );
  }, []);

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

  // 컴포넌트 마운트 시 방명록 로드
  useEffect(() => {
    fetchGuestbook();
  }, [fetchGuestbook]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-100 to-amber-50">
      {/* Hero Section - 메인 이미지 */}
      <div className="relative h-screen w-full">
        <img
          src="/img/IMG_4981.JPG"
          alt="용준 & 이슬"
          className="w-full h-full object-cover"
        />
      </div>

      {/* PC & Mobile Navigation */}
      <nav className="sticky top-0 bg-white/90 backdrop-blur-md shadow-sm z-50 border-b border-stone-200">
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
      <div className="relative h-screen w-full">
        <img
          src="/img/IMG_4981.JPG"
          alt="용준 & 이슬"
          className="w-full h-full object-cover"
        />

        {/* Hero 내용 오버레이 */}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center text-white px-6 md:px-8">
            <div className="text-xs text-white/90 mb-3 tracking-wider font-medium">
              2025. 12. 20.
            </div>
            <div className="text-sm md:text-base text-white/90 mb-8 tracking-widest font-medium">
              JOIN US IN CELEBRATING OUR WEDDING
            </div>
            <div className="text-4xl md:text-6xl font-light text-white mb-8 md:mb-12 tracking-wide">
              <span className="font-semibold">용준</span>
              <span className="text-white/80 mx-3 md:mx-6">&</span>
              <span className="font-semibold">이슬</span>
            </div>

            {/* D-Day Counter */}
            <div className="bg-white/90 backdrop-blur-sm rounded-none md:rounded-2xl p-4 md:p-8 mx-0 md:mx-auto max-w-md shadow-lg">
              <div className="text-gray-800 text-lg md:text-xl mb-2 font-medium">
                용준 & 이슬의 결혼식까지
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900">
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
            <div className="bg-white rounded-none md:rounded-2xl p-6 md:p-12 text-center max-w-3xl mx-auto shadow-lg">
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

            {/* 신랑신부 정보 */}
            <div className="bg-white rounded-none md:rounded-2xl p-6 md:p-10 max-w-3xl mx-auto shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-2">신랑측</div>
                  <div className="text-gray-800 mb-4">
                    <div className="text-xs md:text-sm text-gray-600 mb-1">
                      박문식 · 노영임
                    </div>
                    <div className="text-sm text-gray-500">의아들</div>
                  </div>
                  <div className="text-2xl md:text-3xl font-light text-gray-800">
                    용준
                  </div>
                  <div className="text-lg md:text-xl text-gray-800 mt-2">
                    박용준
                  </div>
                  <button className="mt-3 text-gray-500 text-xs md:text-sm hover:text-gray-800 transition-colors">
                    전화로 축하 인사하기{" "}
                    <Phone className="w-3 h-3 inline ml-1" />
                  </button>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-2">신부측</div>
                  <div className="text-gray-800 mb-4">
                    <div className="text-xs md:text-sm text-gray-600 mb-1">
                      김도수 · 박언자
                    </div>
                    <div className="text-sm text-gray-500">의딸</div>
                  </div>
                  <div className="text-2xl md:text-3xl font-light text-gray-800">
                    이슬
                  </div>
                  <div className="text-lg md:text-xl text-gray-800 mt-2">
                    김이슬
                  </div>
                  <button className="mt-3 text-gray-500 text-xs md:text-sm hover:text-gray-800 transition-colors">
                    전화로 축하 인사하기{" "}
                    <Phone className="w-3 h-3 inline ml-1" />
                  </button>
                </div>
              </div>
            </div>

            {/* Wedding Day Info */}
            <div className="bg-white rounded-none md:rounded-2xl p-6 md:p-8 text-center max-w-2xl mx-auto shadow-lg">
              <div className="text-xl md:text-2xl font-light text-gray-800 mb-4">
                WEDDING DAY
              </div>
              <div className="text-2xl md:text-3xl font-medium text-gray-800 mb-2">
                2025.12.20. 토요일 오후 3:20
              </div>
              <div className="text-lg md:text-xl text-gray-600">
                르비르모어 2층 단독홀
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="px-0 md:px-8 mb-20 md:mb-32">
          <div className="bg-white rounded-none md:rounded-2xl p-6 md:p-8 text-center max-w-4xl mx-auto shadow-lg">
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
                  className="aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => openGalleryModal(index)}
                >
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            <button
              className="px-6 py-3 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors"
              onClick={() => openGalleryModal(0)}
            >
              사진 더보기
            </button>
          </div>
        </section>

        {/* RSVP Section - 참석 정보 */}
        <section id="rsvp" className="px-0 md:px-8 mb-20 md:mb-32">
          <div className="space-y-8 md:space-y-12">
            {/* Save the Date */}
            <div className="bg-white rounded-none md:rounded-2xl p-6 md:p-12 text-center max-w-3xl mx-auto shadow-lg">
              <div className="text-xl md:text-2xl font-light text-gray-800 mb-4">
                SAVE THE DATE
              </div>
              <h2 className="text-2xl md:text-3xl font-medium text-gray-800 mb-6">
                참석정보를 전달해주세요
              </h2>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8">
                축하의 마음으로 예식에 참석하시는 모든 분들을
                <br />
                더욱 귀하게 모실 수 있도록, 아래 버튼을 눌러
                <br />
                신랑 & 신부에게 참석 정보 전달을 부탁드립니다.
              </p>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="text-gray-800 text-lg md:text-xl mb-1">
                  2025.12.20. 토요일 오후 3:20
                </div>
                <div className="text-gray-600">르비르모어 2층 단독홀</div>
              </div>

              <button className="w-full py-4 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors mb-4">
                <UserCheck className="w-5 h-5 inline mr-2" />
                참석 정보 전달하기
              </button>
            </div>

            {/* 화환 보내기 */}
            <div className="bg-white rounded-none md:rounded-2xl p-6 md:p-8 text-center max-w-3xl mx-auto shadow-lg">
              <div className="text-xl md:text-2xl font-light text-gray-800 mb-4">
                축하 화환 보내기
              </div>
              <p className="text-gray-600 text-sm md:text-base mb-6">
                신랑, 신부의 새로운 시작을 축하해주세요.
                <br />
                화환은 예식일에 맞춰 웨딩홀로 배송됩니다.
              </p>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="text-gray-800 text-lg md:text-xl mb-1">
                  2025.12.20. 토요일 오후 3:20
                </div>
                <div className="text-gray-600">르비르모어 2층 단독홀</div>
              </div>

              <button className="w-full py-4 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600 transition-colors">
                <Flower className="w-5 h-5 inline mr-2" />
                축하 화환 보내기
              </button>
            </div>
          </div>
        </section>

        {/* Account Section */}
        <section id="account" className="px-0 md:px-8 mb-20 md:mb-32">
          <div className="bg-white rounded-none md:rounded-2xl p-6 md:p-8 text-center max-w-4xl mx-auto shadow-lg">
            <h2 className="text-2xl md:text-3xl font-medium text-gray-800 mb-6">
              마음 전하실 곳
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8">
              저희 두 사람의 소중한 시작을 축하해주시는 모든 분들께
              감사드립니다.
              <br />
              따뜻한 진심을 감사히 오래도록 간직하고 행복하게 잘 살겠습니다.
            </p>

            <div className="space-y-8 md:space-y-10 text-left">
              <div>
                <h3 className="text-gray-800 font-medium mb-4 text-center text-lg md:text-xl">
                  신랑측
                </h3>
                <div className="space-y-3 md:space-y-4">
                  <div className="bg-gray-50 p-4 md:p-6 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800 text-sm md:text-base">
                        신랑 <strong>박용준</strong>
                      </span>
                      <div className="text-right">
                        <div className="text-gray-600 text-xs md:text-sm">
                          국민 123-456-789012
                        </div>
                        <button className="text-blue-500 text-xs hover:text-blue-600">
                          복사
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 md:p-6 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800 text-sm md:text-base">
                        혼주 <strong>박문식</strong>
                      </span>
                      <div className="text-right">
                        <div className="text-gray-600 text-xs md:text-sm">
                          NH농협 123-4567-890123
                        </div>
                        <button className="text-blue-500 text-xs hover:text-blue-600">
                          복사
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-gray-800 font-medium mb-4 text-center text-lg md:text-xl">
                  신부측
                </h3>
                <div className="space-y-3 md:space-y-4">
                  <div className="bg-gray-50 p-4 md:p-6 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800 text-sm md:text-base">
                        신부 <strong>김이슬</strong>
                      </span>
                      <div className="text-right">
                        <div className="text-gray-600 text-xs md:text-sm">
                          카카오뱅크 123-4567-890123
                        </div>
                        <button className="text-pink-500 text-xs hover:text-pink-600">
                          복사
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 md:p-6 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800 text-sm md:text-base">
                        혼주 <strong>김도수</strong>
                      </span>
                      <div className="text-right">
                        <div className="text-gray-600 text-xs md:text-sm">
                          하나 123-4567-890123
                        </div>
                        <button className="text-pink-500 text-xs hover:text-pink-600">
                          복사
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section id="location" className="px-0 md:px-8 mb-20 md:mb-32">
          <div className="bg-white rounded-none md:rounded-2xl p-6 md:p-8 text-center max-w-3xl mx-auto shadow-lg">
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
                className="py-3 md:py-4 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors text-sm md:text-base"
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
                className="py-3 md:py-4 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors text-sm md:text-base"
              >
                <MapPin className="w-4 h-4 md:w-5 md:h-5 inline mr-1 md:mr-2" />
                T맵 길찾기
              </button>
            </div>
          </div>
        </section>

        {/* Guestbook Section */}
        <section id="guestbook" className="px-0 md:px-8 mb-20 md:mb-32">
          <div className="bg-white rounded-none md:rounded-2xl p-6 md:p-8 text-center max-w-4xl mx-auto shadow-lg">
            <div className="text-xl md:text-2xl font-light text-gray-800 mb-4">
              GUEST BOOK
            </div>
            <h2 className="text-2xl md:text-3xl font-medium text-gray-800 mb-6">
              축하 메시지를 남겨주세요
            </h2>
            <p className="text-gray-600 text-sm md:text-base mb-8">
              신랑 & 신부의 행복한 앞날을 위해 따뜻한 덕담 한 말씀 남겨주세요.
              <br />
              소중한 추억으로 간직하겠습니다.
            </p>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-4 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors mb-6"
            >
              축하 메시지 작성하기
            </button>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="text-gray-600">방명록을 불러오는 중...</div>
              </div>
            ) : guestbookEntries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {guestbookEntries.slice(0, 6).map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-gray-50 p-4 md:p-6 rounded-xl"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            entry.to === "신랑"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-pink-100 text-pink-600"
                          }`}
                        >
                          To. {entry.to}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(entry.createdAt).toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </div>
                    </div>
                    <p className="text-sm text-gray-800 mb-2 whitespace-pre-wrap">
                      {entry.message}
                    </p>
                    <div className="text-xs text-gray-500">
                      From. {entry.relationship ? `${entry.relationship} ` : ""}
                      {entry.name}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-600 mb-2">
                  아직 작성된 메시지가 없습니다.
                </div>
                <div className="text-xs text-gray-500">
                  첫 번째 축하 메시지를 남겨보세요! 💕
                </div>
              </div>
            )}

            {guestbookEntries.length > 6 && (
              <div className="text-center mt-6">
                <button className="text-gray-600 text-sm hover:text-gray-800 transition-colors">
                  모든 메시지 보기 ({guestbookEntries.length}개)
                </button>
              </div>
            )}
          </div>
        </section>

        <footer className="text-center mt-12 px-0 md:px-4 py-8 bg-white rounded-none md:rounded-2xl shadow-lg">
          <div className="text-gray-800 text-lg font-medium mb-2">
            언제나 곁을 따뜻하게 지켜주신 모든 분들께 감사드립니다.
          </div>
          <div className="text-gray-700 text-base mb-4 font-medium">
            박용준 & 김이슬
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors">
              카카오톡 공유하기
            </button>
            <button className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
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
                          onClick={() =>
                            toggleLike(photos[currentPhotoIndex].id)
                          }
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
