export default function handler(req, res) {
  res.status(200).json({
    PASSWORD: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "NOT FOUND",
  });
}
