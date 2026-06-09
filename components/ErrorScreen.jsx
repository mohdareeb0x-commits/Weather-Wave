import { Image, Text, View, RefreshControl, ScrollView } from "react-native";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { SafeAreaView } from "react-native-safe-area-context";

const ErrorScreen = ({ text, onRefresh, refreshing }) => {
  return (
    <SafeAreaView className="flex-1 items-center bg-black">
      <Image
        source={images.bg}
        resizeMode="cover"
        className="absolute w-full h-full z-0"
      />
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="min-h-[700px] justify-center">
          <Image source={icons.thunderstorms} className="size-40 self-center" />
          <Text className="text-2xl text-white font-poppins self-center">{text}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ErrorScreen;
