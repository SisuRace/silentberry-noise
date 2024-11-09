import Link from "next/link";

export default function EmptyState() {
  return (
    <div className="text-center py-12">
      {/* <DocumentPlusIcon className="mx-auto h-12 w-12 text-gray-400" /> */}
      <h3 className="mt-2 text-sm font-semibold text-gray-900">
        No Proposals Yet
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Start creating your first proposal
      </p>
      <div className="mt-6">
        <Link
          href="/proposals/create"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Create Proposal
        </Link>
      </div>
    </div>
  );
}
