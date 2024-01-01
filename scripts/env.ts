require("dotenv").config();

export const env = {
  RPC_END_POINT: process.env.RPC_END_POINT || "http://127.0.0.1:8899",
  PROGRAM_ID:
    process.env.PROGRAM_ID || "ALgrGkAVEFCsfzVSfhhH9ULoy6xDveTMf4a71STiLGcJ",
};
