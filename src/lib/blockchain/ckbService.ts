import { ccc } from "@ckb-ccc/connector-react";
import { createSporeCluster } from "@ckb-ccc/spore";
import { Script } from "@ckb-lumos/lumos";
import { GeneratedProposal } from "../ai/proposalGenerator";

export async function createProposalCluster(
  proposal: GeneratedProposal,
  signer: ccc.Signer
) {
  if (!signer) {
    throw new Error("请先连接钱包");
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

    const { tx, id } = await createSporeCluster({
      signer,
      data: {
        name: proposal.title,
        description: proposal.summary,
      },
    });

    await tx.completeFeeBy(signer);
    const signedTx = await signer.signTransaction(tx);
    const txHash = await signer.sendTransaction(signedTx);
    return { txHash, id };
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
    throw new Error("请先连接钱包");
  }

  // try {
  //   // 生成投票 DOB
  //   const dob = await generateDob({
  //     proposalId: proposalId,
  //     voter: walletAddress,
  //     support,
  //     timestamp: Date.now(),
  //   });

  //   const { txSkeleton } = await createSpore({
  //     data: {
  //       content: dob,
  //       contentType: "text",
  //       clusterId,
  //     },
  //     fromInfos: [walletAddress],
  //     toLock: lock,
  //   });

  //   const tx = await signTransaction(txSkeleton);
  //   const rpc = new RPC(config.ckbNodeUrl);
  //   const hash = await rpc.sendTransaction(tx, "passthrough");
  //   return hash;
  // } catch (error) {
  //   console.error("投票上链失败:", error);
  //   throw new Error("投票上链失败");
  // }
}
