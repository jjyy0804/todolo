import Spinner from '../assets/spinner.gif';

export default function Calendar() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* spinner */}
      <div className="w-24 h-24 relative">
        {/* tailwind로 만들어본거... 나중에 꼭 사용해 보아요~ 지금은 바이~ */}
        {/* <div className="animate-spin w-full h-full rounded-full border-t-4 border-t-primary"></div> */}
        <img className="w-full h-full" src={Spinner} alt="Spinner" />
      </div>

      <p className="text-lg text-darkgray mt-6 ">로딩 중...</p>
      <p className="text-sm text-darkgray mt-1">잠시만 기다려 주세요.</p>
    </div>
  );
}
