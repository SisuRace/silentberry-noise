"use client";

import ProposalForm from "@/components/proposals/ProposalForm";
import BackLink from "@/components/ui/BackLink";
import ClientOnly from "@/components/ui/ClientOnly";

export default function CreateProposalPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <BackLink href="/proposals">Back to Proposals</BackLink>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Proposal</h1>
          <p className="mt-2 text-gray-600">
            Please describe your requirements, AI will help you generate
            standardized proposal content
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <ClientOnly>
              <ProposalForm />
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>
  );
}
