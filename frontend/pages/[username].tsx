import Header from "../components/header";
import { useRouter } from "next/router";
import { Audio } from "react-loader-spinner";
import { Headphone, Cake } from "iconsax-react";

const people = [
  {
    name: "2.",
    title: "die for you",
    email: "the weeknd",
    role: "1,121",
  },
  {
    name: "2.",
    title: "die for you",
    email: "the weeknd",
    role: "1,121",
  },
  {
    name: "2.",
    title: "die for you",
    email: "the weeknd",
    role: "1,121",
  },
];

export default function FormerPage() {
  const router = useRouter();
  const { username } = router.query;

  console.log(username);

  const data: string | null | {} = null;

  return (
    <>
      <main className="bg-[#121212] min-h-screen p-4  overflow-x-auto">
        <Header />
        <div className="flex flex-row items-center px-4 py-8 sm:px-6">
          <div className="z-10">
            <div>
              <span className="hover:text-white transition ease-in-out text-white/50 text-4xl font-bold cursor-default">
                top track
              </span>
            </div>
            <div className="flex flex-row align-center py-8 gap-4 items-center">
              <img
                src="https://images.genius.com/44f871d4adb93536778956184d21b68f.1000x1000x1.jpg"
                className="w-20 rounded-xl select-none pointer-events-none"
              />
              <div className="flex flex-col cursor-default">
                <h3 className="hover:text-white transition ease-in-out text-white text-2xl font-bold">
                  three wheels and it still drives!
                </h3>
                <p className="hover:text-white transition ease-in-out text-white/50 text-lg">
                  glaive
                </p>
              </div>
            </div>
            <div className="gap-2 flex flex-col sm:flex-row items-start">
              <div className="bg-[#1E1E1E]/50 p-4 rounded-2xl text-white gap-2 flex">
                <Headphone color="#fff" variant="Bulk" /> 17,250 plays
              </div>
              <div className="bg-[#1E1E1E]/50 p-4 rounded-2xl text-white gap-2 flex">
                <Cake color="#fff" variant="Bulk" /> 12 week streak
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center px-4 py-8 sm:px-6">
          <div className="z-10">
            <div>
              <span className="hover:text-white transition ease-in-out text-white/50 text-4xl font-bold cursor-default">
                all tracks
              </span>
            </div>
            <div>
              {/* <table className="text-white p-8 ">
                <thead className="">
                  <tr className="">
                    <th className="border border-white">#</th>
                    <th className="border border-white">track</th>
                    <th className="border border-white">artist</th>
                    <th className="border border-white">plays</th>
                    <th className="border border-white">streak</th>
                    <th className="border border-white">shares</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-white ">1.</td>
                    <td className="border border-white">die for you</td>
                    <td className="border border-white">the weeknd</td>
                    <td className="border border-white">8021</td>
                    <td className="border border-white">12 weeks</td>
                    <td className="border border-white">321</td>
                  </tr>
                </tbody>
              </table> */}
              <div className="flex flex-col">
                <div className="-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle px-6">
                    <div className="ring-1 ring-black ring-opacity-5 md:rounded-lg lg:overflow-x-scroll lg:w-screen">
                      <table className=" divide-white/10 divide-y">
                        <thead className="text-white/50">
                          <tr>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-lg font-semibold sm:pl-6"
                            >
                              #
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-lg font-semibold "
                            >
                              track
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-lg font-semibold "
                            >
                              artist
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-lg font-semibold "
                            >
                              plays
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3.5 text-left text-lg font-semibold "
                            >
                              streak
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-white">
                          {people.map((person) => (
                            <tr key={person.email}>
                              <td className="whitespace-nowrap text-lg font-medium text-white/50 sm:pl-6">
                                {person.name}
                              </td>
                              <td className="whitespace-nowrap px-4 py-4 pr-32 text-lg flex object-center items-center gap-2">
                                <img
                                  src="https://images.genius.com/44f871d4adb93536778956184d21b68f.1000x1000x1.jpg"
                                  className="w-10 rounded-md select-none pointer-events-none"
                                />
                                {person.title}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 pr-24 text-lg ">
                                {person.email}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 pr-12 text-lg ">
                                {person.role}
                              </td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-lg font-medium sm:pr-6">
                                123123123
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
