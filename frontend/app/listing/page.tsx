import Card from "@/app/componets/card";

const data = [
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/500px-Image_created_with_a_mobile_phone.png",
    category: "yello",
    description: "back",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/500px-Image_created_with_a_mobile_phone.png",
    category: "yello",
    description: "back",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/500px-Image_created_with_a_mobile_phone.png",
    category: "yello",
    description: "bddddack",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/500px-Image_created_with_a_mobile_phone.png",
    category: "yello",
    description: "baddck",
  },
]
export default function Home() {
  return (
    <div className="bg-black flex flex-row">
      {data.map((item, index) => (
        <Card
          key={index}
          src={item.src}
          category={item.category}
          description={item.description}
        />
      )).splice(0, 3)}
    </div>
  );
}