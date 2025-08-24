"use client";

import {
  Heart,
  MapPin,
  Calendar,
  Clock,
  Gift,
  MessageCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
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
  const [activeSection, setActiveSection] = useState("invitation");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  // 갤러리 관련 state
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([
    {
      id: 1,
      src: "/img/IMG_5355.JPG",
      caption: "우리의 소중한 순간 💕",
      likes: 24,
      isLiked: false,
    },
    {
      id: 2,
      src: "/img/IMG_6303.JPG",
      caption: "함께한 달콤한 시간 📸",
      likes: 31,
      isLiked: true,
    },
    {
      id: 3,
      src: "/img/IMG_6145.JPG",
      caption: "행복한 우리 🌸",
      likes: 18,
      isLiked: false,
    },
    {
      id: 4,
      src: "/img/IMG_6104.JPG",
      caption: "사랑스러운 날들 💍",
      likes: 42,
      isLiked: true,
    },
    {
      id: 5,
      src: "/img/IMG_5853.JPG",
      caption: "특별한 추억 👰",
      likes: 38,
      isLiked: false,
    },
    {
      id: 6,
      src: "/img/IMG_5573.JPG",
      caption: "영원히 기억할 순간 ✨",
      likes: 27,
      isLiked: false,
    },
    {
      id: 7,
      src: "/img/IMG_5282.JPG",
      caption: "둘만의 시간 🥰",
      likes: 35,
      isLiked: true,
    },
    {
      id: 8,
      src: "/img/IMG_4981.JPG",
      caption: "함께 걸어온 길 🚶‍♀️🚶‍♂️",
      likes: 22,
      isLiked: false,
    },
    {
      id: 9,
      src: "/img/IMG_5097.JPG",
      caption: "웃음 가득한 하루 😊",
      likes: 29,
      isLiked: false,
    },
    {
      id: 10,
      src: "/img/IMG_5127.JPG",
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

  // 컴포넌트 마운트 시 방명록 로드
  useEffect(() => {
    fetchGuestbook();
  }, [fetchGuestbook]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-rose-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex justify-around text-xs">
            {["invitation", "gallery", "location", "account", "guestbook"].map(
              (section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`px-3 py-2 rounded-full transition-colors ${
                    activeSection === section
                      ? "bg-pink-100 text-pink-600"
                      : "text-gray-600"
                  }`}
                >
                  {section === "invitation" && "초대장"}
                  {section === "gallery" && "갤러리"}
                  {section === "location" && "오시는 길"}
                  {section === "account" && "마음전하실곳"}
                  {section === "guestbook" && "축하메시지"}
                </button>
              )
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-md mx-auto pt-20 pb-8">
        {/* Header Section */}
        <div className="text-center px-6 py-12 bg-white/50 backdrop-blur-sm mx-4 rounded-3xl shadow-lg mb-8">
          <div className="text-sm text-gray-500 mb-2">
            {"We're getting married"}
          </div>
          <div className="text-3xl font-light text-gray-800 mb-4">
            <span className="font-medium">용준</span> &{" "}
            <span className="font-medium">이슬</span>
          </div>
          <div className="text-rose-400 mb-6">
            <Heart className="w-8 h-8 mx-auto fill-current" />
          </div>
          <div className="text-lg text-gray-600 font-light">
            2025. 12. 20. 토요일
          </div>
          <div className="text-sm text-gray-500 mt-2">
            D-{daysUntil > 0 ? daysUntil : "DAY"}
          </div>
        </div>

        {/* Invitation Section */}
        {activeSection === "invitation" && (
          <div className="px-4 space-y-8">
            <section className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-medium text-gray-800 mb-4 text-center">
                초대합니다
              </h2>
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed text-center">
                <div className="text-4xl mb-4">👷‍♂️💻</div>
                <p className="text-pink-500 font-medium text-base">
                  용준이가 열심히 만들고 있습니다
                  <br />
                  조금만 기다려 주세용~~ 🥺
                </p>
                <div className="text-2xl">✨🔨✨</div>
                <p className="text-xs text-gray-400 mt-2">
                  곧 멋진 초대장으로 찾아뵐게요! 💕
                </p>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">
                    신랑
                  </h3>
                  <div className="text-2xl font-light text-gray-700 mb-2">
                    박용준
                  </div>
                  <div className="text-xs text-gray-500">
                    박문식 · 노영임 의 장남
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">
                    신부
                  </h3>
                  <div className="text-2xl font-light text-gray-700 mb-2">
                    김이슬
                  </div>
                  <div className="text-xs text-gray-500">
                    김도수 · 박언자 의 장녀
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-medium text-gray-800 mb-6 text-center">
                Wedding Day
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-pink-400" />
                  <span className="text-gray-700">2025년 12월 20일 토요일</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-pink-400" />
                  <span className="text-gray-700">오후 3시 20분</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-pink-400" />
                  <div>
                    <div className="text-gray-700">강남 르비르모어</div>
                    <div className="text-sm text-gray-500">2층 </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-2xl p-6 text-center">
              <div className="text-lg text-gray-700 mb-2">
                용준 & 이슬의 결혼식까지
              </div>
              <div className="text-4xl font-bold text-pink-600">
                {daysUntil > 0 ? `D-${daysUntil}` : "D-DAY"}
              </div>
            </section>
          </div>
        )}

        {/* Gallery Section - Instagram Style */}
        {activeSection === "gallery" && (
          <div className="px-4 space-y-4">
            <div className="text-center mb-6 bg-white/50 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-2xl mb-2">📸</div>
              <h2 className="text-xl font-medium text-gray-800 mb-2">
                우리의 소중한 순간
              </h2>
              <p className="text-sm text-gray-500">
                함께한 아름다운 시간들을 나눕니다
              </p>
            </div>

            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                {/* Post Header */}
                <div className="flex items-center p-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs font-bold">YJ♥IS</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">
                      용준 & 이슬
                    </div>
                    <div className="text-xs text-gray-500">우리의 추억</div>
                  </div>
                </div>

                {/* Photo */}
                <div
                  className="aspect-square bg-gray-100 cursor-pointer relative"
                  onClick={() => openGalleryModal(index)}
                >
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Post Actions */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => toggleLike(photo.id)}
                        className="flex items-center space-x-1 transition-transform hover:scale-110"
                      >
                        <Heart
                          className={`w-6 h-6 transition-colors ${
                            photo.isLiked
                              ? "text-red-500 fill-current"
                              : "text-gray-600"
                          }`}
                        />
                      </button>
                      <MessageCircle className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>

                  {/* Likes Count */}
                  <div className="text-sm font-medium text-gray-800 mb-2">
                    좋아요 {photo.likes}개
                  </div>

                  {/* Caption */}
                  <div className="text-sm text-gray-800">
                    <span className="font-medium">용준 & 이슬</span>{" "}
                    <span>{photo.caption}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Location Section */}
        {activeSection === "location" && (
          <div className="px-4 space-y-6">
            <section className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-medium text-gray-800 mb-4 text-center">
                🗺️ 오시는 길
              </h2>
              <div className="space-y-4">
                <div className="text-center text-gray-700">
                  <div className="font-medium">Todo: 결혼식 주소 사용</div>
                  <div className="text-sm text-gray-500 mt-1">
                    강남 르비르모어 선릉역 1번출구
                  </div>
                </div>

                <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                    <div className="text-blue-600 font-medium">지도 영역</div>
                    <div className="text-xs text-blue-400 mt-1">
                      실제 지도는 추후 연동 예정
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button className="px-3 py-2 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600 transition-colors">
                    네이버지도
                  </button>
                  <button className="px-3 py-2 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 transition-colors">
                    티맵
                  </button>
                  <button className="px-3 py-2 bg-yellow-500 text-white rounded-lg text-xs hover:bg-yellow-600 transition-colors">
                    카카오맵
                  </button>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-1">
                      🚗 자가용
                    </h4>
                    <p className="text-gray-600 text-xs">
                      네비게이션: 호텔리츠컨벤션웨딩 또는 인계동 1133-7
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-1">
                      🚇 지하철
                    </h4>
                    <p className="text-gray-600 text-xs">
                      수인분당선: 수원시청역 2번 출구
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-1">🚌 버스</h4>
                    <p className="text-gray-600 text-xs">
                      수원시청역 5번 출구: 92, 92-1
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Account Section */}
        {activeSection === "account" && (
          <div className="px-4">
            <section className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-center mb-6">
                <Gift className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                <h2 className="text-xl font-medium text-gray-800 mb-2">
                  마음 전하실 곳
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  저희 두 사람의 소중한 시작을 축하해주시는 모든 분들께
                  감사드립니다.
                  <br />
                  따뜻한 진심을 감사히 오래도록 간직하고 행복하게 잘 살겠습니다.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-3 text-center">
                    💙 신랑측
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span>
                        신랑 <strong>박용준</strong>
                      </span>
                      <div className="text-right">
                        <div className="text-xs">국민 123-456-789012</div>
                        <button className="text-pink-500 text-xs hover:text-pink-600">
                          복사
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span>
                        혼주 <strong>박문식</strong>
                      </span>
                      <div className="text-right">
                        <div className="text-xs">NH농협 123-45-678901</div>
                        <button className="text-pink-500 text-xs hover:text-pink-600">
                          복사
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-3 text-center">
                    💖 신부측
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span>
                        신부 <strong>김이슬</strong>
                      </span>
                      <div className="text-right">
                        <div className="text-xs">카카오뱅크 3333-12-345678</div>
                        <button className="text-pink-500 text-xs hover:text-pink-600">
                          복사
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span>
                        혼주 <strong>김도수</strong>
                      </span>
                      <div className="text-right">
                        <div className="text-xs">하나 123-456789-12345</div>
                        <button className="text-pink-500 text-xs hover:text-pink-600">
                          복사
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Guestbook Section */}
        {activeSection === "guestbook" && (
          <div className="px-4">
            <section className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-center mb-6">
                <MessageCircle className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                <h2 className="text-xl font-medium text-gray-800 mb-2">
                  축하 메시지를 남겨주세요
                </h2>
                <p className="text-sm text-gray-500">
                  용준&이슬이의 행복한 앞날을 위해 따뜻한 한 말씀 남겨주세요.
                  <br />
                  소중한 추억으로 간직하겠습니다.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-4 bg-pink-400 text-white rounded-xl font-medium hover:bg-pink-500 transition-colors mb-6"
              >
                💌 축하 메시지 작성하기
              </button>

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="text-gray-500">방명록을 불러오는 중...</div>
                </div>
              ) : guestbookEntries.length > 0 ? (
                <div className="space-y-4">
                  {guestbookEntries.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="bg-gray-50 p-4 rounded-xl">
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
                          {new Date(entry.createdAt).toLocaleDateString(
                            "ko-KR",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            }
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-2 whitespace-pre-wrap">
                        {entry.message}
                      </p>
                      <div className="text-xs text-gray-500">
                        From.{" "}
                        {entry.relationship ? `${entry.relationship} ` : ""}
                        {entry.name}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-2">
                    아직 작성된 메시지가 없습니다.
                  </div>
                  <div className="text-xs text-gray-400">
                    첫 번째 축하 메시지를 남겨보세요! 💕
                  </div>
                </div>
              )}

              {guestbookEntries.length > 5 && (
                <div className="text-center mt-6">
                  <button className="text-pink-500 text-sm hover:text-pink-600 transition-colors">
                    모든 메시지 보기 📝 ({guestbookEntries.length}개)
                  </button>
                </div>
              )}
            </section>
          </div>
        )}

        <footer className="text-center mt-12 px-4 py-8">
          <div className="text-gray-500 text-sm mb-2">용준 & 이슬</div>
          <div className="text-gray-400 text-xs">
            저희의 새로운 시작을 함께 해주셔서 감사합니다.
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
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
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
    </div>
  );
}
