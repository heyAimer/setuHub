import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const UrgentHelp = () => {
    return (
        <SafeAreaView style={styles.container}> 
            <View>
                <Text>
                    Help NearBy
                </Text>
            </View>
        </SafeAreaView>
  )
}

export default UrgentHelp

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "#F8FAFC",
    }
})