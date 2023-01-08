import Image from "next/image";

export default function Card({ data }) {
  return (
    <div className="flex items-center space-x-3 truncate rounded-lg border border-indigo-100 shadow-indigo-100/75 shadow-sm p-3">
      {/* <Icon className="h-6 w-6 dark:text-white" /> */}
      <div>
        <Image
          src="https://i1.sndcdn.com/artworks-zKXLlzTVgtWfwuXj-djiTgQ-t240x240.jpg"
          alt="fuck you"
          width={50}
          height={50}
          className="rounded-lg"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className={"truncate text-sm text-gray-900 dark:text-white"}>
          Song name
        </p>
        {/* {description ? (
          <p className="truncate text-sm text-gray-500">{description}</p>
        ) : null} */}
        <p className="truncate text-sm text-gray-500">by artist</p>
      </div>
    </div>
  );
}
