export interface Profile {
  id: string;
  wallet_address: string;
  created_at: string;
  updated_at: string;
}

export interface Proposal {
  id: string;
  title: string;
  content: string;
  raw_content: string;
  summary: string;
  tags: string[];
  status: "PENDING" | "ACTIVE" | "REJECTED";
  tx_hash: string | null;
  creator_id: string;
  creator: Profile;
  created_at: string;
  updated_at: string;
  votes: Vote[];
}

export interface Vote {
  id: string;
  proposal_id: string;
  user_id: string;
  support: boolean;
  tx_hash: string | null;
  created_at: string;
}
