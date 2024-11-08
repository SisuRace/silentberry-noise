import { CKB } from "@nervosnetwork/ckb-sdk-core";
import { generateDobCluster, generateDob } from "@/lib/blockchain/dobGenerator";
import type { Proposal } from "@prisma/client";

const ckb = new CKB(process.env.NEXT_PUBLIC_CKB_NODE_URL);

export async function submitToCKB(proposal: Proposal, walletAddress: string) {
  try {
    // 生成 DOB Cluster
    const dobCluster = await generateDobCluster({
      title: proposal.title,
      content: proposal.content,
      summary: proposal.summary,
      tags: proposal.tags,
      creator: walletAddress,
      rawContent: proposal.rawContent,
    });

    // 构建交易
    const transaction = {
      version: "0x0",
      cellDeps: [],
      headerDeps: [],
      inputs: [],
      outputs: [
        {
          capacity: "0x0",
          lock: {
            codeHash: process.env.NEXT_PUBLIC_DOB_LOCK_CODE_HASH,
            hashType: "type",
            args: dobCluster,
          },
          type: null,
        },
      ],
      outputsData: ["0x"],
      witnesses: [],
    };

    // 签名并发送交易
    const signedTx = await ckb.signTransaction(walletAddress)(transaction);
    const txHash = await ckb.rpc.sendTransaction(signedTx);

    return txHash;
  } catch (error) {
    console.error("CKB 提交失败:", error);
    throw new Error("提案上链失败");
  }
}

export async function submitVoteToCKB(
  proposalId: string,
  walletAddress: string,
  support: boolean
) {
  try {
    // 生成投票 DOB
    const dob = await generateDob({
      proposalId,
      voter: walletAddress,
      support,
      timestamp: Date.now(),
    });

    // 构建交易
    const transaction = {
      version: "0x0",
      cellDeps: [],
      headerDeps: [],
      inputs: [],
      outputs: [
        {
          capacity: "0x0",
          lock: {
            codeHash: process.env.NEXT_PUBLIC_DOB_LOCK_CODE_HASH,
            hashType: "type",
            args: dob,
          },
          type: null,
        },
      ],
      outputsData: ["0x"],
      witnesses: [],
    };

    // 签名并发送交易
    const signedTx = await ckb.signTransaction(walletAddress)(transaction);
    const txHash = await ckb.rpc.sendTransaction(signedTx);

    return txHash;
  } catch (error) {
    console.error("投票上链失败:", error);
    throw new Error("投票上链失败");
  }
}
