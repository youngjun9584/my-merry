"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";

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
        {/* Days */}
        <div className="ddaybox dday-bg p-4 flex flex-col justify-center items-center max-w-[5.3rem] max-h-[6rem] rounded-lg border">
          <div className="counttext flex flex-col w-[10vw]">
            <span className="text-2xl">
              {String(timeLeft.days).padStart(2, "0")}
            </span>
            <span className="text-xs CormorantInfant-Medium">Days</span>
          </div>
        </div>

        <span className="counttext colonmb text-sm mx-4">:</span>

        {/* Hours */}
        <div className="ddaybox dday-bg p-4 flex flex-col justify-center items-center max-w-[5.3rem] max-h-[6rem] rounded-lg border">
          <div className="counttext flex flex-col w-[10vw]">
            <span className="text-2xl">
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
            <span className="text-xs CormorantInfant-Medium">Hour</span>
          </div>
        </div>

        <span className="counttext colonmb text-sm mx-4">:</span>

        {/* Minutes */}
        <div className="ddaybox dday-bg p-4 flex flex-col justify-center items-center max-w-[5.3rem] max-h-[6rem] rounded-lg border">
          <div className="counttext flex flex-col w-[10vw]">
            <span className="text-2xl">
              {String(timeLeft.minutes).padStart(2, "0")}
            </span>
            <span className="text-xs CormorantInfant-Medium">Min</span>
          </div>
        </div>

        <span className="counttext colonmb text-sm mx-4">:</span>

        {/* Seconds */}
        <div className="ddaybox dday-bg p-4 flex flex-col justify-center items-center max-w-[5.3rem] max-h-[6rem] rounded-lg border">
          <div className="counttext flex flex-col w-[10vw]">
            <span className="text-2xl">
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
            <span className="text-xs CormorantInfant-Medium">Sec</span>
          </div>
        </div>
      </div>

      {/* 메시지 텍스트 */}
      <div
        data-aos="fade-up"
        className="flex flex-col items-center justify-center text-center break-all whitespace-pre-wrap"
      >
        <p className="text-gray-700">
          용준 <span style={{ color: "#d099a1" }}>♥</span> 이슬의 결혼식이{" "}
          <strong>
            <span style={{ color: "#d099a1" }}>{timeLeft.days}</span>
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

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "rgb(249, 249, 249)" }}
    >
      {/* Hero Section - 메인 이미지 */}
      <div className="relative h-screen w-full">
        <Image
          src="/img/IMG_4981.jpg"
          alt="용준 & 이슬"
          fill
          className="object-cover"
          priority
        />

        {/* 웨이브 배경 - 사진 위에 덮어서 */}
        <div className="absolute bottom-[-1px] left-0 w-full z-10">
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
                  src="/img/IMG_4981-2.jpg"
                  alt="Wedding Photo"
                  width={400}
                  height={500}
                  className="w-full h-auto object-cover"
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
            className="section-label whitespace-pre-wrap !pb-16 text-center font-serif text-sm tracking-widest"
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
                <span className="text-gray-800">박문식</span> ·{" "}
                <span className="text-gray-800">노영임</span>의 아들{" "}
                <span className="font-bold">용준</span>
              </p>
              <p className="text-gray-800 font-medium mt-2">
                <span className="text-gray-800">김도수</span> ·{" "}
                <span className="text-gray-800">박언자</span>의 딸{" "}
                <span className="font-bold">이슬</span>
              </p>
            </div>

            <button
              onClick={openContact}
              className="bg-white text-gray-800 w-full py-3 text-sm font-medium hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
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
                src="/img/park.JPG"
                alt="신랑 사진"
                fill
                className="object-cover select-none pointer-events-none call-out"
                draggable={false}
              />
            </div>

            <div id="portraitFrameShape" className="mx-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="heart-icon w-6 h-6 heart-icon-update text-pink-400"
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
                src="/img/kim.JPG"
                alt="신부 사진"
                fill
                className="object-cover select-none pointer-events-none call-out"
                draggable={false}
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
            <p>강남 상제리제 센터 2층 르비르모어</p>
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
                          <>
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-400 rounded-full animate-ping"></div>
                            <div className="absolute top-[calc(110%)] flex justify-center text-xs font-semibold tracking-tight whitespace-nowrap text-gray-600">
                              <span>3시30분</span>
                            </div>
                          </>
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
        </section>

        {/* 갤러리 섹션 */}
        <section id="gallery" className="mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 text-center mb-6">
              갤러리
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src="/img/IMG_4981.jpg"
                  alt="Gallery 1"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src="/img/gray_front.png"
                  alt="Gallery 2"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 마음 전하실 곳 */}
        <section id="account" className="mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 text-center mb-6">
              마음 전하실 곳
            </h3>
            <div className="text-center text-sm text-gray-600 mb-6">
              참석이 어려우신 분들을 위해 기재했습니다
              <br />
              너그러운 마음으로 양해 부탁드립니다
            </div>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <div className="font-medium text-gray-800">신랑 박용준</div>
                    <div className="text-gray-600">토스뱅크 123-456-789012</div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <div className="font-medium text-gray-800">신부 김이슬</div>
                    <div className="text-gray-600">토스뱅크 123-456-789012</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 오시는 길 */}
        <section id="location" className="mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 text-center mb-6">
              오시는 길
            </h3>

            <div className="text-center mb-6">
              <div className="text-base font-medium text-gray-800 mb-1">
                샹제리제센터
              </div>
              <div className="text-sm text-gray-600 mb-2">
                서울 강남구 테헤란로 406
                <br />
                (역삼동, A동 1층, 2층)
              </div>
              <div className="text-xs text-gray-500">
                📞 02-1588-0100 | 🚇 선릉역 1번출구
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() =>
                  window.open(
                    "https://map.naver.com/p/search/샹제리제센터 테헤란로 406",
                    "_blank"
                  )
                }
                className="w-full py-3 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
              >
                네이버지도 길찾기
              </button>
              <button
                onClick={() =>
                  window.open(
                    "https://tmap.life/route/search?name=샹제리제센터&addr=서울 강남구 테헤란로 406",
                    "_blank"
                  )
                }
                className="w-full py-3 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                T맵 길찾기
              </button>
            </div>
          </div>
        </section>

        {/* 축하 메시지 */}
        <section id="guestbook" className="mb-20">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 text-center mb-6">
              축하 메시지
            </h3>
            <p className="text-center text-sm text-gray-600 mb-6">
              저희 둘에게 따뜻한 축하 메시지를 남겨주세요
            </p>

            <button className="w-full py-3 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
              메시지 남기기
            </button>
          </div>
        </section>
      </div>

      {/* 하단 컨트롤 바 */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[9999] flex justify-center items-center w-[44rem] bg-white border-t border-t-[#eee] drop-shadow-2xl"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-center">
          <button
            draggable={false}
            className="py-[.8em] px-[1em] flex justify-center items-center cursor-pointer"
          >
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
            </svg>
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
