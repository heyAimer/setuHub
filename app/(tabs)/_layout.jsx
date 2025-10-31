// All routes of Tabs:

import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const TabsLayout = () => {
  return (
   <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: "#3B82F6",
      tabBarInactiveTintColor: "#94A3B8",
      tabBarStyle: {
        backgroundColor: "#F1F5F9",
        paddingBottom: 20,
        height: 75
      }
    }}>
        <Tabs.Screen name="Moments" options={{
            title: "Moments",
            tabBarIcon: ({ color }) => (
            <Ionicons name="earth-outline" size={24} color= {color} />
            )
        }} />
      
        <Tabs.Screen name="HelpNearby" options={{
            title: "HelpNearby",
            tabBarIcon: ({ color }) => (
            <Ionicons name="people-circle-outline" size={24} color= {color} />
            )
        }} />
      
        <Tabs.Screen name="ImpactEvents" options={{
        title: "ImpactEvents",
        tabBarIcon: ({ color }) => (
        <Ionicons name="calendar-outline" size={24} color= {color} />
              )
        }} />
        <Tabs.Screen name="UrgentHelp" options={{
        title: "UrgentHelp",
        tabBarIcon: ({ color }) => (
        <Ionicons name="warning-outline" size={24} color= {color} />
                )
        }} />
        <Tabs.Screen name="Profile" options={{
        title: "Profile",
        tabBarIcon: ({ color }) => (
        <Ionicons name="person-circle-outline" size={24} color= {color} />
              )
        }} />
       
    </Tabs>
  )
}

// now in the (tabs) the file should be named same as the name here you declared eg. home, history, profile

export default TabsLayout
