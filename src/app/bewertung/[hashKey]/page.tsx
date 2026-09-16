import { HotelReviewApp } from "./HotelReviewApp";

export default async function BewertungPage({
  params,
}: {
  params: Promise<{ hashKey: string }>;
}) {
  const { hashKey } = await params;
  return <HotelReviewApp hashKey={hashKey} />;
}
