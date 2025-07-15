export default function NullOtoPreset() {
  var noiseLevel = 57;
  var noiseLevel2 = 36;
  return (
    <div>
      <div
        className="bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: "440px", height: "956px" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-black text-2xl">騒音レベル</h1>
          <h1 className="text-black text-4xl">{noiseLevel}dB</h1>
          <h1 className="text-black text-2xl">実現環境</h1>
          <h1 className="text-black text-4xl">{noiseLevel2}dB</h1>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500 w-30 h-30 rounded-full"></div>
      </div>
    </div>
  );
}
