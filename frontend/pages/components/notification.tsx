export default function Profile({ data }) {
  return (
    <div className="max-w-full justify-center">
      <h1 className="text-2xl font-bold">{`${JSON.stringify(data)}`}</h1>
    </div>
  );
}
