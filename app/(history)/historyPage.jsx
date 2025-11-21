import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const list = [
     {
        id:1,
        title: 'Help nearby',
        icon: 'heart-outline',
        route:'/nearbyHelpHistory'
    },
    {
        id:2,
        title: 'Moments',
        icon: 'images-outline',
        route:'/momentsHistory'
    },
    {
        id: 3,
        title: 'Hangouts & Events',
        icon: 'calendar-outline',
        route:'/impactEventsHistory'
    },
    {
        id:4,
        title: 'Blood Emergency',
        icon: 'water-outline',
        route:'/bloodEmergencyHistory'
    },
    {
        id:5,
        title: 'Missing People',
        icon: 'alert-circle-outline',
        route:'/peopleMissingHistory'
    }
]
const HistoryPage = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.topBar}>
                <MaterialIcons
                    name="arrow-back-ios"
                    size={22} color="black"
                    onPress={() => navigation.goBack()}
                />
                    
                <Text style={styles.heading}>Your History</Text>
                
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
                <View style={{gap:20}}>
                    {list.map((info) => (
                    <TouchableOpacity style={styles.textContainer} key={info.id} onPress={() => router.push(`${info.route}`)}>
                        <Ionicons name={info.icon} size={24} color="#1976D2" />
                        <Text style={styles.text}>{info.title}</Text>
                    </TouchableOpacity>
                ))}
                </View>
            </ScrollView>
        </View>
    )
    
}
export default HistoryPage;


const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "#F8FAFC",
    },
    topBar: {
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 1,
        width: '100%',
        paddingVertical: 15,
        color: "#1E1E1E",
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 500,
    },
    scrollContainer: {
        marginBottom: 60,
        paddingHorizontal:20
    },
    textContainer: {
        borderRadius: 6,
        borderWidth: 1,
        borderColor:'#A3B4C5',
        paddingHorizontal: 20,
        paddingVertical: 16,
        flexDirection: 'row',
        gap: 15,
        alignItems:'center'
    },
    text: {
        fontSize: 18,
        fontWeight: 500,
        color:'#37638E'
    }
})