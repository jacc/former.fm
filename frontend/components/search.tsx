import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SearchBar() {
  const router = useRouter();

  const [username, setUsername] = useState(null);
  const [percentDone, setPercentDone] = useState(0);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setUsername(event.target[0].value);
    setLoading(true);
    const response = await fetch(`/api/cached/${event.target[0].value}`);
    const data = await response.json();
    if (data.status === true) {
      router.push(`/${event.target[0].value}`);
    }
  }

  useEffect(() => {
    async function getUser() {
      const response = await fetch(`/api/${username}`);
      const data = await response.json();
      return data;
    }

    async function recurseCheckUser() {
      const data = await getUser();
      if (data.status === "PENDING" || data.status === "PROGRESS") {
        setProcessing(true);

        if (data.result) {
          setPercentDone(
            parseInt(
              (
                (data.result.meta.tracks_collected_so_far /
                  data.result.meta.estimated_tracks_to_collect) *
                100
              ).toFixed(0)
            )
          );
        }

        setTimeout(() => {
          recurseCheckUser();
        }, 1000);
      } else if (data.status === "SUCCESS") {
        router.push(`/${username}`);
      }
    }

    if (username) {
      recurseCheckUser();
    }
  }, [router, username]);

  return (
    <>
      <form
        className="flex flex-col h-screen justify-center items-center space-x-4 z-10 w-full"
        onSubmit={handleSubmit}
      >
        <legend>
          <span className="text-white font-bold text-xl pl-1">
            Enter your Last.fm username:
          </span>
          <div className="flex flex-col lg:flex-row align-center gap-3 mt-3">
            <input
              className="w-full bg-[#1e1e1e] text-white rounded-xl p-4 pl-8 focus:outline-none focus:ring-2 focus:ring-[#DD1A22] focus:transition focus:ease-out focus:border-transparent"
              type="text"
              placeholder="j9ck"
            />
            <button
              className="bg-[#DD1A22] hover:bg-[#DD1A22] text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#DD1A22] focus:transition focus:ease-out focus:border-transparent"
              type="submit"
            >
              <svg
                className="h-6 w-6 lg:block hidden"
                style={{ display: loading ? "none" : "block" }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <svg
                aria-hidden="true"
                className="w-6 h-6 text-gray-200 animate-spin dark:text-white fill-black"
                style={{ display: loading ? "block" : "none" }}
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <div className="block lg:hidden">Search your last.fm</div>
            </button>
          </div>
          <div className="flex flex-row">
            <div
              className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 transition mt-4"
              style={{
                visibility: processing === false ? "hidden" : "visible",
              }}
            >
              <div
                className="bg-[#DD1A22] h-2.5 rounded-full"
                style={{
                  width: `${percentDone}%`,
                }}
              ></div>
            </div>
          </div>
        </legend>
      </form>
    </>
  );
}
