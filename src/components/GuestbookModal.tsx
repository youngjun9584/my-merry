"use client";

import { useState } from "react";
import { X, Heart } from "lucide-react";

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

    if (formData.content.length > 600) {
      alert("메시지는 600자를 초과할 수 없습니다.");
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
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-rose-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="text-xl">💌</div>
            <h2 className="text-xl font-medium text-gray-800">축하 메시지</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mb-6">
          <p className="text-rose-600 text-sm">
            따뜻한 마음을 담은 메시지를 남겨주세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              성함
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="이름을 입력해주세요"
              maxLength={50}
              className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300 text-sm bg-rose-50/30"
              required
            />
            <div className="text-right text-xs text-rose-400 mt-1">
              {formData.name.length}/50
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              축하 메시지
            </label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              placeholder="두 분의 앞날을 축복하는 따뜻한 메시지를 남겨주세요 💕"
              maxLength={600}
              rows={5}
              className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300 resize-none text-sm bg-rose-50/30"
              required
            />
            <div className="text-right text-xs text-rose-400 mt-1">
              {formData.content.length}/600
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-rose-400 to-pink-400 text-white rounded-xl font-medium hover:from-rose-500 hover:to-pink-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>전송 중...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>💕 축하 메시지 보내기 💕</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
