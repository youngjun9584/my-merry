"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface GuestbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    relationship: string;
    message: string;
    to: string;
    password: string;
  }) => Promise<void>;
}

export default function GuestbookModal({
  isOpen,
  onClose,
  onSubmit,
}: GuestbookModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    message: "",
    to: "신부",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.message || !formData.password) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      setFormData({
        name: "",
        relationship: "",
        message: "",
        to: "신부",
        password: "",
      });
      onClose();
    } catch (error) {
      console.error("방명록 작성 실패:", error);
      alert("방명록 작성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-gray-800">
            축하 메시지 작성하기
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, to: "신랑" }))}
              className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                formData.to === "신랑"
                  ? "bg-blue-100 border-blue-300 text-blue-700"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
            >
              To. 신랑
            </button>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, to: "신부" }))}
              className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                formData.to === "신부"
                  ? "bg-pink-100 border-pink-300 text-pink-700"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
            >
              To. 신부
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              성함 *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="방명록에 보여질 이름을 적어주세요"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              관계
            </label>
            <input
              type="text"
              value={formData.relationship}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  relationship: e.target.value,
                }))
              }
              placeholder="신랑 또는 신부와의 관계를 적어주세요 (생략가능)"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              축하 메시지 *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, message: e.target.value }))
              }
              placeholder="따뜻한 축하 메시지를 남겨주세요"
              rows={4}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호 *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              placeholder="방명록 삭제에 필요한 비밀번호"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-pink-400 text-white rounded-lg font-medium hover:bg-pink-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "작성 중..." : "축하 메시지 보내기"}
          </button>
        </form>
      </div>
    </div>
  );
}
