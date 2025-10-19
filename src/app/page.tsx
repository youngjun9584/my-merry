"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

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
        Size: new (width: number, height: number) => any;
        Point: new (x: number, y: number) => any;
      };
    };
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Script from "next/script";
import GuestbookModal from "@/components/GuestbookModal";
import JsonLd from "./JsonLd";

function DdayCounter() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const weddingDate = new Date("2025-12-20T15:30:00").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = weddingDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div data-aos="fade-up" className="flex flex-col justify-center w-full">
      {/* 카운터 박스들 */}
      <div className="pt-1 pb-12 flex items-center justify-center w-full font-light text-center tracking-normal only-of-type:!py-0">
        {[
          { value: timeLeft.days, label: "Days", key: "days" },
          { value: timeLeft.hours, label: "Hour", key: "hours" },
          { value: timeLeft.minutes, label: "Min", key: "minutes" },
          { value: timeLeft.seconds, label: "Sec", key: "seconds" },
        ].map((item, index) => (
          <React.Fragment key={item.key}>
            <div
              className="ddaybox p-4 flex flex-col justify-center items-center w-14 h-[63px] rounded-lg border"
              style={{
                backgroundColor: "rgba(250, 248, 248, 1)",
                borderColor: "rgba(173, 134, 139, 0.2)",
              }}
            >
              <div className="counttext flex flex-col w-full items-center text-center">
                <span
                  className="text-2xl"
                  style={{ color: "rgba(173, 134, 139, 1)" }}
                >
                  {String(item.value).padStart(2, "0")}
                </span>
                <span
                  className="text-xs CormorantInfant-Medium"
                  style={{ color: "rgba(173, 134, 139, 1)" }}
                >
                  {item.label}
                </span>
              </div>
            </div>
            {index < 3 && (
              <span
                key={`colon-${index}`}
                className="counttext colonmb text-sm mx-4"
              >
                :
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* 메시지 텍스트 */}
      <div
        data-aos="fade-up"
        className="flex flex-col items-center justify-center text-center break-all whitespace-pre-wrap"
      >
        <p>
          용준 <span style={{ color: "#d08c95" }}>♥</span> 이슬의 결혼식이{" "}
          <strong>
            <span style={{ color: "#d08c95" }}>{timeLeft.days}</span>
          </strong>
          일 남았습니다.
        </p>
      </div>
    </div>
  );
}

function WeddingInvitationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isContactOpen = searchParams.get("contact") === "open";
  const isGalleryOpen = searchParams.get("gallery") === "open";

  // 갤러리 표시 상태 관리
  const [isGalleryExpanded, setIsGalleryExpanded] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // 갤러리 모달 현재 사진 인덱스 (URL이 아닌 state로 관리)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // 스와이프 관련 상태
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<number | null>(null);

  // 지도 로딩 상태 관리
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // 계좌 정보 드롭다운 상태 관리
  const [isGroomAccountOpen, setIsGroomAccountOpen] = useState(false);
  const [isBrideAccountOpen, setIsBrideAccountOpen] = useState(false);

  // 복사된 계좌번호 상태 관리
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  // 토스트 알림 상태 관리
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [activeInfoTab, setActiveInfoTab] = useState(0);

  // 애니메이션 관련 상태
  const [visibleSections, setVisibleSections] = useState<boolean[]>(
    new Array(7).fill(false)
  );
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // 방명록 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  // BGM 재생 관련 상태
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  // 슬라이드 관련 상태
  const slideRef = useRef<HTMLDivElement>(null);
  const [slidePosition, setSlidePosition] = useState(0);

  // 방명록 관련 상태
  interface GuestbookEntry {
    id: number;
    name: string;
    content: string;
    createdAt: string;
  }

  const [guestbooks, setGuestbooks] = useState<GuestbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(guestbooks.length / itemsPerPage);

  // 임시 데이터 로드 함수
  const loadDummyData = useCallback(() => {
    const dummyData: GuestbookEntry[] = [
      {
        id: 1,
        name: "임미경",
        content: "결혼 정말 축하해~ 행복하게 잘 살아😀",
        createdAt: "2025-08-16T14:06:00.000Z",
      },
      {
        id: 2,
        name: "문우혁",
        content: "결혼식날 보자~ 결혼 너무 축하해!",
        createdAt: "2025-08-16T14:06:00.000Z",
      },
      {
        id: 3,
        name: "우경수",
        content: "둘이 너무 잘 어울려! 행복하게 살아😆",
        createdAt: "2025-08-16T14:06:00.000Z",
      },
      {
        id: 4,
        name: "임미래",
        content: "사진 너무 예쁘다~ 결혼 정말 축하해 :)",
        createdAt: "2025-08-16T14:06:00.000Z",
      },
    ];
    setGuestbooks(dummyData);
    setCurrentPage(0);
  }, []);

  // 방명록 데이터 가져오기
  const fetchGuestbook = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/guestbook");
      if (response.ok) {
        const data = await response.json();
        setGuestbooks(data);
        setCurrentPage(0);
      } else {
        // API가 없거나 실패한 경우 임시 데이터 사용
        loadDummyData();
      }
    } catch (error) {
      console.error("방명록 로딩 오류:", error);
      // API 오류 시 임시 데이터 사용
      loadDummyData();
    } finally {
      setIsLoading(false);
    }
  }, [loadDummyData]);

  // BGM 재생/일시정지 토글 함수
  const toggleBGM = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // 방명록 제출 함수
  const submitGuestbook = async (guestbookData: {
    name: string;
    content: string;
  }) => {
    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(guestbookData),
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchGuestbook(); // 방명록 목록 새로고침
        showToastNotification("축하 메시지가 등록되었습니다!");
      } else {
        throw new Error("방명록 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("방명록 제출 오류:", error);
      // API가 없는 경우 임시로 로컬 상태에 추가
      const newEntry: GuestbookEntry = {
        id: guestbooks.length + 1,
        name: guestbookData.name,
        content: guestbookData.content,
        createdAt: new Date().toISOString(),
      };
      setGuestbooks((prevGuestbooks) => [newEntry, ...prevGuestbooks]);
      setIsModalOpen(false);
      showToastNotification("축하 메시지가 등록되었습니다!");
    }
  };

  // 컴포넌트 마운트 시 방명록 데이터 로드
  useEffect(() => {
    fetchGuestbook();
  }, [fetchGuestbook]);

  // 컴포넌트 마운트 시 BGM 자동 재생
  useEffect(() => {
    const playBGM = async () => {
      if (audioRef.current) {
        try {
          // 음소거 상태로 먼저 재생 시도 (브라우저 정책 우회)
          audioRef.current.muted = true;
          await audioRef.current.play();

          // 즉시 음소거 해제 및 볼륨 설정
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.muted = false;
              audioRef.current.volume = 0.5;
              setIsPlaying(true);
              console.log("✅ BGM 자동 재생 성공");
            }
          }, 100);
        } catch (error) {
          console.log("⚠️ 자동 재생 차단:", error);
          // 차단된 경우 사용자 인터랙션 대기
          if (audioRef.current) {
            audioRef.current.muted = false;
            audioRef.current.volume = 0.5;
          }
        }
      }
    };

    // 페이지 로드 후 여러 시점에 재생 시도
    playBGM();
    setTimeout(playBGM, 100);
    setTimeout(playBGM, 300);
    setTimeout(playBGM, 500);

    // 사용자 인터랙션 시 재생 (폴백)
    const handleInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.muted = false;
        audioRef.current.volume = 0.5;
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            console.log("✅ 사용자 인터랙션으로 BGM 재생");
          })
          .catch((err) => {
            console.log("재생 오류:", err);
          });
      }
    };

    // 모든 가능한 이벤트에 리스너 등록
    const events = [
      "click",
      "touchstart",
      "touchmove",
      "mousemove",
      "scroll",
      "keydown",
      "mousedown",
      "touchend",
    ];

    events.forEach((event) => {
      document.addEventListener(event, handleInteraction, { once: true });
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleInteraction);
      });
    };
  }, []);

  // 슬라이드 자동 애니메이션
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setSlidePosition((prev) => {
        // 이미지 10개 * (너비 w-48=192px + gap-3=12px) = 204px per image
        const totalWidth = 10 * 204;
        // 한 세트의 너비만큼 이동했으면 리셋
        if (Math.abs(prev) >= totalWidth) {
          return 0;
        }
        // 1px씩 왼쪽으로 이동 (더 빠르게)
        return prev - 1;
      });
    }, 20); // 20ms마다 업데이트

    return () => clearInterval(slideInterval);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.indexOf(
              entry.target as HTMLElement
            );
            if (index !== -1) {
              setVisibleSections((prev) => {
                const newVisible = [...prev];
                newVisible[index] = true;
                return newVisible;
              });
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const currentRefs = sectionRefs.current;
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  // 토스트 알림 표시 함수
  const showToastNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // 계좌번호 복사 함수
  const copyAccountNumber = async (
    accountNumber: string,
    fullAccountInfo: string
  ) => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopiedAccount(fullAccountInfo);
      showToastNotification(`${fullAccountInfo} 계좌번호가 복사되었습니다`);
      setTimeout(() => setCopiedAccount(null), 2000);
    } catch (error) {
      console.error("계좌번호 복사 실패:", error);
      // 클립보드 API가 지원되지 않는 경우 대체 방법
      try {
        const textArea = document.createElement("textarea");
        textArea.value = accountNumber;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopiedAccount(fullAccountInfo);
        showToastNotification(`${fullAccountInfo} 계좌번호가 복사되었습니다`);
        setTimeout(() => setCopiedAccount(null), 2000);
      } catch (fallbackError) {
        console.error("대체 복사 방법도 실패:", fallbackError);
        showToastNotification(`복사 실패: ${accountNumber}`);
      }
    }
  };

  // 갤러리 사진 데이터 (S3 이미지 사용) - 30개
  const photos = Array.from(
    { length: 30 },
    (_, i) =>
      `https://edi-img.s3.ap-northeast-2.amazonaws.com/uploads/merry/${
        i + 1
      }.jpg`
  );

  const openContact = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("contact", "open");
    router.push(`?${newSearchParams.toString()}`, { scroll: false });
  };

  const closeContact = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete("contact");
    router.push(`?${newSearchParams.toString()}`, { scroll: false });
  };

  const openGallery = (photoIndex: number) => {
    setCurrentPhotoIndex(photoIndex); // state에 인덱스 저장
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("gallery", "open");
    router.push(`?${newSearchParams.toString()}`, { scroll: false });
  };

  const closeGallery = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete("gallery");
    router.push(`?${newSearchParams.toString()}`, { scroll: false });
  };

  const navigatePhoto = (direction: "prev" | "next") => {
    let newIndex;

    if (direction === "prev") {
      newIndex =
        currentPhotoIndex > 0 ? currentPhotoIndex - 1 : photos.length - 1;
    } else {
      newIndex =
        currentPhotoIndex < photos.length - 1 ? currentPhotoIndex + 1 : 0;
    }

    setCurrentPhotoIndex(newIndex); // state만 업데이트, URL 변경 없음
  };

  // 스와이프 핸들러
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
    if (touchStart !== null) {
      const offset = e.targetTouches[0].clientX - touchStart;
      setSwipeOffset(offset);
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setSwipeOffset(0);
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      navigatePhoto("next");
    } else if (isRightSwipe) {
      navigatePhoto("prev");
    }

    setSwipeOffset(0);
    setTouchStart(null);
    setTouchEnd(null);
  };

  // 마우스 드래그 핸들러
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX);
    setSwipeOffset(0);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || dragStart === null) return;
    const offset = e.clientX - dragStart;
    setSwipeOffset(offset);
  };

  const onMouseUp = () => {
    if (!isDragging || dragStart === null) {
      setIsDragging(false);
      setSwipeOffset(0);
      return;
    }

    const distance = swipeOffset;
    const isLeftSwipe = distance < -minSwipeDistance;
    const isRightSwipe = distance > minSwipeDistance;

    if (isLeftSwipe) {
      navigatePhoto("next");
    } else if (isRightSwipe) {
      navigatePhoto("prev");
    }

    setIsDragging(false);
    setSwipeOffset(0);
    setDragStart(null);
  };

  // 더보기/접기 토글 함수
  const handleToggleGallery = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setIsGalleryExpanded(!isGalleryExpanded);
      setIsLoadingMore(false);
    }, 300); // 로딩 효과를 위한 지연
  };

  // 네이버 지도 API 초기화
  const initNaverMap = useCallback(() => {
    console.log("🗺️ 네이버 지도 API 초기화 시작...");

    if (!window.naver || !window.naver.maps) {
      console.error("❌ 네이버 지도 API가 로드되지 않았습니다.");
      return;
    }

    // 강남 상제리제 센터 (르비르모어) 위치
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
      console.log("✅ 네이버 지도 생성 완료");

      // 지도 로드 완료 이벤트
      window.naver.maps.Event.addListener(map, "init", () => {
        console.log("🎉 네이버 지도 초기화 완료!");
        setIsMapLoaded(true);
      });

      // 마커 생성
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const marker = new window.naver.maps.Marker({
        position: weddingLocation,
        map: map,
        title: "강남 상제리제 센터 2층 르비르모어",
        icon: {
          content: `
            <div style="background: #e91e63; color: white; padding: 8px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-align: center; box-shadow: 0 2px 8px rgba(233,30,99,0.3); white-space: nowrap;">
              💒 르비르모어
            </div>
          `,
          size: new window.naver.maps.Size(120, 40),
          anchor: new window.naver.maps.Point(60, 40),
        },
      });

      // // 정보창 생성
      // const infoWindow = new window.naver.maps.InfoWindow({
      //   content: `
      //     <div style="padding: 12px; font-family: 'Malgun Gothic', sans-serif; min-width: 200px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      //       <h3 style="margin: 0 0 8px 0; color: #333; font-size: 14px; font-weight: bold;">💒 르비르모어</h3>
      //       <p style="margin: 0 0 4px 0; color: #666; font-size: 12px;">📍 서울 강남구 테헤란로 406</p>
      //       <p style="margin: 0 0 4px 0; color: #666; font-size: 12px;">🏢 강남 상제리제 센터 2층</p>
      //       <p style="margin: 0 0 4px 0; color: #e91e63; font-size: 12px; font-weight: bold;">🗓️ 2025.12.20 (토) 오후 3시 30분</p>
      //       <p style="margin: 0; color: #666; font-size: 11px;">📞 02-501-7000 | 🚇 선릉역 1번출구</p>
      //     </div>
      //   `,
      //   borderWidth: 0,
      //   disableAnchor: true,
      // });

      // // 마커 클릭 시 정보창 표시
      // window.naver.maps.Event.addListener(marker, "click", () => {
      //   if (infoWindow.getMap()) {
      //     infoWindow.close();
      //   } else {
      //     infoWindow.open(map, marker);
      //   }
      // });

      // // 1초 후에 정보창 자동으로 열기
      // setTimeout(() => {
      //   infoWindow.open(map, marker);
      //   console.log("✅ 정보창 열기 완료");
      // }, 1000);

      console.log("🎉 모든 네이버 지도 설정 완료!");
    } catch (error) {
      console.error("❌ 네이버 지도 초기화 오류:", error);
    }
  }, []);

  // 네이버지도 스크립트 로드 완료 시 실행
  const handleMapScriptLoad = useCallback(() => {
    console.log("📜 네이버 지도 스크립트 로드 완료");
    initNaverMap();
  }, [initNaverMap]);

  // URL 복사 함수
  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText("http://1220wedding.site/");
      setToastMessage("URL이 복사되었습니다!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error("URL 복사 실패:", err);
      setToastMessage("URL 복사에 실패했습니다.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  // 카카오톡 공유 함수
  const shareToKakao = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== "undefined" && (window as any).Kakao) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).Kakao.Share.createCustomButton({
        container: "#kakaotalk-share-btn",
        templateId: 125001,
        templateArgs: {
          title: "우리 결혼식에 초대합니다",
          description: "2024년 12월 20일, 함께 축복해 주세요",
        },
      });
    } else {
      console.error("카카오 SDK가 로드되지 않았습니다.");
      setToastMessage("카카오톡 공유를 사용할 수 없습니다.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  // 주소 복사 함수
  const copyAddress = async () => {
    const address =
      "서울 강남구 테헤란로 406 강남 상제리제 센터 2층 르비르모어";
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

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "rgb(249, 249, 249)" }}
    >
      {/* 구조화 데이터 (SEO) */}
      <JsonLd />

      {/* 네이버 지도 API 스크립트 */}
      <Script
        strategy="afterInteractive"
        type="text/javascript"
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=d5ancr9p5b`}
        onLoad={handleMapScriptLoad}
      />

      {/* Hero Section - 메인 이미지 */}
      <div
        className="relative w-full max-w-[430px] mx-auto overflow-hidden"
        style={{ maxHeight: "900px", height: "100vh" }}
      >
        <Image
          src="https://edi-img.s3.ap-northeast-2.amazonaws.com/uploads/merry/IMG_4981.jpg"
          alt="용준 & 이슬"
          fill
          className="object-cover"
          priority
          quality={85}
          sizes="(max-width: 430px) 100vw, 430px"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCxABmX/9k="
        />

        {/* 눈 내리는 효과 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          <div
            className="absolute w-full h-full"
            style={{
              backgroundImage:
                "url('https://cdn2.makedear.com/homepage/img/effect/new1/5.png')",
              backgroundRepeat: "repeat",
              backgroundSize: "auto",
              opacity: 0.8,
              animation: "snowfall 20s linear infinite",
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 90%, rgba(0,0,0,0) 100%)",
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 90%, rgba(0,0,0,0) 100%)",
            }}
          />
        </div>

        {/* 웨이브 배경 - 사진 위에 덮어서 */}
        <div className="absolute bottom-[-1px] left-0 w-full z-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 65"
            preserveAspectRatio="none"
            className="w-full h-5"
          >
            <g
              fill="rgb(249, 249, 249)"
              stroke="none"
              transform="translate(0,65) scale(0.1,-0.1)"
            >
              <path d="M6470 629 c-1061 -34 -2002 -142 -3561 -408 -675 -115 -1198 -174 -1899 -214 -30 -2 2755 -3 6190 -3 3435 0 6225 1 6200 3 -25 1 -126 7 -225 13 -536 32 -1103 100 -1740 210 -737 127 -1570 247 -2110 305 -835 89 -1920 125 -2855 94z"></path>
            </g>
            <g
              fill="rgb(249, 249, 249)"
              stroke="none"
              transform="translate(0,65) scale(0.1,-0.1)"
              className="opacity-60"
            >
              <path
                key="top-wave-path-1"
                d="M0 322 l0 -322 3073 1 c1689 1 3018 5 2952 10 -705 47 -1210 110 -1970 245 -324 57 -1231 193 -1590 238 -665 83 -1301 126 -2117 142 l-348 7 0 -321z"
              ></path>
              <path
                key="top-wave-path-2"
                d="M13880 633 c-743 -17 -1425 -69 -2105 -159 -340 -45 -1173 -172 -1460 -223 -763 -135 -1251 -194 -2020 -244 -27 -2 1335 -4 3028 -5 l3077 -2 0 320 0 320 -207 -2 c-115 -1 -255 -3 -313 -5z"
              ></path>
            </g>
          </svg>
        </div>

        {/* 메인 텍스트 오버레이 */}
      </div>

      {/* 콘텐츠 섹션들 */}
      <div
        className="max-w-md mx-auto pt-16 "
        style={{ backgroundColor: "rgb(249, 249, 249)" }}
      >
        {/* 인사말 섹션 */}
        <section
          id="greeting"
          className="pb-28"
          style={{ backgroundColor: "rgb(249, 249, 249)" }}
        >
          {/* 잎사귀 이미지 */}
          <div className="pb-16 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://cdn2.makedear.com/homepage/img/leaf1.png"
              alt="leaf decoration"
              className="opacity-60"
              style={{ width: "1.4em", height: "1.4em" }}
              draggable={false}
            />
          </div>

          {/* 시 내용 */}
          <div className="flex flex-col items-center relative overflow-hidden">
            <div className="GowunDodum flex flex-col tracking-tighter break-all whitespace-pre-wrap text-center text-gray-700 leading-relaxed space-y-6">
              <p className="text-base poem-line">장담하건데</p>
              <p className="text-base poem-line">세상이 다 겨울이어도</p>

              <div className="py-2"></div>

              <p className="text-base poem-line">
                우리 사랑을 늘 봄처럼 따뜻하고
              </p>
              <p className="text-base poem-line">
                간혹, 여름처럼 뜨거울 겁니다.
              </p>

              <div className="py-2"></div>

              <p className="text-base poem-line">그대 사랑합니다.</p>
              <div className="py-2"></div>

              <p className="text-sm text-gray-500">이수동 &lt;사랑가&gt;</p>
            </div>
          </div>
        </section>

        {/* 폴라로이드 사진 섹션 */}
        <section className="mb-16 px-4">
          <div className="max-w-sm mx-auto">
            {/* 폴라로이드 프레임 */}
            <div className="bg-white p-4 shadow-lg">
              <div className="bg-gray-100">
                <Image
                  src="https://edi-img.s3.ap-northeast-2.amazonaws.com/uploads/merry/IMG_4981-2.jpg"
                  alt="Wedding Photo"
                  width={400}
                  height={500}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                  quality={80}
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
              {/* 폴라로이드 하단 여백 */}
              <div className="h-16 bg-white"></div>
            </div>
          </div>
        </section>

        {/* Invite you 제목 */}
        <section className="px-6">
          <h2
            id="postParagraphEngTitle"
            className="section-label whitespace-pre-wrap !pb-10 text-center font-serif text-sm tracking-widest"
            style={{ color: "#d099a1" }}
          >
            <div>INVITE YOU</div>
          </h2>
        </section>

        {/* 연락하기 버튼 */}
        <section className="mb-16 px-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4 leading-relaxed">
              저희 두 사람이
              <br />
              평생을 함께하기 위해
              <br />
              서로의 반려자가 되려 합니다.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              그 진실한 사랑을 하는 저희에
              <br />
              소중한 분들을 모십니다.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              자리하시어 축복해 주시면
              <br />
              대단히 감사하겠습니다.
            </p>

            <div className="mb-6">
              <p className="text-gray-800 font-medium">
                <span className="text-gray-800 font-semibold">박문식</span> ·{" "}
                <span className="text-gray-800 font-semibold">노영임</span>의
                아들 <span className="font-semibold">용준</span>
              </p>
              <p className="text-gray-800 font-medium mt-2">
                <span className="text-gray-800 font-semibold">김도수</span> ·{" "}
                <span className="text-gray-800 font-semibold">박언자</span>의{" "}
                <span className="mx-2"> 딸 </span>{" "}
                <span className="font-semibold">이슬</span>
              </p>
            </div>

            <button
              onClick={openContact}
              className="bg-white text-gray-800 w-full py-3 mt-5 text-sm font-medium hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
            >
              연락처 보기
            </button>
          </div>
        </section>

        {/* 연락처 모달 */}
        {isContactOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xs w-full max-h-[85vh] overflow-y-auto shadow-2xl">
              <div className="p-3">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base font-semibold text-gray-800">
                    연락처
                  </h3>
                  <button
                    onClick={closeContact}
                    className="text-gray-400 hover:text-gray-600 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-3">
                  {/* 신랑 */}
                  <div className="bg-gray-50 rounded-xl p-2.5">
                    <h4 className="text-center text-gray-600 font-semibold mb-2 text-sm">
                      신랑
                    </h4>
                    <div className="text-center mb-2">
                      <p className="font-bold text-base text-gray-800">
                        박용준
                      </p>
                      <div className="flex justify-center gap-2 mt-1.5">
                        <a
                          href="tel:010-0000-0000"
                          className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-300 transition-colors"
                        >
                          📞
                        </a>
                        <a
                          href="sms:010-0000-0000"
                          className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-300 transition-colors"
                        >
                          💬
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-xs">
                      <div className="text-center bg-white rounded-lg p-1.5">
                        <p className="text-gray-600 mb-0.5 font-medium">
                          아버지
                        </p>
                        <p className="font-semibold text-gray-800">박문식</p>
                        <div className="flex justify-center gap-1 mt-1">
                          <a
                            href="tel:010-0000-0000"
                            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors text-xs"
                          >
                            📞
                          </a>
                          <a
                            href="sms:010-0000-0000"
                            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors text-xs"
                          >
                            💬
                          </a>
                        </div>
                      </div>
                      <div className="text-center bg-white rounded-lg p-1.5">
                        <p className="text-gray-600 mb-0.5 font-medium">
                          어머니
                        </p>
                        <p className="font-semibold text-gray-800">노영임</p>
                        <div className="flex justify-center gap-1 mt-1">
                          <a
                            href="tel:010-0000-0000"
                            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors text-xs"
                          >
                            📞
                          </a>
                          <a
                            href="sms:010-0000-0000"
                            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors text-xs"
                          >
                            💬
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 신부 */}
                  <div className="bg-gray-100 rounded-xl p-2.5">
                    <h4 className="text-center text-gray-600 font-semibold mb-2 text-sm">
                      신부
                    </h4>
                    <div className="text-center mb-2">
                      <p className="font-bold text-base text-gray-800">
                        김이슬
                      </p>
                      <div className="flex justify-center gap-2 mt-1.5">
                        <a
                          href="tel:010-0000-0000"
                          className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-400 transition-colors"
                        >
                          📞
                        </a>
                        <a
                          href="sms:010-0000-0000"
                          className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-400 transition-colors"
                        >
                          💬
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-xs">
                      <div className="text-center bg-white rounded-lg p-1.5">
                        <p className="text-gray-600 mb-0.5 font-medium">
                          아버지
                        </p>
                        <p className="font-semibold text-gray-800">김도수</p>
                        <div className="flex justify-center gap-1 mt-1">
                          <a
                            href="tel:010-0000-0000"
                            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors text-xs"
                          >
                            📞
                          </a>
                          <a
                            href="sms:010-0000-0000"
                            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors text-xs"
                          >
                            💬
                          </a>
                        </div>
                      </div>
                      <div className="text-center bg-white rounded-lg p-1.5">
                        <p className="text-gray-600 mb-0.5 font-medium">
                          어머니
                        </p>
                        <p className="font-semibold text-gray-800">박언자</p>
                        <div className="flex justify-center gap-1 mt-1">
                          <a
                            href="tel:010-0000-0000"
                            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors text-xs"
                          >
                            📞
                          </a>
                          <a
                            href="sms:010-0000-0000"
                            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors text-xs"
                          >
                            💬
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 갤러리 모달 */}
        {isGalleryOpen &&
          (() => {
            const currentIndex = Math.max(
              0,
              Math.min(currentPhotoIndex, photos.length - 1)
            );
            const currentPhoto = photos[currentIndex];

            // 앞뒤 사진 미리 계산 (프리로드용)
            const prevIndex =
              currentIndex > 0 ? currentIndex - 1 : photos.length - 1;
            const nextIndex =
              currentIndex < photos.length - 1 ? currentIndex + 1 : 0;
            const prevPhoto = photos[prevIndex];
            const nextPhoto = photos[nextIndex];

            return (
              <div
                className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={() => {
                  if (isDragging) {
                    setIsDragging(false);
                    setSwipeOffset(0);
                  }
                }}
              >
                {/* 닫기 버튼 */}
                <button
                  onClick={closeGallery}
                  className="absolute top-4 right-4 text-white hover:text-gray-300 z-60 w-12 h-12 flex items-center justify-center text-2xl"
                >
                  ×
                </button>

                {/* 사진 카운터 */}
                <div className="absolute top-4 left-4 text-white z-60 bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
                  {currentIndex + 1} / {photos.length}
                </div>

                {/* 이전 버튼 */}
                <button
                  onClick={() => navigatePhoto("prev")}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-60 w-12 h-12 flex items-center justify-center text-3xl bg-black bg-opacity-50 rounded-full"
                >
                  ‹
                </button>

                {/* 다음 버튼 */}
                <button
                  onClick={() => navigatePhoto("next")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-60 w-12 h-12 flex items-center justify-center text-3xl bg-black bg-opacity-50 rounded-full"
                >
                  ›
                </button>

                {/* 메인 이미지 컨테이너 */}
                <div
                  className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-4"
                  style={{
                    transform: `translateX(${swipeOffset}px)`,
                    transition:
                      swipeOffset === 0 ? "transform 0.3s ease-out" : "none",
                  }}
                >
                  {currentPhoto && (
                    <Image
                      src={currentPhoto}
                      alt={`Gallery ${currentIndex + 1}`}
                      fill
                      className="object-contain"
                      quality={85}
                      priority
                      sizes="100vw"
                      onError={() => {
                        console.error("Image failed to load:", currentPhoto);
                      }}
                    />
                  )}
                </div>

                {/* 이전 사진 프리로드 (숨김) */}
                <div className="hidden">
                  <Image
                    src={prevPhoto}
                    alt="Preload prev"
                    width={1}
                    height={1}
                    quality={85}
                    priority
                  />
                </div>

                {/* 다음 사진 프리로드 (숨김) */}
                <div className="hidden">
                  <Image
                    src={nextPhoto}
                    alt="Preload next"
                    width={1}
                    height={1}
                    quality={85}
                    priority
                  />
                </div>
              </div>
            );
          })()}

        {/* 포트레이트 섹션 */}
        <section
          id="editor-section-portrait"
          className="base-section relative select-none px-16 py-16 large bg-white"
          style={{ zIndex: 6 }}
        >
          {/* 웨이브 배경 */}
          <div className="wavebg top-0 left-0 absolute -translate-y-[96%] z-[1] w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 65"
              preserveAspectRatio="xMidYMid meet"
            >
              <g
                fill="#ffffff"
                stroke="none"
                transform="translate(0,65) scale(0.1,-0.1)"
              >
                <path d="M6470 629 c-1061 -34 -2002 -142 -3561 -408 -675 -115 -1198 -174 -1899 -214 -30 -2 2755 -3 6190 -3 3435 0 6225 1 6200 3 -25 1 -126 7 -225 13 -536 32 -1103 100 -1740 210 -737 127 -1570 247 -2110 305 -835 89 -1920 125 -2855 94z"></path>
              </g>
              <g
                fill="#ffffff"
                stroke="none"
                transform="translate(0,65) scale(0.1,-0.1)"
                className="opacity-50"
              >
                <path d="M0 322 l0 -322 3073 1 c1689 1 3018 5 2952 10 -705 47 -1210 110 -1970 245 -324 57 -1231 193 -1590 238 -665 83 -1301 126 -2117 142 l-348 7 0 -321z"></path>
                <path d="M13880 633 c-743 -17 -1425 -69 -2105 -159 -340 -45 -1173 -172 -1460 -223 -763 -135 -1251 -194 -2020 -244 -27 -2 1335 -4 3028 -5 l3077 -2 0 320 0 320 -207 -2 c-115 -1 -255 -3 -313 -5z"></path>
              </g>
            </svg>
          </div>

          {/* 포트레이트 이미지 영역 */}
          <div
            data-aos="fade-up"
            className="section-portrait-area-1 flex items-center"
          >
            <div
              id="portraitManImg"
              className="flex-1 overflow-hidden aspect-[1/1.35] rounded-2xl relative"
            >
              <Image
                src="https://edi-img.s3.ap-northeast-2.amazonaws.com/uploads/merry/park.jpg"
                alt="신랑 사진"
                fill
                className="object-cover select-none pointer-events-none call-out"
                draggable={false}
                loading="lazy"
                quality={75}
                sizes="(max-width: 768px) 45vw, 300px"
              />
            </div>

            <div id="portraitFrameShape" className="mx-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="heart-icon w-6 h-6 heart-icon-update text-[#d08c95]"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                />
              </svg>
            </div>

            <div className="flex-1 overflow-hidden aspect-[1/1.35] rounded-2xl relative">
              <Image
                src="https://edi-img.s3.ap-northeast-2.amazonaws.com/uploads/merry/kim.jpg"
                alt="신부 사진"
                fill
                className="object-cover select-none pointer-events-none call-out"
                draggable={false}
                loading="lazy"
                quality={75}
                sizes="(max-width: 768px) 45vw, 300px"
              />
            </div>
          </div>
        </section>

        {/* 캘린더 섹션 */}
        <section
          id="editor-section-calendar"
          className="base-section relative select-none  large bg-white w-full"
          style={{ zIndex: 7 }}
        >
          <h2
            id="calendarEngTitle"
            data-aos="fade-up"
            className="section-label whitespace-pre-wrap pb-8 text-center text-sm text-gray-400 tracking-wider"
          >
            <div style={{ color: "#d099a1" }}>CALENDAR</div>
          </h2>

          <div
            id="calendarYmdt"
            data-aos="fade-up"
            className="section-calendar-area-1 text-base text-center font-semibold tracking-normal pb-4"
          >
            <span>2025년 12월 20일 토요일 오후 3시 30분</span>
          </div>

          <div
            id="calendarPlace"
            data-aos="fade-up"
            className="text-base text-center font-semibold tracking-normal pb-8"
          >
            <p>강남 샹제리제 센터 2층 르비르모어</p>
          </div>

          <div
            data-aos="fade-up"
            className="section-calendar-area-2 flex flex-col text-base font-medium px-4"
          >
            <div className="mx-auto max-w-sm">
              {/* 요일 헤더 */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                <div className="w-8 h-8 flex items-center justify-center text-sm font-medium text-red-400">
                  일
                </div>
                <div className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-600">
                  월
                </div>
                <div className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-600">
                  화
                </div>
                <div className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-600">
                  수
                </div>
                <div className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-600">
                  목
                </div>
                <div className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-600">
                  금
                </div>
                <div className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-600">
                  토
                </div>
              </div>

              {/* 달력 그리드 */}
              <div className="grid grid-cols-7 gap-1">
                {/* 2025년 12월 달력 생성 */}
                {(() => {
                  const year = 2025;
                  const month = 11; // 12월 (0부터 시작)
                  const firstDay = new Date(year, month, 1).getDay(); // 12월 1일 요일 (일요일=0)
                  const daysInMonth = new Date(year, month + 1, 0).getDate(); // 12월의 총 일수
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
                          relative w-8 my-1 h-8 flex items-center justify-center text-sm font-medium
                          ${
                            isWeddingDay
                              ? "bg-pink-300 text-white rounded-full shadow-lg"
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
                          <React.Fragment key="wedding-day-markers">
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-400 rounded-full animate-ping"></div>
                            <div className="absolute top-[calc(110%)] flex justify-center text-xs font-semibold tracking-tight whitespace-nowrap text-gray-600">
                              <span>3시30분</span>
                            </div>
                          </React.Fragment>
                        )}
                      </div>
                    );
                  }

                  return calendarDays;
                })()}
              </div>
            </div>
          </div>
        </section>

        {/* 디데이 카운터 섹션 */}
        <section
          id="editor-section-dday"
          className="base-section relative select-none py-8 large bg-white w-full"
          style={{ zIndex: 8 }}
        >
          <DdayCounter />
          <div className="mt-10">
            <hr
              className="w-64 mx-auto border-t-2 border-dashed"
              style={{ borderColor: "rgba(173, 134, 139, 0.5)" }}
            />
          </div>
        </section>
        {/* 캘린더 섹션 */}
        <section
          id="editor-section-calendar"
          className="base-section relative select-none  large bg-white w-full"
          style={{ zIndex: 7 }}
        >
          <h2
            id="calendarEngTitle"
            data-aos="fade-up"
            className="section-label whitespace-pre-wrap text-center pt-4 text-sm text-gray-400 tracking-wider"
          >
            <div style={{ color: "#d099a1" }}>Gallery</div>
          </h2>
          {/* 점선 구분선 */}
        </section>
        {/* 갤러리 섹션 */}
        <section id="gallery" className="py-8 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            {/* 안내 문구 */}
            <p className="text-center text-xs text-gray-400 mb-8">
              사진을 클릭하면 전체 화면 보기가 가능합니다
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
              {photos
                .slice(0, isGalleryExpanded ? photos.length : 6)
                .map((photo, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => openGallery(index)}
                  >
                    <Image
                      src={photo}
                      alt={`Gallery ${index + 1}`}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      quality={70}
                      sizes="(max-width: 768px) 50vw, 300px"
                    />
                  </div>
                ))}
            </div>

            {/* 더보기/접기 버튼 */}
            {photos.length > 6 && (
              <div className="flex justify-center mt-8 mb-4">
                <button
                  onClick={handleToggleGallery}
                  disabled={isLoadingMore}
                  className="px-8 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 hover:shadow-lg disabled:opacity-50"
                  style={{
                    backgroundColor: "rgba(250, 248, 248, 1)",
                    color: "rgba(173, 134, 139, 1)",
                    border: "1px solid rgba(173, 134, 139, 0.3)",
                  }}
                >
                  {isLoadingMore ? (
                    <>
                      <div
                        className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                        style={{
                          borderColor: "rgba(173, 134, 139, 0.3)",
                          borderTopColor: "transparent",
                        }}
                      ></div>
                      로딩중...
                    </>
                  ) : isGalleryExpanded ? (
                    <>
                      접기
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    </>
                  ) : (
                    <>
                      더보기 ({photos.length - 6}장 더)
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Location 섹션 */}
        <section
          className="relative py-10 px-4"
          style={{ backgroundColor: "rgb(249, 249, 249)" }}
        >
          {/* 웨이브 배경 (상단) */}
          <div className="absolute top-[-10px] left-0 w-full z-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 65"
              preserveAspectRatio="none"
              className="w-full h-5"
            >
              <g
                fill="rgb(249, 249, 249)"
                stroke="none"
                transform="translate(0,65) scale(0.1,-0.1)"
              >
                <path d="M6470 629 c-1061 -34 -2002 -142 -3561 -408 -675 -115 -1198 -174 -1899 -214 -30 -2 2755 -3 6190 -3 3435 0 6225 1 6200 3 -25 1 -126 7 -225 13 -536 32 -1103 100 -1740 210 -737 127 -1570 247 -2110 305 -835 89 -1920 125 -2855 94z"></path>
              </g>
              <g
                fill="rgb(249, 249, 249)"
                stroke="none"
                transform="translate(0,65) scale(0.1,-0.1)"
                className="opacity-60"
              >
                <path d="M0 322 l0 -322 3073 1 c1689 1 3018 5 2952 10 -705 47 -1210 110 -1970 245 -324 57 -1231 193 -1590 238 -665 83 -1301 126 -2117 142 l-348 7 0 -321z"></path>
                <path d="M13880 633 c-743 -17 -1425 -69 -2105 -159 -340 -45 -1173 -172 -1460 -223 -763 -135 -1251 -194 -2020 -244 -27 -2 1335 -4 3028 -5 l3077 -2 0 320 0 320 -207 -2 c-115 -1 -255 -3 -313 -5z"></path>
              </g>
            </svg>
          </div>

          <div className="relative z-20">
            <h2 className="section-label whitespace-pre-wrap pb-8 text-center text-sm text-gray-400 tracking-wider">
              <div style={{ color: "#d099a1" }}>Location</div>
            </h2>

            <div className="max-w-4xl mx-auto">
              {/* Location 내용 */}
              <div className="flex flex-col justify-center items-center">
                <h1 className="text-lg font-bold mb-6 text-black whitespace-pre-wrap">
                  오시는 길
                </h1>

                {/* 점선 구분선 */}
                <div className="mb-12">
                  <hr
                    className="w-64 mx-auto border-t-2 border-dashed"
                    style={{ borderColor: "rgba(173, 134, 139, 0.5)" }}
                  />
                </div>

                {/* 주소 정보 */}
                <div className="w-full text-center mb-12">
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    서울 강남구 테헤란로 406
                    <br />
                    강남 상제리제 센터 2층 르비르모어
                  </p>
                  <div className="mb-4">
                    <a
                      href="tel:02-501-7000"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
                      draggable={false}
                    >
                      <svg
                        className="w-4 h-4 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span className="font-medium">02-501-7000</span>
                    </a>
                  </div>

                  {/* 주소 복사 버튼 */}
                  <button
                    className="copy-btn2 mt-2 mx-auto py-2 px-5 relative flex justify-center items-center h-9 bg-white rounded-lg border text-sm tracking-tighter transition-all duration-300 hover:shadow-lg"
                    style={{ border: "1px solid rgba(173, 134, 139, 0.3)" }}
                    onClick={copyAddress}
                  >
                    <span style={{ color: "rgba(173, 134, 139, 1)" }}>
                      {isCopied ? "복사 완료!" : "주소 복사"}
                    </span>
                    {isCopied ? (
                      <svg
                        key="copied-icon"
                        className="w-4 h-4 ml-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        key="copy-icon"
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: "rgba(173, 134, 139, 1)" }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {/* 지도 영역 */}
                <div className="mb-2  w-full">
                  {/* 네이버 지도 */}
                  <div className="relative h-48 md:h-64 bg-gray-100 rounded-xl overflow-hidden mb-6">
                    <div id="naverMap" className="w-full h-full" />
                    {!isMapLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <div className="text-center p-4">
                          {/* 정적 지도 이미지 (대체 방안) */}
                          <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
                            <svg
                              className="w-8 h-8 text-pink-500 mx-auto mb-2"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                            <div
                              className="text-xs text-gray-600 mb-2 cursor-pointer hover:text-gray-800 transition-colors flex items-center justify-center gap-1"
                              onClick={copyAddress}
                              title={isCopied ? "복사 완료!" : "주소 복사"}
                            >
                              서울 강남구 테헤란로 406
                              {isCopied ? (
                                <svg
                                  key="copied-check"
                                  className="w-3 h-3 text-green-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  key="copy-clipboard"
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                                  />
                                </svg>
                              )}
                            </div>
                          </div>

                          <div className="text-gray-600 text-xs mb-3">
                            지도를 불러오는 중입니다...
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 내비게이션 버튼 - 통합형 */}
                <div className="px-2 flex justify-center w-full mb-4">
                  <div className="flex w-full max-w-[380px]">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 w-full h-[50px] flex items-center justify-between overflow-hidden">
                      {/* 네이버지도 */}
                      <div
                        className="flex items-center justify-center w-1/3 h-full cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          const isMobile =
                            /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                              navigator.userAgent
                            );
                          if (isMobile) {
                            window.location.href =
                              "nmap://search?query=르비르모어";
                          } else {
                            window.open(
                              "https://map.naver.com/p/search/르비르모어",
                              "_blank"
                            );
                          }
                        }}
                      >
                        <div className="flex items-center">
                          <img
                            src="https://cdn2.makedear.com/homepage/img/icon/navermap1.webp"
                            draggable="false"
                            className="w-5 h-5 mr-2"
                            alt="네이버지도"
                          />
                          <span className="text-sm text-gray-700 font-medium">
                            네이버지도
                          </span>
                        </div>
                      </div>

                      {/* 구분선 */}
                      <div className="h-6 w-px bg-gray-200"></div>

                      {/* 카카오내비 */}
                      <div
                        className="flex items-center justify-center w-1/3 h-full cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          const isMobile =
                            /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                              navigator.userAgent
                            );
                          if (isMobile) {
                            window.location.href =
                              "kakaonavi://destination?name=르비르모어&pos=127.0499893,37.5043884";
                          } else {
                            window.open(
                              "https://map.kakao.com/link/search/르비르모어",
                              "_blank"
                            );
                          }
                        }}
                      >
                        <div className="flex items-center">
                          <div className="w-5 h-5 bg-yellow-400 rounded flex items-center justify-center mr-2">
                            <span className="text-white font-bold text-xs">
                              K
                            </span>
                          </div>
                          <span className="text-sm text-gray-700 font-medium">
                            카카오내비
                          </span>
                        </div>
                      </div>

                      {/* 구분선 */}
                      <div className="h-6 w-px bg-gray-200"></div>

                      {/* 티맵 */}
                      <div
                        className="flex items-center justify-center w-1/3 h-full cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          const isMobile =
                            /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                              navigator.userAgent
                            );
                          if (isMobile) {
                            window.location.href =
                              "tmap://search?name=르비르모어";
                          } else {
                            window.open("https://www.tmap.co.kr/", "_blank");
                          }
                        }}
                      >
                        <div className="flex items-center">
                          <img
                            src="https://cdn2.makedear.com/homepage/img/icon/tmap1.png"
                            draggable="false"
                            className="w-4 h-4 mr-2"
                            alt="티맵"
                          />
                          <span className="text-sm text-gray-700 font-medium">
                            티맵
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 웨이브 배경 (하단) */}
          <div className="absolute bottom-0 left-0 w-full z-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 65"
              preserveAspectRatio="none"
              className="w-full h-5"
            >
              <g
                fill="rgb(255, 255, 255)"
                stroke="none"
                transform="translate(0,65) scale(0.1,-0.1)"
              >
                <path d="M6470 629 c-1061 -34 -2002 -142 -3561 -408 -675 -115 -1198 -174 -1899 -214 -30 -2 2755 -3 6190 -3 3435 0 6225 1 6200 3 -25 1 -126 7 -225 13 -536 32 -1103 100 -1740 210 -737 127 -1570 247 -2110 305 -835 89 -1920 125 -2855 94z"></path>
              </g>
              <g
                fill="rgb(255, 255, 255)"
                stroke="none"
                transform="translate(0,65) scale(0.1,-0.1)"
                className="opacity-60"
              >
                <path
                  key="wave-path-1"
                  d="M0 322 l0 -322 3073 1 c1689 1 3018 5 2952 10 -705 47 -1210 110 -1970 245 -324 57 -1231 193 -1590 238 -665 83 -1301 126 -2117 142 l-348 7 0 -321z"
                ></path>
                <path
                  key="wave-path-2"
                  d="M13880 633 c-743 -17 -1425 -69 -2105 -159 -340 -45 -1173 -172 -1460 -223 -763 -135 -1251 -194 -2020 -244 -27 -2 1335 -4 3028 -5 l3077 -2 0 320 0 320 -207 -2 c-115 -1 -255 -3 -313 -5z"
                ></path>
              </g>
            </svg>
          </div>
        </section>

        {/* 오시는 길 상세 섹션 */}
        <section className="py-10 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-label whitespace-pre-wrap pb-8 text-center text-sm text-gray-400 tracking-wider">
              <div style={{ color: "#d099a1" }}>WAY TO COME</div>
            </h2>

            <div className="section-wtc-area-1 px-4 flex flex-col w-full">
              {/* 대중교통 */}
              <div
                data-aos="fade-up"
                className="py-6 first-of-type:pt-0 last-of-type:pb-0"
              >
                <h2 className="section-wtc-area-2 !font-semibold tracking-tight whitespace-pre-wrap pb-4">
                  <div
                    data-aos="fade-up"
                    className="flex items-center justify-start"
                  >
                    <div
                      className="waytocomeicon mr-2 p-2 bg-gray-100 rounded-full"
                      style={{
                        width: "35px",
                        height: "35px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <mask
                          id="mask0_309_5387"
                          maskUnits="userSpaceOnUse"
                          x="0"
                          y="0"
                          width="18"
                          height="18"
                          style={{ maskType: "alpha" }}
                        >
                          <rect width="18" height="18" fill="#EED8D8"></rect>
                        </mask>
                        <g mask="url(#mask0_309_5387)">
                          <path
                            d="M6 14C6.55228 14 7 13.5523 7 13C7 12.4477 6.55228 12 6 12C5.44772 12 5 12.4477 5 13C5 13.5523 5.44772 14 6 14Z"
                            fill="currentColor"
                          ></path>
                          <path
                            d="M12 14C12.5523 14 13 13.5523 13 13C13 12.4477 12.5523 12 12 12C11.4477 12 11 12.4477 11 13C11 13.5523 11.4477 14 12 14Z"
                            fill="currentColor"
                          ></path>
                          <path
                            d="M3.5 8C3.5 6.067 5.067 4.5 7 4.5H11C12.933 4.5 14.5 6.067 14.5 8V14C14.5 14.8284 13.8284 15.5 13 15.5H5C4.17157 15.5 3.5 14.8284 3.5 14V8Z"
                            stroke="currentColor"
                          ></path>
                          <line
                            x1="3"
                            y1="10.5"
                            x2="14"
                            y2="10.5"
                            stroke="currentColor"
                          ></line>
                          <line
                            x1="7"
                            y1="2.5"
                            x2="11"
                            y2="2.5"
                            stroke="currentColor"
                          ></line>
                          <path
                            d="M0.5 17.5V8.5C0.5 4.08172 4.08172 0.5 8.5 0.5H9.5C13.9183 0.5 17.5 4.08172 17.5 8.5V17.5"
                            stroke="currentColor"
                            strokeLinecap="square"
                          ></path>
                          <line
                            y1="-0.5"
                            x2="5.83095"
                            y2="-0.5"
                            transform="matrix(-0.514496 0.857493 -0.729537 -0.683941 6 15)"
                            stroke="currentColor"
                          ></line>
                          <line
                            y1="-0.5"
                            x2="5.83095"
                            y2="-0.5"
                            transform="matrix(0.514496 0.857493 0.729537 -0.683941 12 15)"
                            stroke="currentColor"
                          ></line>
                        </g>
                      </svg>
                    </div>
                    <div
                      className="font-semibold break-all"
                      style={{ fontSize: "18px" }}
                    >
                      대중교통
                    </div>
                  </div>
                </h2>
                <div
                  data-aos="fade-up"
                  className="section-wtc-area-3 pt-4 border-t border-dashed tracking-tighter break-all whitespace-pre-wrap text-left"
                  style={{ borderColor: "rgba(173, 134, 139, 0.3)" }}
                >
                  <p className="mb-2">
                    <span style={{ color: "#00a84d" }}>●</span>{" "}
                    <strong>지하철 2호선</strong>,{" "}
                    <span style={{ color: "#FFC224" }}>●</span>{" "}
                    <strong>수인분당선 선릉역</strong>
                  </p>
                  <p className="ml-4 text-gray-700">
                    1번출구 이용시 연결 통로 이동
                  </p>
                </div>
              </div>

              {/* 자동차 */}
              <div
                data-aos="fade-up"
                className="py-6 first-of-type:pt-0 last-of-type:pb-0"
              >
                <h2 className="section-wtc-area-2 !font-semibold tracking-tight whitespace-pre-wrap pb-4">
                  <div
                    data-aos="fade-up"
                    className="flex items-center justify-start"
                  >
                    <div
                      className="waytocomeicon mr-2 p-2 bg-gray-100 rounded-full"
                      style={{
                        width: "35px",
                        height: "35px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <mask
                          id="mask0_309_5402"
                          maskUnits="userSpaceOnUse"
                          x="0"
                          y="0"
                          width="18"
                          height="18"
                          style={{ maskType: "alpha" }}
                        >
                          <rect
                            width="18"
                            height="18"
                            fill="currentColor"
                          ></rect>
                        </mask>
                        <g mask="url(#mask0_309_5402)">
                          <path
                            d="M4 11C4.55228 11 5 10.5523 5 10C5 9.44772 4.55228 9 4 9C3.44772 9 3 9.44772 3 10C3 10.5523 3.44772 11 4 11Z"
                            fill="currentColor"
                          ></path>
                          <path
                            d="M14 11C14.5523 11 15 10.5523 15 10C15 9.44772 14.5523 9 14 9C13.4477 9 13 9.44772 13 10C13 10.5523 13.4477 11 14 11Z"
                            fill="currentColor"
                          ></path>
                          <path
                            d="M16 7.5H2"
                            stroke="currentColor"
                            strokeMiterlimit="10"
                          ></path>
                          <path
                            d="M18 7H15L16 9H18V7Z"
                            fill="currentColor"
                          ></path>
                          <path d="M3 7H0V9H2L3 7Z" fill="currentColor"></path>
                          <path
                            d="M1.5 15V10L3 7.5L3.72147 3.1712C3.8822 2.20683 4.71658 1.5 5.69425 1.5H12.3057C13.2834 1.5 14.1178 2.20683 14.2785 3.1712L15 7.5L16.5 10V15H1.5Z"
                            stroke="currentColor"
                          ></path>
                          <path
                            d="M13 15H16V17.5C16 17.7761 15.7761 18 15.5 18H13.5C13.2239 18 13 17.7761 13 17.5V15Z"
                            fill="currentColor"
                          ></path>
                          <path
                            d="M2 15H5V17.5C5 17.7761 4.77614 18 4.5 18H2.5C2.22386 18 2 17.7761 2 17.5V15Z"
                            fill="currentColor"
                          ></path>
                          <line
                            x1="3"
                            y1="12.5"
                            x2="15"
                            y2="12.5"
                            stroke="currentColor"
                          ></line>
                        </g>
                      </svg>
                    </div>
                    <div
                      className="font-semibold break-all"
                      style={{ fontSize: "18px" }}
                    >
                      자동차
                    </div>
                  </div>
                </h2>
                <div
                  data-aos="fade-up"
                  className="section-wtc-area-3 pt-4 border-t border-dashed tracking-tighter break-all whitespace-pre-wrap text-left"
                  style={{ borderColor: "rgba(173, 134, 139, 0.3)" }}
                >
                  <p className="text-gray-700">
                    <strong>· 네비게이션</strong>
                  </p>
                  <p className="ml-4 text-gray-700">
                    &quot;샹제리제 센터&quot; 또는 &quot;르비르모어&quot; 검색
                  </p>
                </div>
              </div>

              {/* 주차 */}
              <div
                data-aos="fade-up"
                className="py-6 first-of-type:pt-0 last-of-type:pb-0"
              >
                <h2 className="section-wtc-area-2 !font-semibold tracking-tight whitespace-pre-wrap pb-4">
                  <div
                    data-aos="fade-up"
                    className="flex items-center justify-start"
                  >
                    <div
                      className="waytocomeicon mr-2 p-2 bg-gray-100 rounded-full"
                      style={{
                        width: "35px",
                        height: "35px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        fill="currentColor"
                        stroke="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.0"
                        viewBox="0 0 281 320"
                      >
                        <path d="M63.3 21.4c-11.2 2.8-18.7 10.5-21.8 22.3-2.1 8.1-2.3 244.5-.2 249.6 1.9 4.3 4 5.9 8.1 6 4.7.1 8.3-2 9.6-5.6.6-1.9 1-19.3 1-48.3V200h44.8c24.6 0 48.8-.5 53.7-1 39.1-4.4 68.4-29.3 78.1-66.5 5-19 3-42.5-5-60-9.2-20.2-26-36.3-46.6-44.8-16.3-6.7-18.3-6.9-70-7.3-35.7-.2-47.7 0-51.7 1zm107.5 21.3c7.4 2.5 17.8 8.1 23.4 12.6 5.9 4.7 14.2 15.1 18.3 22.8 9.8 18.8 10.1 43.8.5 63-8.1 16.5-22.8 29.3-40.5 35.6l-8 2.8-52.2.3-52.3.3V114c0-70.4 0-70.1 4.7-73 1.2-.7 17.7-.9 50.8-.7 46.6.3 49.3.4 55.3 2.4z"></path>
                      </svg>
                    </div>
                    <div
                      className="font-semibold break-all"
                      style={{ fontSize: "18px" }}
                    >
                      주차
                    </div>
                  </div>
                </h2>
                <div
                  data-aos="fade-up"
                  className="section-wtc-area-3 pt-4 border-t border-dashed tracking-tighter break-all whitespace-pre-wrap text-left"
                  style={{ borderColor: "rgba(173, 134, 139, 0.3)" }}
                >
                  <p className="mb-2">
                    <strong>·</strong> 자가용 이용 시{" "}
                    <mark
                      style={{
                        backgroundColor: "#fff8b2",
                        padding: "2px 4px",
                      }}
                    >
                      무료주차 2시간
                    </mark>
                  </p>
                  <p className="text-gray-700">
                    <strong>·</strong> 로비 월컴드링크 데스크에서 주차 등록 후
                    출차
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 안내사항 섹션 */}
        <section
          id="information"
          className="py-8 px-4 bg-white"
          ref={(el) => {
            sectionRefs.current[6] = el;
          }}
        >
          <div className="max-w-md mx-auto">
            {/* 영문 제목 */}
            {/* 영문 제목 */}
            <h2 className="section-label whitespace-pre-wrap pb-8 text-center text-sm text-gray-400 tracking-wider">
              <div style={{ color: "#d099a1" }}>INFORMATION</div>
            </h2>
            {/* 한국어 제목 */}
            <h2
              className={`text-center text-lg font-bold text-gray-800 mb-8 transition-all duration-700 delay-100 ${
                visibleSections[6]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              안내사항
            </h2>

            {/* 포토부스 이미지 */}
            <div className="mb-12 px-4">
              <img
                src="/img/info/photobox.jpg"
                alt="포토부스&포토방명록"
                className="w-full rounded-xl object-cover shadow-lg"
                draggable={false}
              />
            </div>

            {/* 탭 메뉴 */}
            <div
              className={`flex w-full mb-12 transition-all duration-700 delay-200 ${
                visibleSections[6]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <button
                onClick={() => setActiveInfoTab(0)}
                className={`flex-1 h-10 flex items-center justify-center text-sm font-semibold border-t border-l border-r rounded-t-xl transition-all ${
                  activeInfoTab === 0
                    ? "bg-white border-gray-300 text-gray-800 border-b-0 -mb-px"
                    : "bg-gray-50 border-gray-200 text-gray-500 border-b"
                }`}
              >
                식사
              </button>
              <button
                onClick={() => setActiveInfoTab(1)}
                className={`flex-1 h-10 flex items-center justify-center text-sm font-semibold border-t border-l border-r rounded-t-xl transition-all ${
                  activeInfoTab === 1
                    ? "bg-white border-gray-300 text-gray-800 border-b-0 -mb-px"
                    : "bg-gray-50 border-gray-200 text-gray-500 border-b"
                }`}
              >
                주차
              </button>
              <button
                onClick={() => setActiveInfoTab(2)}
                className={`flex-1 h-10 flex items-center justify-center text-sm font-semibold border-t border-l border-r rounded-t-xl transition-all ${
                  activeInfoTab === 2
                    ? "bg-white border-gray-300 text-gray-800 border-b-0 -mb-px"
                    : "bg-gray-50 border-gray-200 text-gray-500 border-b"
                }`}
              >
                예식
              </button>
            </div>

            {/* 탭 콘텐츠 */}
            <div className="relative overflow-hidden">
              {/* 식사 탭 */}
              {activeInfoTab === 0 && (
                <div
                  key="meal-tab"
                  className={`transition-all duration-700 delay-300 ${
                    visibleSections[6]
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  <div className="mb-6 px-4">
                    <img
                      src="/img/info/food.PNG"
                      alt="식사 안내"
                      className="w-full rounded-xl object-cover aspect-[2/1]"
                      draggable={false}
                    />
                  </div>
                  <div className="text-center text-gray-700 leading-relaxed space-y-2 mb-8">
                    <p>한식, 양식, 중식, 일식 등 </p>
                    <p>여러 종류의 요리가 마련되며,</p>
                    <p className="mt-4">고기류, 채식 메뉴까지</p>
                    <p>다채로운 구성의 뷔페가 마련되어 있습니다.</p>
                    <p>따뜻한 마음으로 준비한 식사를</p>
                    <p>편안히 즐겨주시기 바랍니다.</p>
                  </div>
                  <div className="flex justify-center">
                    <a
                      href="https://www.xn--2w2ba83gt2hc4l.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium inline-block"
                    >
                      르비르모어 구경하기
                    </a>
                  </div>
                </div>
              )}

              {/* 장소 탭 */}
              {activeInfoTab === 1 && (
                <div
                  key="venue-tab"
                  className={`transition-all duration-700 delay-300 ${
                    visibleSections[6]
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  <div className="mb-6 px-4">
                    <img
                      src="https://cdn2.makedear.com/homepage/img/detail/161.jpg"
                      alt="웨딩홀"
                      className="w-full rounded-xl object-cover aspect-[2/1]"
                      draggable={false}
                    />
                  </div>
                  <div className="text-center text-gray-700 leading-relaxed space-y-2 mb-8">
                    <p>웨딩홀 지하 3층 ~ 6층</p>
                    <p>450대 주차가 가능하고</p>
                    <p className="mt-4">2시간 무료주차가 가능합니다.</p>
                  </div>
                  <div className="flex justify-center">
                    <a
                      href="https://www.xn--2w2ba83gt2hc4l.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium inline-block"
                    >
                      르비르모어 구경하기
                    </a>
                  </div>
                </div>
              )}

              {/* 예식 탭 */}
              {activeInfoTab === 2 && (
                <div
                  key="ceremony-tab"
                  className={`transition-all duration-700 delay-300 ${
                    visibleSections[6]
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  <div className="mb-6 px-4">
                    <img
                      src="/img/info/mainplace.PNG"
                      alt="예식장"
                      className="w-full rounded-xl object-cover aspect-[2/1]"
                      draggable={false}
                    />
                  </div>
                  <div className="text-center text-gray-700 leading-relaxed space-y-2 mb-8">
                    <p>클리타홀에서 저희 두 사람의</p>
                    <p>웨딩이 진행 됩니다.</p>
                    <p>2층 로비에서 웰컴드링크 및 대형스크린이</p>
                    <p>준비되어 있습니다.</p>
                    <p className="mt-4">따뜻한 축복의 마음으로 함께 해주시면</p>
                    <p>감사하겠습니다.</p>
                  </div>
                  <div className="flex justify-center">
                    <a
                      href="https://www.xn--2w2ba83gt2hc4l.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium inline-block"
                    >
                      르비르모어 구경하기
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 인스타그램 피드 스타일 섹션 */}
        <section className="py-8 px-4 bg-white">
          <div className="max-w-md mx-auto">
            <div className="px-4">
              {/* 인스타그램 카드 */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {/* 헤더 - 프로필 */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px]">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white p-[2px]">
                        <Image
                          src="https://edi-img.s3.ap-northeast-2.amazonaws.com/uploads/merry/IMG_4981-2.jpg"
                          alt="Profile"
                          width={36}
                          height={36}
                          className="w-full h-full object-cover rounded-full"
                          loading="lazy"
                          quality={70}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-semibold">
                      Groom &amp; Bride
                    </span>
                  </div>
                  <button className="text-gray-700">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="1" fill="currentColor" />
                      <circle cx="12" cy="5" r="1" fill="currentColor" />
                      <circle cx="12" cy="19" r="1" fill="currentColor" />
                    </svg>
                  </button>
                </div>

                {/* 메인 이미지 */}
                <div className="w-full aspect-square bg-gray-100">
                  <Image
                    src="https://edi-img.s3.ap-northeast-2.amazonaws.com/uploads/merry/IMG_4981-2.jpg"
                    alt="Wedding Photo"
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    quality={75}
                    sizes="(max-width: 768px) 100vw, 500px"
                  />
                </div>

                {/* 액션 버튼 */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      {/* 좋아요 */}
                      <button className="hover:text-gray-500 transition-colors">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                      </button>
                      {/* 댓글 */}
                      <button className="hover:text-gray-500 transition-colors">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </button>
                      {/* 공유 */}
                      <button className="hover:text-gray-500 transition-colors">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="22" y1="2" x2="11" y2="13"></line>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                      </button>
                    </div>
                    {/* 북마크 */}
                    <button className="hover:text-gray-500 transition-colors">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </button>
                  </div>

                  {/* 좋아요 수 */}
                  <div className="mb-2">
                    <span className="text-sm font-semibold">❤ 532 Likes</span>
                  </div>

                  {/* 캡션 */}
                  <div className="text-sm">
                    <span className="font-semibold">Happy Wedding Day</span>
                    <br />
                    <span className="text-gray-700">
                      we are getting married
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 마음 전하실 곳 */}
        <section id="account" className="mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2
              id="calendarEngTitle"
              data-aos="fade-up"
              className="section-label whitespace-pre-wrap pb-8 text-center pt-4 text-sm text-gray-400 tracking-wider"
            >
              <div style={{ color: "#d099a1" }}>ACCOUNT</div>
            </h2>
            <h3 className="text-xl font-medium text-gray-800 text-center mb-6">
              마음 전하실 곳
            </h3>
            <div className="text-center text-sm text-gray-600 mb-8 leading-relaxed">
              참석이 어려우신 분들을 위해 계좌번호를 기재하였습니다.
              <br />
              <br />
              너그러운 마음으로 양해 부탁드립니다.
              <br />
              <br />
              진심으로 주신 마음은 소중히 간직하여
              <br />
              좋은 부부의 모습으로 보답하겠습니다.
            </div>

            <div className="space-y-3">
              {/* 신랑측 드롭다운 */}
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setIsGroomAccountOpen(!isGroomAccountOpen)}
                  className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-800">
                    신랑측
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      isGroomAccountOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isGroomAccountOpen && (
                  <div className="border-t border-gray-200">
                    {/* 신랑 박용준 */}
                    <div
                      key="groom-박용준"
                      className="p-4 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-800">
                            신랑 박용준
                          </div>
                          <div className="text-xs text-gray-600">
                            국민 123-456-789012
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              copyAccountNumber("123-456-789012", "신랑 박용준")
                            }
                            className={`px-3 py-1 text-xs border rounded transition-colors ${
                              copiedAccount === "신랑 박용준"
                                ? "text-green-600 border-green-300 bg-green-50"
                                : "text-gray-600 border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {copiedAccount === "신랑 박용준"
                              ? "복사됨!"
                              : "복사"}
                          </button>
                          <button className="px-3 py-1 text-xs text-white bg-yellow-400 rounded font-medium">
                            pay
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 아버지 박문식 */}
                    <div
                      key="groom-father-박문식"
                      className="p-4 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-800">
                            아버지 박문식
                          </div>
                          <div className="text-xs text-gray-600">
                            NH농협 123-4567-890123
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              copyAccountNumber(
                                "123-4567-890123",
                                "아버지 박문식"
                              )
                            }
                            className={`px-3 py-1 text-xs border rounded transition-colors ${
                              copiedAccount === "아버지 박문식"
                                ? "text-green-600 border-green-300 bg-green-50"
                                : "text-gray-600 border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {copiedAccount === "아버지 박문식"
                              ? "복사됨!"
                              : "복사"}
                          </button>
                          <button className="px-3 py-1 text-xs text-white bg-yellow-400 rounded font-medium">
                            pay
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 어머니 노영임 */}
                    <div
                      key="groom-mother-노영임"
                      className="p-4 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-800">
                            어머니 노영임
                          </div>
                          <div className="text-xs text-gray-600">
                            하나 123-4567-890123
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              copyAccountNumber(
                                "123-4567-890123",
                                "어머니 노영임"
                              )
                            }
                            className={`px-3 py-1 text-xs border rounded transition-colors ${
                              copiedAccount === "어머니 노영임"
                                ? "text-green-600 border-green-300 bg-green-50"
                                : "text-gray-600 border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {copiedAccount === "어머니 노영임"
                              ? "복사됨!"
                              : "복사"}
                          </button>
                          <button className="px-3 py-1 text-xs text-white bg-yellow-400 rounded font-medium">
                            pay
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 신부측 드롭다운 */}
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setIsBrideAccountOpen(!isBrideAccountOpen)}
                  className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-800">
                    신부측
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      isBrideAccountOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isBrideAccountOpen && (
                  <div className="border-t border-gray-200">
                    {/* 신부 김이슬 */}
                    <div
                      key="bride-김이슬"
                      className="p-4 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-800">
                            신부 김이슬
                          </div>
                          <div className="text-xs text-gray-600">
                            카카오뱅크 123-4567-890123
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              copyAccountNumber(
                                "123-4567-890123",
                                "신부 김이슬"
                              )
                            }
                            className={`px-3 py-1 text-xs border rounded transition-colors ${
                              copiedAccount === "신부 김이슬"
                                ? "text-green-600 border-green-300 bg-green-50"
                                : "text-gray-600 border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {copiedAccount === "신부 김이슬"
                              ? "복사됨!"
                              : "복사"}
                          </button>
                          <button className="px-3 py-1 text-xs text-white bg-yellow-400 rounded font-medium">
                            pay
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 아버지 김도수 */}
                    <div
                      key="bride-father-김도수"
                      className="p-4 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-800">
                            아버지 김도수
                          </div>
                          <div className="text-xs text-gray-600">
                            하나 123-4567-890123
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              copyAccountNumber(
                                "123-4567-890123",
                                "아버지 김도수"
                              )
                            }
                            className={`px-3 py-1 text-xs border rounded transition-colors ${
                              copiedAccount === "아버지 김도수"
                                ? "text-green-600 border-green-300 bg-green-50"
                                : "text-gray-600 border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {copiedAccount === "아버지 김도수"
                              ? "복사됨!"
                              : "복사"}
                          </button>
                          <button className="px-3 py-1 text-xs text-white bg-yellow-400 rounded font-medium">
                            pay
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 어머니 박언자 */}
                    <div
                      key="bride-mother-박언자"
                      className="p-4 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-800">
                            어머니 박언자
                          </div>
                          <div className="text-xs text-gray-600">
                            하나 123-4567-890123
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              copyAccountNumber(
                                "123-4567-890123",
                                "어머니 박언자"
                              )
                            }
                            className={`px-3 py-1 text-xs border rounded transition-colors ${
                              copiedAccount === "어머니 박언자"
                                ? "text-green-600 border-green-300 bg-green-50"
                                : "text-gray-600 border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {copiedAccount === "어머니 박언자"
                              ? "복사됨!"
                              : "복사"}
                          </button>
                          <button className="px-3 py-1 text-xs text-white bg-yellow-400 rounded font-medium">
                            pay
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 방명록 */}
        <section id="guestbook" className="mb-20 bg-gray-50 py-16">
          <div className="max-w-4xl mx-auto px-8">
            {/* 제목 섹션 */}
            <div className="text-center mb-6">
              <h2
                id="calendarEngTitle"
                data-aos="fade-up"
                className="section-label whitespace-pre-wrap pb-8 text-center text-sm text-gray-400 tracking-wider"
              >
                <div style={{ color: "#d099a1" }}>CALENDAR</div>
              </h2>
              <h2
                className={`text-center text-lg font-bold text-gray-800 mb-8 transition-all duration-700 delay-100 ${
                  visibleSections[6]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                방명록
              </h2>
              <div className="mb-12">
                <hr
                  className="w-64 mx-auto border-t-2 border-dashed"
                  style={{ borderColor: "rgba(173, 134, 139, 0.5)" }}
                />
              </div>
              <div className="text-center text-sm text-gray-600 leading-relaxed">
                <p>따뜻한 마음이 담긴 축하의 글을 남겨주시면</p>
                <p>소중한 추억으로 간직하겠습니다.</p>
              </div>
            </div>

            {/* 방명록 컨텐츠 */}
            <div className="">
              {/* 글쓰기 버튼 */}
              <div className="mb-6">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full h-9 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  글쓰기
                </button>
              </div>

              {/* 방명록 목록 */}
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
                  <p className="mt-4 text-gray-600">방명록을 불러오는 중...</p>
                </div>
              ) : guestbooks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">
                    첫 번째 축하 메시지를 남겨주세요!
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {guestbooks
                    .slice(
                      currentPage * itemsPerPage,
                      (currentPage + 1) * itemsPerPage
                    )
                    .map((entry, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-sm transition-shadow"
                        style={{
                          animationDelay: `${index * 0.1}s`,
                        }}
                      >
                        {/* 헤더 - 이름 */}
                        <div className="flex items-center mb-4">
                          <span className="font-medium text-gray-800">
                            {entry.name}
                          </span>
                        </div>

                        {/* 메시지 내용 */}
                        <div>
                          <div className="text-base text-gray-700 break-all leading-relaxed">
                            {entry.content}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="pt-8 flex items-center justify-center gap-1">
                  {/* 이전 페이지 버튼 */}
                  <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  {/* 페이지 번호 버튼들 */}
                  <div className="flex items-center justify-center gap-1 mx-4">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                          currentPage === i
                            ? "bg-gray-800 text-white shadow-sm"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  {/* 다음 페이지 버튼 */}
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
                    }
                    disabled={currentPage === totalPages - 1}
                    className="flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Thank You 섹션 */}
      <section className="w-full pt-16 pb-28 bg-black">
        <div className="max-w-[430px] mx-auto px-6">
          {/* 타이틀 */}
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-serif text-zinc-200 mb-6">
              Thank You
            </h2>
            <p className="text-base md:text-lg text-zinc-300 leading-relaxed">
              축하해주시는 모든 분들께 진심으로 감사드립니다.
              <br />
              신랑, 신부에게 언제든 축하 인사 건네주시면 기쁘게
              답장드리겠습니다.
            </p>
          </div>

          {/* 슬라이드쇼 */}
          <div className="relative w-full mt-12">
            <div
              className="w-full overflow-hidden"
              style={{
                transform: "rotate(-3deg)",
                maskImage:
                  "linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 25%, rgb(0, 0, 0) 75%, rgba(0, 0, 0, 0) 100%)",
                WebkitMaskImage:
                  "linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 25%, rgb(0, 0, 0) 75%, rgba(0, 0, 0, 0) 100%)",
              }}
            >
              <div
                ref={slideRef}
                className="flex gap-3 items-center"
                style={{
                  transform: `translateX(${slidePosition}px)`,
                  willChange: "transform",
                }}
              >
                {/* 이미지들을 세 번 반복해서 무한 슬라이드 효과 */}
                {[...Array(3)].map((_, setIndex) => (
                  <React.Fragment key={setIndex}>
                    {Array.from({ length: 10 }, (_, i) => (
                      <div
                        key={i}
                        className="relative flex-shrink-0 w-48 h-72 rounded overflow-hidden"
                      >
                        <Image
                          src={`https://edi-img.s3.ap-northeast-2.amazonaws.com/uploads/merry/${
                            i + 1
                          }.jpg`}
                          alt={`Wedding Photo ${i + 1}`}
                          width={192}
                          height={288}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          quality={85}
                          sizes="192px"
                          unoptimized={false}
                        />
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 하단 컨트롤 바 */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[9999] flex justify-center items-center w-[44rem] bg-white border-t border-t-[#eee] drop-shadow-2xl"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-center">
          <button
            onClick={toggleBGM}
            draggable={false}
            className="py-[.8em] px-[1em] flex justify-center items-center cursor-pointer hover:bg-gray-50 transition-colors"
          >
            {isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-[1.5em] text-pink-500"
              >
                <path d="M16 9C16.5 9.5 17 10.5 17 12C17 13.5 16.5 14.5 16 15M19 6C20.5 7.5 21 10 21 12C21 14 20.5 16.5 19 18M13 3L7 8H5C3.89543 8 3 8.89543 3 10V14C3 15.1046 3.89543 16 5 16H7L13 21V3Z"></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-[1.5em] text-black"
              >
                <path d="M16 9C16.5 9.5 17 10.5 17 12C17 13.5 16.5 14.5 16 15M19 6C20.5 7.5 21 10 21 12C21 14 20.5 16.5 19 18M13 3L7 8H5C3.89543 8 3 8.89543 3 10V14C3 15.1046 3.89543 16 5 16H7L13 21V3Z"></path>
                <line x1="3" y1="3" x2="21" y2="21" strokeWidth="1"></line>
              </svg>
            )}
          </button>

          <div className="h-[1.4rem] w-[1px] border-r border-gray-300"></div>

          <button
            draggable={false}
            className="py-[.8em] px-[1em] flex justify-center items-center cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-[1.6em] text-black"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>

          <div className="h-[1.4rem] w-[1px] border-r border-gray-300"></div>

          <button
            draggable={false}
            onClick={() => setIsShareModalOpen(true)}
            className="py-[.8em] px-[1em] flex justify-center items-center cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              className="h-[1.6em] text-black"
            >
              <path
                stroke="currentColor"
                strokeWidth="1"
                d="M8.68439 10.6578L15.3125 7.34375M15.3156 16.6578L8.6938 13.3469M21 6C21 7.65685 19.6569 9 18 9C16.3431 9 15 7.65685 15 6C15 4.34315 16.3431 3 18 3C19.6569 3 21 4.34315 21 6ZM9 12C9 13.6569 7.65685 15 6 15C4.34315 15 3 13.6569 3 12C3 10.3431 4.34315 9 6 9C7.65685 9 9 10.3431 9 12ZM21 18C21 19.6569 19.6569 21 18 21C16.3431 21 15 19.6569 15 18C15 16.3431 16.3431 15 18 15C19.6569 15 21 16.3431 21 18Z"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* 토스트 알림 */}
      {showToast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-out animate-bounce">
          <div className="bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg border border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">{toastMessage}</span>
            </div>
          </div>
        </div>
      )}

      {/* GuestbookModal 컴포넌트 */}
      <GuestbookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={submitGuestbook}
      />

      {/* BGM 오디오 엘리먼트 */}
      <audio ref={audioRef} loop autoPlay muted preload="auto">
        <source src="/bgm.mp3" type="audio/mpeg" />
      </audio>

      {/* 공유 모달 */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">공유하기</h3>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* URL 복사 버튼 */}
              <button
                onClick={copyUrl}
                className="w-full flex items-center justify-center space-x-3 bg-gray-100 hover:bg-gray-200 rounded-xl p-4 transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M8 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H16C17.1046 21 18 20.1046 18 19V17M8 5C8 6.10457 8.89543 7 10 7H12C13.1046 7 14 6.10457 14 5M8 5C8 3.89543 8.89543 3 10 3H12C13.1046 3 14 3.89543 14 5M16 3H18C19.1046 3 20 3.89543 20 5V7C20 8.10457 19.1046 9 18 9H16C14.8954 9 14 8.10457 14 7V5C14 3.89543 14.8954 3 16 3Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-gray-700 font-medium">URL 복사</span>
              </button>

              {/* 카카오톡 공유 버튼 */}
              <button
                id="kakaotalk-share-btn"
                onClick={shareToKakao}
                className="w-full flex items-center justify-center space-x-3 bg-yellow-400 hover:bg-yellow-500 rounded-xl p-4 transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C6.48 2 2 5.64 2 10c0 2.49 1.62 4.69 4.07 6.27L5.5 21l4.71-2.69C10.87 18.5 11.42 18.5 12 18.5c5.52 0 10-3.64 10-8S17.52 2 12 2z"
                    fill="currentColor"
                  />
                </svg>
                <span className="text-gray-800 font-medium">카카오톡 공유</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WeddingInvitation() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WeddingInvitationContent />
    </Suspense>
  );
}
