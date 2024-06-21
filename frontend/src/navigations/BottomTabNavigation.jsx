import { Image, Text } from "react-native";
import React, { useContext } from "react";
import HomeScreen from "../screens/HomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import ChannelScreen from "../screens/ChannelScreen";
import { FontAwesome5, FontAwesome6, Feather, AntDesign } from "@expo/vector-icons";
import ProfileScreen from "../screens/ProfileScreen";
import { useTheme } from 'expo-theme-switcher';
import { UserType } from "../context/UserContext";
import VideoUpload from "../Modal/VideoUpload";

const Tab = createBottomTabNavigator();
const BottomTabNavigation = () => {
    const { currentTheme } = useTheme()
    const [user, setUser] = useContext(UserType);

    return (
        <Tab.Navigator screenOptions={() => ({
            tabBarStyle: {
                backgroundColor: currentTheme?.secondaryBackgroundColor,
                height: 55,
                paddingVertical: 9,
                borderTopWidth: 0,
                elevation: 5,
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                shadowOffset: { width: 0, height: 2 },
            }
        })}>
            <Tab.Screen name="Home" component={HomeScreen} options={{
                tabBarLabel: ({ focused, }) => (
                    <Text style={{ fontSize: 12, fontWeight: "bold", color: focused ? "#AE7AFF" : currentTheme?.primaryTextColor, marginBottom: 4 }}>
                        Home
                    </Text>
                ),
                headerShown: false,
                tabBarIcon: ({ focused, size, color }) =>
                    focused ? (
                        <Ionicons name="home" size={20} color="#AE7AFF" fontWeight="100" />
                    ) : (
                        <Ionicons name="home-outline" size={20} color={currentTheme?.primaryTextColor} />
                    ),
            }} />

            <Tab.Screen name="Upload" component={VideoUpload} options={{
                tabBarLabel: ({ focused, size, }) => (
                    <Text style={{ color: "white", }}></Text>
                ),
                headerShown: false,
                tabBarIcon: ({ focused, size }) =>
                    focused ? (
                        <AntDesign name="pluscircleo" size={34} color="#AE7AFF" style={{ height: 40, marginTop: 10 }} />
                    ) : (
                        <AntDesign name="pluscircleo" size={34} color={currentTheme?.primaryTextColor} style={{ height: 40, marginTop: 10 }} />
                    ),
            }} />

            <Tab.Screen name="You" component={ProfileScreen} options={{
                tabBarLabel: ({ focused, size, }) => (
                    <Text style={{
                        fontSize: 12, fontWeight: "bold", color: focused ? "#AE7AFF" : currentTheme?.primaryTextColor, alignSelf: "center",
                        marginBottom: 4
                    }}>
                        You
                    </Text>
                ),
                headerShown: false,
                tabBarIcon: ({ focused, size }) =>
                    focused ? (
                        <Image source={{ uri: user.avatar }} style={{ width: 26, height: 26, borderRadius: 25, borderWidth: 2, borderColor: "#AE7AFF" }} />
                    ) : (
                        <Image source={{ uri: user.avatar }} style={{ width: 26, height: 26, borderRadius: 25 }} />
                    ),
            }} />
        </Tab.Navigator>
    )
}

export default BottomTabNavigation