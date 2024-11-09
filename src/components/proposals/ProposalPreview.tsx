"use client";

import { GeneratedProposal } from "@/lib/ai/proposalGenerator";
import { useEffect, useState } from "react";

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
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProposal, setEditedProposal] = useState(generated);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* 原始诉求 */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-700">Original Request</h3>
        <p className="mt-2 text-gray-600">{original}</p>
      </div>

      {/* AI 生成的提案 */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-700">Generated Proposal</h3>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
              className="text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50"
            >
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
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
                Content
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
                Summary
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
                Tags
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
                placeholder="Separate multiple tags with commas"
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
                Save Changes
              </button>
              <button
                onClick={() => {
                  setEditedProposal(generated);
                  setIsEditing(false);
                }}
                disabled={isLoading}
                className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Title</h4>
              <p className="mt-1 text-gray-600">{editedProposal.title}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700">Content</h4>
              <p className="mt-1 text-gray-600 whitespace-pre-wrap">
                {editedProposal.content}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700">Summary</h4>
              <p className="mt-1 text-gray-600">{editedProposal.summary}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700">Tags</h4>
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
          Reject
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
          {isLoading ? "Submitting..." : "Confirm Submission"}
        </button>
      </div>
    </div>
  );
}
