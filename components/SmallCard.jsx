import { Image, Pressable, Text, TextInput, View } from "react-native";
import { icons } from "@/constants/icons";
import { useRouter } from "expo-router";

const SmallCard = ({ icon }) => {
  return (
    <View className="h-auto w-5/12 bg-white/20 items-start p-5 mt-5 border-4 border-t-0 border-b-8 border-black/20 rounded-3xl">
      <Image source={icon} className="size-12" />
    </View>
  );
};

export default SmallCard;
