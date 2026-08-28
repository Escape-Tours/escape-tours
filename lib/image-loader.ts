// lib/image-loader.ts
export const getImageUrl = (image: string) => {
    return image.startsWith('http') ? image : `/images/hotels/${image}`;
};