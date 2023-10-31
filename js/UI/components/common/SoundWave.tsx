
export const SoundWave = ({ height, color }: { height: string, color: string }) => {
  return (
    <div className="w-full sound-wave" style={{ height: height }}>
      {
        Array(7).fill('').map(_el => { return <span className="waveStroke" style={{ background: color }}></span> })
      }
    </div >
  );
}