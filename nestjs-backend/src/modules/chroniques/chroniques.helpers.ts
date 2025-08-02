import { md5, strtr } from 'src/shared/utils';

// PHP legacy function: IC_imageserver
const getIcImageServerUrl = ({
  url,
  w = 150,
  h = 150,
  type = 'jpg',
  quality = 90,
}: {
  url: string;
  w?: number;
  h?: number;
  type?: string;
  quality?: number;
}) => {
  const base64String = btoa(
    JSON.stringify({
      img: url,
      w: w,
      h: h,
      q: quality,
      k: 'IC',
    }).replace(/\//g, '\\/'), // This is different from PHP (slash escaping in json_encode)
  );
  const tag = strtr(base64String, '+/=', '-_,');
  const omsg = md5(tag);
  return `/imageserver/${omsg.slice(0, 1)}/${omsg.slice(0, 2)}/${omsg}.${type}?conf=${tag}`;
};

// PHP legacy function: IC_getImage
export const getNewsThumbnailImage = ({
  contenu,
  thumbWidth = 150,
  thumbHeight = 150,
  defaultImage,
  giveRandom = false,
}: {
  contenu: string;
  thumbWidth?: number;
  thumbHeight?: number;
  defaultImage?: string;
  giveRandom?: boolean;
}) => {
  // dans le futur ?
  // http://imageserver.infoclimat.fr/local/150/150/URL.jpg

  const matches = contenu.match(
    /<img.*?src=["'](.*?\.(gif|png|jpg|jpeg|webp))["'].*?\/?>/gi,
  );
  if (matches && matches.length >= 1) {
    // Extract just the URLs from the matches using a second regex
    const imageUrls = matches
      .map<string | undefined>((match) => {
        const urlMatch = match.match(/src=["'](.*?)["']/i);
        return urlMatch ? urlMatch[1] : undefined;
      })
      .filter<string>(
        (url: string | undefined): url is string => url !== undefined,
      );

    if (!giveRandom || imageUrls.length === 1) {
      return `https://www.infoclimat.fr${getIcImageServerUrl({
        url: imageUrls[0],
        w: thumbWidth,
        h: thumbHeight,
      })}`;
    } else {
      // random image
      const randomIndex = Math.floor(Math.random() * imageUrls.length);
      return `https://www.infoclimat.fr${getIcImageServerUrl({
        url: imageUrls[randomIndex],
        w: thumbWidth,
        h: thumbHeight,
      })}`;
    }
  } else if (defaultImage) {
    return `https://www.infoclimat.fr${getIcImageServerUrl({
      url: defaultImage,
      w: thumbWidth,
      h: thumbHeight,
    })}`;
  } else {
    return null;
  }
};
