import { View, Text, TouchableOpacity, StyleSheet, Switch, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import HeaderComponent from '../components/HeaderComponent'
import { useTheme } from 'expo-theme-switcher'
import { Feather, AntDesign, FontAwesome6 } from '@expo/vector-icons';
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import DashboardTableComponent from '../components/DashboardTableComponent'
import PopupMessage from '../components/PopupMessage'
import { deleteVideoHandler, togglePublishStatusHander } from '../actions/video.actions'
import { getChannelStatsHandler, getChannelVideosInfoHandler } from '../actions/channel.actions';
import CustomConfirmationDialog from '../Modal/CustomConfirmationDialog';
import EditVideo from '../Modal/EditVideo';
import axiosInstance from '../helper/axiosInstance';

const AdminDashboardScreen = () => {
    const { currentTheme } = useTheme()
    const [selectedItem, setSelectedItem] = useState("");
    const [isSuccess, setSuccess] = useState(false);
    const [isPopupMessageShow, setPopupMessageShow] = useState(false);
    const [channelStats, setChannelStatus] = useState({})
    const [channelVideoInfo, setChannelVideoInfo] = useState([])
    const [editVideoModalVisible, setEditVideoModalVisible] = useState(false)
    const [selectedVideoId, setSelectedVideoId] = useState(null);

    const fetchChannelData = async () => {
        try {
            const response = await axiosInstance.get(`dashboard/stats`)
            setChannelStatus(response.data.data[0]);

            const videoInfoResponse = await axiosInstance.get(`dashboard/videos`)
            setChannelVideoInfo(videoInfoResponse.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchChannelData();
    }, [])

    const handleSwitchStatus = async (videoId) => {
        // console.log(videoId);
        setSelectedItem(videoId)
        try {
            await axiosInstance.patch(`videos/toggle/publish/${videoId}`, {})

            const response = await axiosInstance.get(`dashboard/stats`)
            setChannelVideoInfo(response.data.data);
            setSuccess(true)
        } catch (error) {
            setSuccess(false)
            console.log("Error while getting user channel videos Info ", error);
        } finally {
            setSelectedItem("")
            setPopupMessageShow(true)
            setTimeout(() => setPopupMessageShow(false), 3000);
        }
    }

    const conformDeleteVideo = async (videoId) => {
        try {
            await axiosInstance.delete(`videos/${videoId}`)
            fetchChannelData()
            setSuccess(true)

        } catch (error) {
            setSuccess(false)
        } finally {
            setPopupMessageShow(true)
            setTimeout(() => setPopupMessageShow(false), 3000);
        }
    }

    const handleEditVideo = async (videoId) => {
        setSelectedVideoId(videoId);
        setEditVideoModalVisible(true)
    }

    // onClose for editVideo
    const onClose = () => {
        setSelectedVideoId(null);
        setEditVideoModalVisible(false)
    }

    return (
        <View style={{ flex: 1, backgroundColor: currentTheme.primaryBackgroundColor, }}>
            <HeaderComponent />
            {/* success or faliure popup message  */}
            <PopupMessage isSuccess={isSuccess} title={isSuccess ? "Status successfully changed" : "Status has not changed"} isVisible={isPopupMessageShow} setVisible={setPopupMessageShow} />

            <ScrollView>
                <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 3, paddingHorizontal: 10 }}>
                    <Text style={{ color: currentTheme.primaryTextColor, fontSize: 18 }}>Welcome Back, {channelStats?.fullName}</Text>
                    <Text style={{ color: currentTheme.secondaryTextColor }}>Welcome Back, React Patterns</Text>
                    {/* upload btn  */}

                    <TouchableOpacity onPress={() => showModal()} style={{ backgroundColor: "#AE7AFF", paddingVertical: 10, flexDirection: 'row', gap: 4, paddingLeft: 10, paddingRight: 13, marginTop: 10 }} >
                        <Feather name="plus" size={24} color="black" />
                        <Text style={{ fontSize: 16 }} >upload Video</Text>
                    </TouchableOpacity>
                </View>

                {/* total info  */}
                <View style={{ paddingHorizontal: 10, marginTop: 25, gap: 10 }}>
                    {/* views  */}
                    <View style={{ width: "100%", height: 130, paddingHorizontal: 15, paddingVertical: 15, borderWidth: 1, borderColor: "gray", flexDirection: 'column', alignItems: 'flex-start', gap: 3 }}>
                        <AntDesign name="eyeo" size={24} color="#AE7AFF" style={{ paddingHorizontal: 4, paddingVertical: 4, backgroundColor: '#E4D3FF', marginBottom: 15, borderRadius: 30 }} />
                        <Text style={{ color: currentTheme.secondaryTextColor, fontSize: 15 }}>Total views</Text>
                        <Text style={{ color: currentTheme.secondaryTextColor, fontSize: 22, fontWeight: 'bold' }}>{channelStats?.totalViews}</Text>
                    </View>
                    {/* Total subscribers */}
                    <View style={{ width: "100%", height: 130, paddingHorizontal: 15, paddingVertical: 15, borderWidth: 1, borderColor: "gray", flexDirection: 'column', alignItems: 'flex-start', gap: 3 }}>
                        <FontAwesome6 name="user" size={22} color="#AE7AFF" style={{ paddingHorizontal: 6, paddingVertical: 5, backgroundColor: '#E4D3FF', marginBottom: 15, borderRadius: 50 }} />
                        <Text style={{ color: currentTheme.secondaryTextColor, fontSize: 15 }}>Total subscribers</Text>
                        <Text style={{ color: currentTheme.secondaryTextColor, fontSize: 22, fontWeight: 'bold' }}>{channelStats?.totalSubscribers}</Text>
                    </View>

                    <View style={{ width: "100%", height: 130, paddingHorizontal: 15, paddingVertical: 15, borderWidth: 1, borderColor: "gray", flexDirection: 'column', alignItems: 'flex-start', gap: 3 }}>
                        <AntDesign name="hearto" size={22} color="#AE7AFF" style={{ paddingHorizontal: 4, paddingVertical: 4, backgroundColor: '#E4D3FF', marginBottom: 15, borderRadius: 50 }} />
                        <Text style={{ color: currentTheme.secondaryTextColor, fontSize: 15 }}>Total likes</Text>
                        <Text style={{ color: currentTheme.secondaryTextColor, fontSize: 22, fontWeight: 'bold' }}>{channelStats?.totalVideosLikes}</Text>
                    </View>
                </View>

                {/* table for videos */}
                <ScrollView horizontal style={{ paddingHorizontal: 10, marginVertical: 20, }}>
                    <View style={{ flexDirection: 'column', width: 900, }}>
                        {/* table header  */}
                        <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: "white", borderBottomColor: "gray" }}>
                            <Text style={[{ color: currentTheme.primaryTextColor, width: "10%" }, styles.tableText]} >Status</Text>
                            <Text style={[{ color: currentTheme.primaryTextColor, width: "15%" }, styles.tableText]} >Status</Text>
                            <Text style={[{ color: currentTheme.primaryTextColor, width: "28%" }, styles.tableText]} >Uploaded</Text>
                            <Text style={[{ color: currentTheme.primaryTextColor, width: "20%" }, styles.tableText]} >Rating</Text>
                            <Text style={[{ color: currentTheme.primaryTextColor, width: "16%" }, styles.tableText]} >Date uploaded</Text>
                            <Text style={[{ color: currentTheme.primaryTextColor, width: "20%" }, styles.tableText]} ></Text>
                        </View>

                        {/* table data   */}
                        <FlatList
                            data={channelVideoInfo}
                            keyExtractor={item => item._id}
                            renderItem={({ item }) => (
                                <View>
                                    <DashboardTableComponent item={item} selectedItem={selectedItem} handleSwitchStatus={handleSwitchStatus} conformDeleteVideo={conformDeleteVideo} handleEditVideo={handleEditVideo} />
                                </View>
                            )}
                        />
                        {/* model for edit video  */}
                        <EditVideo isVisible={editVideoModalVisible} videoId={selectedVideoId} onClose={onClose} getAllVideos={fetchChannelData} />

                    </View>
                </ScrollView>

            </ScrollView>

        </View>
    )
}

export default AdminDashboardScreen

const styles = StyleSheet.create({
    tableText: {
        textAlign: "center",
        paddingHorizontal: 2,
        paddingVertical: 14,
        fontWeight: 'bold',
        fontSize: 17,
    },
})