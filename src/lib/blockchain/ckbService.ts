import { ccc } from "@ckb-ccc/connector-react";
import { JsonRpcTransformers } from "@ckb-ccc/core/advanced";
import { createSpore, createSporeCluster } from "@ckb-ccc/spore";
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

export async function createProposalVoteDob(
  clusterId: string,
  proposalId: string,
  signer: ccc.Signer,
  support: boolean
) {
  if (!signer) {
    throw new Error("请先连接钱包");
  }

  try {
    const { tx, id } = await createSpore({
      signer,
      data: {
        content: ccc.bytesFrom(
          JSON.stringify({
            proposalId,
            support,
          }),
          "utf8"
        ),
        contentType: "text/plain",
        clusterId,
      },
      clusterMode: "clusterCell",
    });

    // Complete transaction
    await tx.completeFeeBy(signer);
    const signedTx = await signer.signTransaction(tx);
    console.log(JSON.stringify(JsonRpcTransformers.transactionFrom(signedTx)));

    // Send transaction
    const txHash = await signer.sendTransaction(signedTx);
    console.log(txHash);
    return { txHash, id };
  } catch (error) {
    console.error("投票上链失败:", error);
    throw new Error("投票上链失败");
  }
}
