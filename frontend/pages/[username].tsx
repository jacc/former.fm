import Header from "../components/header";
import { useRouter } from "next/router";
import { Audio } from "react-loader-spinner";
import { Headphone, Cake } from "iconsax-react";

export default function FormerPage() {
  const router = useRouter();
  const { username } = router.query;

  console.log(username);

  const data: string | null | {} = null;

  return (
    <>
      <main className="bg-[#121212] min-h-screen p-4">
        <Header />
        <div className="flex flex-row items-center px-4 py-8 sm:px-6">
          <div className="z-10">
            <div>
              <span className="hover:text-white transition ease-in-out text-white/50 text-4xl font-bold">
                top track
              </span>
            </div>
            <div className="flex flex-row align-center py-8 gap-4 items-center">
              <img
                src="https://images.genius.com/44f871d4adb93536778956184d21b68f.1000x1000x1.jpg"
                className="w-20 rounded-xl select-none pointer-events-none"
              />
              <div className="flex flex-col">
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
              <span className="hover:text-white transition ease-in-out text-white/50 text-4xl font-bold">
                all tracks
              </span>
            </div>
            {/* <div className="flex flex-row align-center py-8 gap-4 items-center">
              <img
                src="https://images.genius.com/44f871d4adb93536778956184d21b68f.1000x1000x1.jpg"
                className="w-20 rounded-xl select-none pointer-events-none"
              />
              <div className="flex flex-col">
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
            </div> */}
          </div>
        </div>
        {/* {!data && (
          <div>
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24" />
          </div>
        )} */}
      </main>
    </>
  );
}
