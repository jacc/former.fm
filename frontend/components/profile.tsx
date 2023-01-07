export default function Profile({ data }) {
  return (
    <div className="max-w-full justify-center">
      <h1 className="text-2xl font-bold">
        {!data ? "fuck you this is where the data goes" : ""}
      </h1>
    </div>
  );
}
