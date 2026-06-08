import { Image, Pressable, Text, TextInput, View } from "react-native";
import { icons } from "@/constants/icons";
import { useRouter } from "expo-router";

const MainCard = ({ geocode, weather, icon }) => {
  return (
    <View className="h-auto w-10/12 bg-white/20 self-center items-center pt-4 mt-5 border-4 border-t-0 border-b-8 border-black/20 rounded-3xl">
          <View className="flex-row justify-center items-center mb-4">
            <Image
              source={icons.location}
              className="size-4 mr-1"
              tintColor="white"
            />
            <Text className="text-xl color-white font-poppins">
              {geocode?.city}
            </Text>
          </View>
          <View className="items-center">
            <Image source={icon} className="w-40 h-36 pt-5" />
            <Text className="text-6xl color-white font-poppins mb-5">
              {Math.round(weather?.temperature)}
              {`\u00B0`}
            </Text>
          </View>
        </View>
  );
};

export default MainCard;
