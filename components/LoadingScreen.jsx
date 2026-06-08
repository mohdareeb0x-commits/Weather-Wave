import { Image, Text, View } from "react-native";
import { images } from "@/constants/images";
import { SafeAreaView } from "react-native-safe-area-context";
import SmallCard from "./SmallCard";

const LoadingScreen = () => {
  return (
    <SafeAreaView className="flex-1 items-center bg-black">
      <Image
        source={images.bg}
        resizeMode="cover"
        className="absolute w-full h-full z-0"
      />
      <View className="h-72 w-10/12 bg-white/20 self-center mt-5 border-4 border-t-0 border-b-8 border-black/20 rounded-3xl items-center justify-around">
        <Text className="color-white text-2xl font-bold font-poppins">Loading...</Text>
      </View>
      <View className="flex-row self-center justify-between w-10/12">
        <SmallCard />
        <SmallCard />
      </View>
      <View className="flex-row self-center justify-between w-10/12">
        <SmallCard />
        <SmallCard />
      </View>
      <View className="flex-row self-center justify-between w-10/12">
        <SmallCard />
        <SmallCard />
      </View>
    </SafeAreaView>
  );
};

export default LoadingScreen;
