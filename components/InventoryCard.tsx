import { HotelData } from "@/types/hotel";
import { motion } from "framer-motion";

interface Props {
  item: HotelData;
  onSelect: (item: HotelData) => void;
}

export const InventoryCard = ({ item, onSelect }: Props) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm cursor-pointer hover:border-orange-500 transition-all"
      onClick={() => onSelect(item)}
    >
      <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded-lg mb-4" />
      <h3 className="font-black text-xl text-slate-900">{item.name}</h3>
      <p className="text-slate-500 text-sm mt-2">{item.location.address}</p>
      <div className="mt-4 font-bold text-orange-600">
        From ${item.prices.low}
      </div>
    </motion.div>
  );
};