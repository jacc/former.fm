import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import Profile from "./components/profile";
const navigation = [
  { name: "Solutions", href: "#" },
  { name: "Pricing", href: "#" },
  { name: "Docs", href: "#" },
  { name: "Company", href: "#" },
];

export default function Home() {
  const [username, setUsername] = useState("");
  const [queueID, setQueueID] = useState("");
  const [lastFmData, setLastFmData] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    console.log("bruh");

    async function fetchQueue() {
      const response = await fetch(`/api/queue/${username}`);
      const data = await response.json();
      return data;
    }

    async function fetchStatus() {
      const response = await fetch(`/api/status/${username}`);
      const data = await response.json();
      return data;
    }

    const queue = await fetchQueue();

    if (queue.detail.message) {
      setQueueID(queue.detail.task_id);
    } else {
      setQueueID(queue.id);
    }

    console.log(queueID);
  }

  return (
    <main>
      <div className="m-auto max-w-3xl px-4 sm:px-0 space-y-4">
        {/* <div className="m-4 rounded-xl bg-[#ef233c]">
          <div className="rounded-2xl py-3 px-3 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex w-0 flex-1 items-center">
                <span className="flex rounded-lg bg-indigo-800 p-2"></span>
                <p className="ml-3 truncate font-medium text-white">
                  <span className="inline">Former.fm</span>
                </p>
              </div>
              <div className="flex-shrink-0 sm:order-2 sm:mt-0 sm:w-auto">
                <a
                  href="#"
                  className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm hover:bg-indigo-50"
                >
                  Learn more
                </a>
              </div>
            </div>
          </div>
        </div> */}
        <div className="flex justify-center">
          <div className="justify-center p-8 text-center text-gray-900 dark:text-white">
            <div className="text-2xl font-semibold">123123123</div>
          </div>
        </div>
        <div className="max-w-full justify-center">
          <h1 className="text-2xl font-bold">Former.fm</h1>
          <h2 className="text-lg">
            Analyze former song history using Last.fm.
          </h2>
        </div>
        <div className="max-w-full justify-center">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Last.fm username
          </label>
          <div className="mt-1">
            <form
              onSubmit={handleSubmit}
              className="
            flex space-x-2"
            >
              <input
                type="text"
                name="username"
                id="username"
                className="p-3 block w-full rounded-md border-indigo-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="j9ck"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
              <button
                type="button"
                className="shadow-sm inline-flex items-center p-3 rounded-md border bg-indigo-100 text-base font-sm text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={handleSubmit}
              >
                Search
              </button>
            </form>
            <Profile data={lastFmData} />
          </div>
        </div>
      </div>
    </main>
  );
}
