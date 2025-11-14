import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const list = [
    {
        id:1,
        title: 'Blood Emergency',
        subheading: 'Connecting donors with those in need.',
        icon: 'water-outline',
        route:'/bloodEmergency'
    },
    {
        id:2,
        title: 'Missing People',
        subheading: 'Share, search, and respond — every sighting can bring hope.',
        icon: 'alert-circle-outline',
        route:'/peopleMissing'
    }
]
const UrgentHelp = () => {
    const insets = useSafeAreaInsets();
    return (
        <View style={[styles.container , {paddingTop: insets.top}]}> 
            <Text style={styles.heading}>Help Now</Text>      
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>

                <View style={styles.createPostHeading}>
                    
                    <Text style={{ fontSize: 16, fontWeight: 500 }}>Respond to real-time needs in your community.
                    </Text>

                </View>

                {list.map((info) => (
                    
                    <View style={styles.cards} key={info.id}>
                        <View>
                            <LinearGradient
                                colors={["#A9D4FF", "transparent"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.gradientBox}
                            >
                               <Ionicons name={info.icon} size={30} color="#1976D2" />
                            </LinearGradient>
                        </View>
                        <View style={{flexDirection:'column', gap:4}}>
                            <Text style={{ fontSize: 22, fontWeight: 800 }}>{info.title}</Text>
                            <Text style={{ fontSize: 18, marginBottom: 20, marginTop: 4, color: '#5F6368' }}>{ info.subheading }</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.createPostbtn}
                            onPress={() => router.push(info.route)}
                        >
                            <Ionicons
                                name="eye-outline" size={20} color={'white'}
                            />
                            <Text style={{ color: 'white', fontWeight: 500 }}>View
                            </Text>
                        </TouchableOpacity>
                    </View>))
                }
            </ScrollView>
        </View>
  )
}

export default UrgentHelp

const styles = StyleSheet.create({
    gradientBox: {
        height: 50, // h-24 (24 * 4)
        width: 50,  // w-24
        borderRadius: 6, // rounded-2xl
        marginBottom: 16, // mb-4
        alignItems: "center",
        justifyContent: "center",
    },
    container: {
        flex:1,
        backgroundColor: "#F8FAFC",
        paddingTop:10
    },
    heading: {
        fontSize: 24,
        fontWeight: 700,
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 1,
        width: '100%',
        textAlign:'center',
        paddingVertical: 15,
        color: "#1E1E1E",
        marginBottom:20,
    },
    scrollContainer: {
        paddingBottom: 60,
        paddingHorizontal: 20,
        gap:20
    },
    createPostHeading: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#EDF4FF',
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderRadius: 6,
        borderWidth: 1,
        borderColor:'#E2EEFD'
    },
    createPostbtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 7,
        paddingLeft: 9,
        borderRadius: 4,
        paddingRight: 12,
        backgroundColor: '#1976D2',
        alignSelf:'flex-end'
    },
    cards: {
        flexDirection: 'column',
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#E2EEFD',
        backgroundColor:'#F4F9FF'
    },
})