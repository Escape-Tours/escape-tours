export interface AddOnItem {
  id: string;
  name: string;
  category: 'spa' | 'charter' | 'trekking' | 'vip';
  price: number;
  image_url?: string;
  triggerItemType: string; // e.g., triggers when a 'lodges' or 'parks' item is selected
}

export const CONTEXTUAL_ADDONS: AddOnItem[] = [
  { id: 'addon-1', name: 'Scenic Helicopter Flight over the Caldera', category: 'charter', price: 650, triggerItemType: 'parks' },
  { id: 'addon-2', name: 'Sunset Bush Spa Treatment', category: 'spa', price: 180, triggerItemType: 'lodges' },
  { id: 'addon-3', name: 'Private 4x4 Airstrip Transfer Upgrade', category: 'vip', price: 120, triggerItemType: 'transfers' },
];