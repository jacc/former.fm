import Head from "next/head";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import Profile from "../components/profile";
import Card from "../components/notification";
import Header from "../components/header";
import SearchBar from "../components/search";
const navigation = [
  { name: "Solutions", href: "#" },
  { name: "Pricing", href: "#" },
  { name: "Docs", href: "#" },
  { name: "Company", href: "#" },
];

export default function Home() {
  const [username, setUsername] = useState("");
  const [lastFmData, setLastFmData] = useState({});

  async function getUser() {
    const response = await fetch(`/api/${username}`);
    const data = await response.json();
    return data;
  }

  useEffect(() => {
    // if (queueID != "") {
    //   setTimeout(() => {
    //     console.log("sleeping");
    //     fetchStatus(queueID).then((data) => {
    //       if (data.status === "SUCCESS") {
    //         setQueueID("");
    //         setLastFmData(data.result);
    //       } else {
    //         setQueueID(data.id);
    //       }
    //     });
    //   }, 500);
    // }
  });

  async function handleSubmit(e) {
    e.preventDefault();

    const data = await getUser();
    console.log(data);

    switch (data.status) {
      case "SUCCESS":
        setLastFmData(data.result);
        break;
      case "PROGRESS":
        console.log(data.result.meta.tracks_collected_so_far);
        toast.loading(
          `We've processed ${Intl.NumberFormat(
            data.result.meta.tracks_collected_so_far
          )} of your ${
            data.result.meta.estimated_tracks_to_collect
          } scrobbles!`,
          {
            duration: 2500,
            position: "top-right",
          }
        );
        break;
      case "PENDING":
        toast.success("You've been put into the queue!");
    }
  }

  return (
    <main className="bg-[#121212] p-4">
      <Header />
      <div className="mx-auto flex h-screen max-w-2xl px-4 sm:px-0">
        <div className="m-auto">
          <div className="flex justify-center">
            <SearchBar />
          </div>
        </div>
      </div>
    </main>
  );
}
