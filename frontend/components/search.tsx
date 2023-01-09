import { useEffect, useState } from "react";

export default function SearchBar() {
  const [username, setUsername] = useState(null);
  const [percentDone, setPercentDone] = useState(0);

  function handleSubmit(event) {
    event.preventDefault();
    setUsername(event.target[0].value);
  }

  useEffect(() => {
    console.log(username);

    async function getUser() {
      const response = await fetch(`/api/${username}`);
      const data = await response.json();
      return data;
    }

    async function recurseCheckUser() {
      const data = await getUser();
      if (data.status === "PENDING" || data.status === "PROGRESS") {
        setPercentDone(
          parseInt(
            (
              (data.result.meta.tracks_collected_so_far /
                data.result.meta.estimated_tracks_to_collect) *
              100
            ).toFixed(0)
          )
        );
        setTimeout(() => {
          recurseCheckUser();
        }, 1000);
      }
    }

    if (username) {
      recurseCheckUser();
    }
  }, [username]);

  return (
    <>
      <form
        className="flex h-screen justify-center items-center space-x-4"
        onSubmit={handleSubmit}
      >
        <legend>
          <span className="text-white font-bold text-xl pl-1">
            Enter your Last.fm username:
          </span>
          <div className="flex flex-row align-center gap-3 mt-3">
            <input
              className="w-[35rem] bg-[#1e1e1e] text-white rounded-xl p-4 pl-8 focus:outline-none focus:ring-2 focus:ring-[#DD1A22] focus:transition focus:ease-out focus:border-transparent"
              type="text"
              placeholder="j9ck"
            />
            <button
              className="bg-[#DD1A22] hover:bg-[#DD1A22] text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#DD1A22] focus:transition focus:ease-out focus:border-transparent"
              type="submit"
            >
              <svg
                className="h-6 w-6"
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
            </button>
          </div>
          <div className="flex flex-row">
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 transition">
              <div
                className="bg-[#DD1A22] h-2.5 rounded-full"
                style={{ width: `${percentDone}%` }}
              ></div>
            </div>
          </div>
        </legend>

        {/* <div
          className="flex space-x-4
        "
        >
          <div className="flex flex-col">
            <label className="text-white">123123</label>
            <input
              className="w-[35rem] bg-[#1e1e1e] text-white rounded-xl p-4 pl-8 focus:outline-none focus:ring-2 focus:ring-[#DD1A22] focus:transition focus:ease-out focus:border-transparent"
              type="text"
              placeholder="j9ck"
            />
          </div>
          <div className="flex flex-row">
            <button
              className="bg-[#DD1A22] hover:bg-[#DD1A22] text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#DD1A22] focus:transition focus:ease-out focus:border-transparent"
              type="submit"
            >
              <svg
                className="h-6 w-6"
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
            </button>
          </div>
        </div> */}
      </form>
    </>
  );
}