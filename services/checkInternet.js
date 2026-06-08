import * as Network from "expo-network";

const checkInternet = async () => {
    const state = await Network.getNetworkStateAsync();

    if (!state.isConnected || !state.isInternetReachable) {
        console.log("No Internet");
        return false;
    }

    return true;
}

export default checkInternet;