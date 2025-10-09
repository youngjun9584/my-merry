"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface GuestbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; content: string }) => Promise<void>;
}

export default function GuestbookModal({
  isOpen,
  onClose,
  onSubmit,
}: GuestbookModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.content) {
      alert("이름과 메시지를 모두 입력해주세요.");
      return;
    }

    if (formData.name.length > 50) {
      alert("이름은 50자를 초과할 수 없습니다.");
      return;
    }

    if (formData.content.length > 200) {
      alert("메시지는 200자를 초과할 수 없습니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      setFormData({
        name: "",
        content: "",
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
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-gray-800">
            축하 메시지 작성하기
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mb-6">
          <p className="text-gray-600 text-sm">
            저희 둘의 결혼을 함께 축하해 주세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="성함을 남겨주세요"
              maxLength={50}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 text-sm bg-gray-50"
              required
            />
          </div>

          <div>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              placeholder="방명록 내용을 입력해 주세요"
              maxLength={200}
              rows={6}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 resize-none text-sm bg-gray-50"
              required
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              200자 이내로 작성해 주세요
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>전송 중...</span>
                </div>
              ) : (
                <span>작성완료</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
