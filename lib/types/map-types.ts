import type { ComponentProps } from 'react';
import type { Map, Marker, NavigationControl } from 'react-map-gl';

// We use ComponentProps to safely extract the prop types 
// without needing to reference the problematic namespaces.
export type MapInstance = any; // MapRef is often unreliable; 'any' is safe for refs
export type MapComponentProps = ComponentProps<typeof Map>;
export type MapMarkerProps = ComponentProps<typeof Marker>;
export type MapNavProps = ComponentProps<typeof NavigationControl>;