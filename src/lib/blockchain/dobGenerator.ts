interface DobClusterData {
  title: string;
  content: string;
  summary: string;
  tags: string[];
  creator: string;
  rawContent: string;
}

interface DobData {
  proposalId: string;
  voter: string;
  support: boolean;
  timestamp: number;
}

export async function generateDobCluster(
  data: DobClusterData
): Promise<string> {
  // 将提案数据序列化为 DOB Cluster
  const dobCluster = {
    type: "proposal",
    version: "1.0",
    data: {
      ...data,
      createdAt: Date.now(),
    },
  };

  // 将对象转换为 hex 字符串
  return "0x" + Buffer.from(JSON.stringify(dobCluster)).toString("hex");
}

export async function generateDob(data: DobData): Promise<string> {
  // 将投票数据序列化为 DOB
  const dob = {
    type: "vote",
    version: "1.0",
    data,
  };

  // 将对象转换为 hex 字符串
  return "0x" + Buffer.from(JSON.stringify(dob)).toString("hex");
}
