import { FC } from "react";

type ImageProps = {
  src: string;
  alt: string;
  className?: string;
};

const Image: FC<ImageProps> = ({ src, alt, className }) => {
  return <img src={src} alt={alt} className={className} />;
};

export { Image };
