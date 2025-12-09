export default function handler(req, res) {
  res.json({
    PASSWORD: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "NOT FOUND",
  });
}
