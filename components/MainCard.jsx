import { Image, Text, View } from "react-native";
import { icons } from "@/constants/icons";

const MainCard = ({ geocode, weather, icon, label }) => {
  return (
    <View className="h-60 w-11/12 self-center items-center pt-4 pb-4 mt-5 mb-2">
          <View className="flex-row justify-center items-center">
            <Image
              source={icons.location}
              className="size-6 mr-1"
              tintColor="white"
            />
            <Text className="text-2xl color-white font-poppins">
              {geocode?.city}
            </Text>
          </View>
          <View className="items-center flex-row justify-center h-auto mt-4">
            <Image source={icon} className="w-40 h-36" />
            <Text className="text-6xl color-white font-poppins mr-5">
              {Math.round(weather?.temperature)}
              {`\u00B0`}
            </Text>
          </View>
          <Text className="text-white font-poppins text-xl">{label}</Text>
        </View>
  );
};

export default MainCard;
