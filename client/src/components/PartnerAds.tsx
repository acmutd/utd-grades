import NexusAd from "./NexusAd";
import SageAd from "./SageAd";

export default function PartnerAds() {
  return (
    <div className="mb-[0.3rem] mt-4 flex flex-col items-center gap-3">
      <SageAd />
      <NexusAd />
    </div>
  );
}
