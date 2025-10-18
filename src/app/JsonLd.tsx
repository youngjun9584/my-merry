"use client";

export default function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "박용준 & 김이슬 결혼식",
    description:
      "박용준과 김이슬의 결혼식에 초대합니다. 저희 두 사람의 소중한 시작에 함께 해주세요.",
    startDate: "2025-12-20T15:30:00+09:00",
    endDate: "2025-12-20T17:30:00+09:00",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "강남 상제리제 센터 2층 르비르모어",
      address: {
        "@type": "PostalAddress",
        streetAddress: "테헤란로 406",
        addressLocality: "강남구",
        addressRegion: "서울",
        postalCode: "06192",
        addressCountry: "KR",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 37.5043884,
        longitude: 127.0499893,
      },
      telephone: "+82-2-501-7000",
    },
    image: [
      "https://edi-img.s3.ap-northeast-2.amazonaws.com/uploads/merry/IMG_4981.jpg",
      "https://edi-img.s3.ap-northeast-2.amazonaws.com/uploads/merry/IMG_4981-2.jpg",
    ],
    organizer: [
      {
        "@type": "Person",
        name: "박용준",
        familyName: "박",
        givenName: "용준",
      },
      {
        "@type": "Person",
        name: "김이슬",
        familyName: "김",
        givenName: "이슬",
      },
    ],
    performer: [
      {
        "@type": "Person",
        name: "박용준",
      },
      {
        "@type": "Person",
        name: "김이슬",
      },
    ],
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      price: "0",
      priceCurrency: "KRW",
      validFrom: "2025-01-01T00:00:00+09:00",
    },
    isAccessibleForFree: true,
    inLanguage: "ko",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
