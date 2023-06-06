import React from "react";
import Link from "next/link";

const GroupCard = ({ group }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <img
        className="w-full h-48 object-cover"
        src={group.images[0]}
        alt={group.title}
      />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{group.title}</div>
      </div>
      <div className="px-6 py-4">
        <Link href={`/item/${group._id}`}>
          <div className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            View Group
          </div>
        </Link>
      </div>
    </div>
  );
};

export default GroupCard;
