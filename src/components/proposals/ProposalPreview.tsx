"use client";

import { useState } from "react";
import type { GeneratedProposal } from "@/lib/ai/proposalGenerator";

interface ProposalPreviewProps {
  original: string;
  generated: GeneratedProposal;
  onConfirm: () => void;
  onReject: () => void;
  onEdit: (proposal: GeneratedProposal) => void;
  isLoading?: boolean;
}

export default function ProposalPreview({
  original,
  generated,
  onConfirm,
  onReject,
  onEdit,
  isLoading = false,
}: ProposalPreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProposal, setEditedProposal] = useState(generated);

  return (
    <div className="space-y-6">
      {/* 原始诉求 */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-700">原始诉求</h3>
        <p className="mt-2 text-gray-600">{original}</p>
      </div>

      {/* AI 生成的提案 */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-700">AI 生成的提案</h3>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
              className="text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50"
            >
              编辑
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                标题
              </label>
              <input
                type="text"
                value={editedProposal.title}
                onChange={(e) =>
                  setEditedProposal({
                    ...editedProposal,
                    title: e.target.value,
                  })
                }
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                内容
              </label>
              <textarea
                value={editedProposal.content}
                onChange={(e) =>
                  setEditedProposal({
                    ...editedProposal,
                    content: e.target.value,
                  })
                }
                rows={8}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                摘要
              </label>
              <textarea
                value={editedProposal.summary}
                onChange={(e) =>
                  setEditedProposal({
                    ...editedProposal,
                    summary: e.target.value,
                  })
                }
                rows={2}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                标签
              </label>
              <input
                type="text"
                value={editedProposal.tags.join(", ")}
                onChange={(e) =>
                  setEditedProposal({
                    ...editedProposal,
                    tags: e.target.value.split(",").map((tag) => tag.trim()),
                  })
                }
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="用逗号分隔多个标签"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  onEdit(editedProposal);
                  setIsEditing(false);
                }}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                保存修改
              </button>
              <button
                onClick={() => {
                  setEditedProposal(generated);
                  setIsEditing(false);
                }}
                disabled={isLoading}
                className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                取消
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700">标题</h4>
              <p className="mt-1 text-gray-600">{editedProposal.title}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700">内容</h4>
              <p className="mt-1 text-gray-600 whitespace-pre-wrap">
                {editedProposal.content}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700">摘要</h4>
              <p className="mt-1 text-gray-600">{editedProposal.summary}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700">标签</h4>
              <div className="mt-1 flex gap-2">
                {editedProposal.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-end gap-4">
        <button
          onClick={onReject}
          disabled={isLoading || isEditing}
          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
        >
          拒绝
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading || isEditing}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading && (
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {isLoading ? "提交中..." : "确认提交"}
        </button>
      </div>
    </div>
  );
}
