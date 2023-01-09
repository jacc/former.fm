import Header from "../components/header";
import { useRouter } from "next/router";
import { Audio } from "react-loader-spinner";

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
          <div className="flex items-center flex-1">
            <div className="flex items-center z-10">
              <span className="hover:text-white transition ease-in-out text-white/50 text-4xl font-bold">
                top track
              </span>
            </div>
            <div className="flex items-center z-10">
              <span className="hover:text-white transition ease-in-out text-white/50 text-4xl font-bold">
                top track
              </span>
            </div>
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
