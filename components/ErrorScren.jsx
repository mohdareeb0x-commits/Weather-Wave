import { Image, Text, View } from "react-native";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { SafeAreaView } from "react-native-safe-area-context";

const ErrorScreen = ({ text }) => {
  return (
    <SafeAreaView className="flex-1 items-center bg-black">
      <Image
        source={images.bg}
        resizeMode="cover"
        className="absolute w-full h-full z-0"
      />
      <View className="flex-1 justify-center">
        <Image source={icons.thunderstorms} className="size-40 self-center" />
        <Text className="text-2xl text-white font-poppins">
          {text}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ErrorScreen;
