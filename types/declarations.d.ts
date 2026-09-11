declare module '*.css';
declare module '*.png';
declare module '*.jpg';
declare module '*.svg';
declare module '*.json';

// Simply declare the module exists; let the bundler handle the resolution.
// This prevents TypeScript from complaining about missing definitions.
declare module 'react-map-gl';