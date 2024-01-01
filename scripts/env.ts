require("dotenv").config();

export const env = {
  RPC_END_POINT: process.env.RPC_END_POINT || "http://127.0.0.1:8899",
  PROGRAM_ID:
    process.env.PROGRAM_ID || "ALgrGkAVEFCsfzVSfhhH9ULoy6xDveTMf4a71STiLGcJ",
  PROXY_PROGRAM_ID:
    process.env.PROXY_PROGRAM_ID ||
    "6HYFhpivcv88pUPEECnU34LxPtvNsnLV4fxxDQDhMwdq",
  BASE_MINT:
    process.env.BASE_MINT || "3ugV6gWJ5gAymoYdsU376ActzEJojgauMQ1UJahU5Pty",
  QUOTE_MINT:
    process.env.QUOTE_MINT || "J8iLUuErBdZVxT9DhurUZGeomeLA1V79nkPYj1rKu3cf",
};
