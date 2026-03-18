"use client";

const Difficulty = ({ count, className }: { count: number, className?: string }) => {
    
  let message = "";

  if (count <= 3) {
    message = "Easy";
  } else if (count <= 6) {
    message = "Medium";
  } else if (count <= 8) {
    message = "Hard";
  } else if (count <= 99) {
    message = "Very Hard";
  } else {
    message = "Very Easy";
  }

  return (

    <div className={`flex gap-4 !max-w-[100%] ${className}`}>
      <p>{message}</p>
    </div>

    // <div className={`flex gap-4 !max-w-[100%] ${className}`}>
    //   {Array.from({ length: count }).map((_, index) => (
    //     index == count - 1 && index % 2 === 0 ? (
    //       <Image
    //         key={index}
    //         src={`/assets/spatula_silver.png`}
    //         alt="Difficulty"
    //         width={15}
    //         height={10}
    //         className="inline"
    //       />
    //     ) : (
    //     <Image
    //       key={index}
    //       src={`/assets/spatula_golden.png`}
    //       alt="Difficulty"
    //       width={15}
    //       height={10}
    //       className="inline"
    //     />
    //     )
    //   ))}
    // </div>
  );
};

export { Difficulty };