import { Image, Text, View } from "react-native";

const SmallCard = ({ icon, text, value, unit, size }) => {
  return (
    <View className="h-28 w-40 bg-white/20 items-center p-3 mt-5 border-4 border-t-0 border-b-8 border-black/20 rounded-3xl  justify-around">
      <Image source={icon} className={size} tintColor="white" />
      <Text className="font-poppins color-white/40 mt-2 text-sm">{text}</Text>
      <Text className="font-poppins color-white justify-self-end">{value} {unit}</Text>
    </View>
  );
};

export default SmallCard;
