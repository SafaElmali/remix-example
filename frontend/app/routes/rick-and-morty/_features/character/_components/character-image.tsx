import { FC } from "react";
import { Image } from "@/components/features/image";

type CharacterImageProps = {
  src: string;
  alt: string;
  className?: string;
};

const CharacterImage: FC<CharacterImageProps> = ({ src, alt, className }) => {
  return <Image src={src} alt={alt} className={className} />;
};

export { CharacterImage };
