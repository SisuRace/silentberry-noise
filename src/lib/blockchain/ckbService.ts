import { generateDob } from "@/lib/blockchain/dobGenerator";
import { RPC, Script } from "@ckb-lumos/lumos";
import type { Proposal } from "@prisma/client";
import { createCluster, createSpore } from "@spore-sdk/core";
import { config } from "./config";
import { signTransaction } from "./transaction";

export async function createProposal(
  proposal: Proposal,
  walletAddress: string,
  lock: Script
) {
  if (!walletAddress || !lock) {
    return false;
  }

  try {
    // 生成 DOB Cluster
    // const dobCluster = await generateDobCluster({
    //   title: proposal.title,
    //   content: proposal.content,
    //   summary: proposal.summary,
    //   tags: proposal.tags,
    //   creator: walletAddress,
    //   rawContent: proposal.rawContent,
    // });

    const { txSkeleton } = await createCluster({
      data: {
        name: proposal.title,
        description: proposal.summary,
      },
      fromInfos: [walletAddress],
      toLock: lock,
    });

    const tx = await signTransaction(txSkeleton);
    const rpc = new RPC(config.ckbNodeUrl);
    const hash = await rpc.sendTransaction(tx, "passthrough");
    return hash;
  } catch (error) {
    console.error("CKB 提交失败:", error);
    throw new Error("提案上链失败");
  }
}

export async function submitVoteToCKB(
  clusterId: string,
  proposalId: string,
  walletAddress: string,
  support: boolean,
  lock: Script
) {
  if (!walletAddress || !lock) {
    return false;
  }

  try {
    // 生成投票 DOB
    const dob = await generateDob({
      proposalId: proposalId,
      voter: walletAddress,
      support,
      timestamp: Date.now(),
    });

    const { txSkeleton } = await createSpore({
      data: {
        content: dob,
        contentType: "text",
        clusterId,
      },
      fromInfos: [walletAddress],
      toLock: lock,
    });

    const tx = await signTransaction(txSkeleton);
    const rpc = new RPC(config.ckbNodeUrl);
    const hash = await rpc.sendTransaction(tx, "passthrough");
    return hash;
  } catch (error) {
    console.error("投票上链失败:", error);
    throw new Error("投票上链失败");
  }
}
