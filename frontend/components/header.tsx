export default function Header() {
  return (
    <div className="flex items-center justify-between px-4 py-6 sm:px-6">
      <div className="flex items-center flex-1">
        <div className="flex items-center z-10">
          <span className="hover:text-white transition ease-in-out text-white/50 text-xl font-bold cursor-default">
            former
          </span>
          <span className="text-white text-xl font-bold">.fm</span>
        </div>
      </div>
      <img
        src="https://m.media-amazon.com/images/I/519LwTN9hqL._SY1000_.jpg"
        className="absolute -top-[50px] -left-[100px] w-[500px] object-cover object-center rounded-2xl blur-3xl saturate-75 -z-0 select-none pointer-events-none"
      />
    </div>
  );
}
